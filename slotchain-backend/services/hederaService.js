const {
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  AccountId,
  Hbar,
  PrivateKey
} = require('@hashgraph/sdk');

const client = (() => {
  if (process.env.HEDERA_NETWORK === 'testnet') {
    return Client.forTestnet();
  } else {
    return Client.forMainnet();
  }
})();

if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
  client.setOperator(
    AccountId.fromString(process.env.HEDERA_ACCOUNT_ID),
    PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY)
  );
}

class HederaService {
  async createNFTCollection(name, symbol, maxSupply = 10000) {
    try {
      const transaction = new TokenCreateTransaction()
        .setTokenName(name)
        .setTokenSymbol(symbol)
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(maxSupply)
        .setTreasuryAccountId(client.operatorAccountId)
        .setSupplyKey(client.operatorPublicKey)
        .setAdminKey(client.operatorPublicKey)
        .freezeWith(client);

      const signedTx = await transaction.sign(client.operatorPrivateKey);
      const response = await signedTx.execute(client);
      const receipt = await response.getReceipt(client);

      return {
        tokenId: receipt.tokenId.toString(),
        transactionId: response.transactionId.toString()
      };
    } catch (error) {
      throw new Error(`Failed to create NFT collection: ${error.message}`);
    }
  }

  async mintNFT(tokenId, metadata) {
    try {
      const metadataBuffer = Buffer.from(JSON.stringify(metadata));
      const transaction = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata([metadataBuffer])
        .freezeWith(client);

      const signedTx = await transaction.sign(client.operatorPrivateKey);
      const response = await signedTx.execute(client);
      const receipt = await response.getReceipt(client);

      return {
        serialNumber: receipt.serials[0]?.low,
        transactionId: response.transactionId.toString()
      };
    } catch (error) {
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  async transferHbar(toAccountId, amount) {
    try {
      const transaction = new TransferTransaction()
        .addHbarTransfer(client.operatorAccountId, new Hbar(-amount))
        .addHbarTransfer(AccountId.fromString(toAccountId), new Hbar(amount))
        .freezeWith(client);

      const signedTx = await transaction.sign(client.operatorPrivateKey);
      const response = await signedTx.execute(client);
      const receipt = await response.getReceipt(client);

      return {
        transactionId: response.transactionId.toString(),
        status: receipt.status.toString()
      };
    } catch (error) {
      throw new Error(`Failed to transfer HBAR: ${error.message}`);
    }
  }

  async getAccountBalance(accountId) {
    try {
      const balance = await client.getAccountBalance(AccountId.fromString(accountId));
      return balance.hbars.toString();
    } catch (error) {
      throw new Error(`Failed to get account balance: ${error.message}`);
    }
  }
}

module.exports = new HederaService();
