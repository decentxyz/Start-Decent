import { useState } from "react";
import { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { DecentSDK, edition, ipfs } from '@decent.xyz/sdk'; //Note: not using ipfs in demo
import { useSigner, useNetwork } from 'wagmi';
import { ethers } from "ethers";
import { toast } from "react-toastify";
import InfoField from "../components/InfoField";

type FormData = {
  collectionName: string;
  symbol: string;
  editionSize: number;
  tokenPrice: string;
  maxTokenPurchase: number;
  royalty: number;
};

const Deploy: NextPage = () => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const methods = useForm<FormData>();
  const { register, getValues, handleSubmit, clearErrors, reset, formState: { errors } } = methods;
  const onSubmit = handleSubmit(data => console.log(data));

  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const [isHovering3, setIsHovering3] = useState(false);

  const resetForm = () => {
    clearErrors();
  }

  const deployFunction = async () => {
    console.log(signer)
    try {
      if (!signer) {
        toast.error("Please connect wallet.")
      } else {

        const sdk = new DecentSDK(chain?.id || 1, signer);

        let nft;
        try {
          nft = await edition.deploy(
            sdk,
            getValues("collectionName"),
            getValues("symbol"),
            getValues("editionSize"),
            ethers.utils.parseEther(getValues("tokenPrice")),
            getValues("maxTokenPurchase"),
            getValues("royalty") * 100,
            `ipfsHashUrl`, // you'll want to use Decent's metadata renderer module here; please see the docs 
            null,
          );
        } catch (error) {
          console.error(error);
        } finally {
          if (nft?.address) {
            toast.success(<a target="__blank" href={`/${chain?.id}/Editions/${nft.address}`}>Editions created! View on blockscanner.</a>, { autoClose: false, closeOnClick: false });
            reset();
          }
        }
      }
    } catch (error: any) {
      if (error.code === "INSUFFICIENT FUNDS") {
        console.error("get more $$");
      }
    }
  }


  return (
    <>
    <div className="background min-h-screen text-white py-24 px-16">
      <div className="flex flex-wrap space-x-10 justify-center">
        <div className="space-y-8 pb-8 text-center">
          <h1>Reference Implementation</h1>
          <p className="w-96">{`Deploy Decent's 721A contract and view your contract on the blockscanner of your choice.  The Decent Protocol currently supports Ethereum, Arbitrum, Optimism, Polygon, and zkSync's testnet.`}</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>

    <form onSubmit={onSubmit} className='gap-4'>

      <div className="flex justify-between pb-6">
        <h3 className="font-header text-2xl">Create Your 721A</h3>
        <button onClick={() => resetForm()}>
          <input type="reset" className="cursor-pointer"/>
        </button>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="font-header">Collection Name</p>
          <input className="border border-black text-black" {...register("collectionName", {required: "Name your collection"} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="collectionName" /></p>
        </div>

        <div>
          <p className="font-header">Symbol</p>
          <input className="border border-black text-black" {...register("symbol", {required: "Give your collection a symbol"} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="symbol" /></p>
        </div>

        <div>
          <div className="pb-2 flex gap-1">
            <p className="font-header">Edition Size</p>
            <InfoField isHovering={isHovering1} setIsHovering={setIsHovering1} xDirection={'left'} yDirection={'bottom'} infoText={"Number of NFTs available in the collection."} />
          </div>
          <input className="border border-black text-black" {...register("editionSize")} />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div>
          <p className="font-header">Token Price</p>
          <input className="border border-black text-black" {...register("tokenPrice", {required: "Must set price for token.  Please set to 0 if you wish for your NFTs to be free."} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="tokenPrice" /></p>
        </div>

        <div>
          <div className="pb-2 flex gap-1">
            <p className="font-header">Purchase Count</p>
            <InfoField isHovering={isHovering2} setIsHovering={setIsHovering2} xDirection={'left'} yDirection={'bottom'} infoText={"Enter the number of NFTs each user can mint at one time.."} />
          </div>
          <input className="border border-black text-black" {...register("maxTokenPurchase" )} />
        </div>

        {/* Decent contracts support EIP 2981 */}
        <div>
          <div className="pb-2 flex gap-1">
            <p>Creator Royalty</p>
            <InfoField isHovering={isHovering3} setIsHovering={setIsHovering3} xDirection={'left'} yDirection={'bottom'} infoText={"Please enter a percentage that you would like to receive from the value of every sale."} />
          </div>
          <div className="flex items-center w-fit text-black relative">
            <input 
              className="border border-black" {...register("royalty")} />
            <p className="text-sm absolute right-3">%</p>
          </div>
        </div>
      </div>

      <button className="pt-8" type="button" onClick={() => deployFunction()}>
        <input type="submit" className="cursor-pointer"/>
      </button>
      </form>
    </div>
  </>
  )
}

export default Deploy