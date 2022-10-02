import { useState } from "react";
import { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Editions from "../components/deploy-functions/deployEdition";
// import Rentable from "../components/deploy-functions/deployRentable";
// import Crescendo from "../components/deploy-functions/deployCrescendo";
// import TreasuryBacked from "../components/deploy-functions/deployTreasuryBacked";
// import Treasury from "../components/deploy-functions/deployTreasury";
// import Staking from "../components/deploy-functions/deployStaking";

const Deploy: NextPage = () => {

  const [selection, setSelection] = useState('');

  const indicies = [
    "Editions",
    "Rentable",
    "Crescendo",
    "TreasuryBacked",
    "Treasury",
    "Staking"
  ]

  const createContract = [
    {key: 0, content: <Editions />},
    // {key: 1, content: <Rentable />},
    // {key: 2, content: <Crescendo />},
    // {key: 3, content: <TreasuryBacked />},
    // {key: 4, content: <Treasury />},
    // {key: 5, content: <Staking />},
  ]

  return (
    <div className="background min-h-screen text-white py-24 px-16">
      <div className="flex flex-wrap space-x-10 justify-center">
        <div className="space-y-8 pb-8 text-center">
          <h1>Explore Decent Contracts</h1>
          <p>{`Select an option to deploy and view your contract on the blockscanner of your choice.  The Decent Protocol currently supports Ethereum, Arbitrum, Optimism, Polygon, and zkSync's testnet.`}</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>

        {indicies.map((item, i) => (
          <button className="h-fit p-4 border border-white rounded-md flex text-center items-center justify-center" key={i} onClick={() => setSelection(item)}>
            {item}
          </button>
        ))}
    </div>
    <div className="p-20">
      {selection && createContract[indicies.indexOf(selection)].content}
    </div>
  </div>
  )
}

export default Deploy