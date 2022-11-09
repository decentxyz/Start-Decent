import { Alchemy, Network } from "alchemy-sdk";

// only configured for Ethereum right now
const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const setAllowList = async () => {

  // enter Adam's contract addresses
  // const address = "0xe785E82358879F061BC3dcAC6f0444462D4b5330";
  // address I own for testing
  const address = "0xcDc07A4a4d890B399Ec3ffb33BEecF6554b93486";

  // Get owners 
  const owners = await alchemy.nft.getOwnersForContract(address);
  return owners;
};

export default setAllowList;