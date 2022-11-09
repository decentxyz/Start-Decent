import { Alchemy, Network } from "alchemy-sdk";
import { useState } from "react";

// only configured for Ethereum right now
const config = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const fetchOwners = async () => {
  // enter Adam's contract addresses
  // const address = "0xe785E82358879F061BC3dcAC6f0444462D4b5330";
  // address I own for testing
  const address = "0xcDc07A4a4d890B399Ec3ffb33BEecF6554b93486";

  // Get owners 
  const owners = await alchemy.nft.getOwnersForContract(address);
  console.log(owners.owners);
  return owners.owners;
};

const setAllowList = async () => {
  
  try {
    await fetchOwners();
  } catch (error) {
    console.log(error);
  }
}

export default setAllowList;