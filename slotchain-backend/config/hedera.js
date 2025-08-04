const { Client, AccountId, PrivateKey } = require('@hashgraph/sdk');

const hederaClient = () => {
  if (process.env.HEDERA_NETWORK === 'testnet') {
    return Client.forTestnet();
  } else if (process.env.HEDERA_NETWORK === 'mainnet') {
    return Client.forMainnet();
  } else {
    throw new Error('Invalid HEDERA_NETWORK environment variable; must be "testnet" or "mainnet".');
  }
};

const client = hederaClient();

if (process.env.HEDERA_ACCOUNT_ID && process.env.HEDERA_PRIVATE_KEY) {
  const operatorId = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
  client.setOperator(operatorId, operatorKey);
} else {
  console.warn('Hedera account ID or private key not set in environment variables.');
}

module.exports = client;
