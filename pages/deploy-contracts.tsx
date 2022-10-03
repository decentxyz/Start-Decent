import { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { DecentSDK, edition, ipfs } from '@decent.xyz/decent-sdk-private-v0'; //Note: not using ipfs in demo
import { useSigner, useNetwork } from 'wagmi';
import { ethers } from "ethers";
import Image from 'next/image';
import { toast } from "react-toastify";

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
          <p><label className="font-header">Collection Name</label></p>
          <input className="border border-black text-black" {...register("collectionName", {required: "Name your collection"} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="collectionName" /></p>
        </div>

        <div>
          <p><label className="font-header">Symbol</label></p>
          <input className="border border-black text-black" {...register("symbol", {required: "Give your collection a symbol"} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="symbol" /></p>
        </div>

        <div>
          <div>
            <label className="font-header">Edition Size</label>
            <span className="pl-1 cursor-pointer group relative">
              <div className="group-hover:visible invisible bg-slate-900 rounded-md absolute left-0 w-64 drop-shadow p-4">
                <Image src='/images/whitestar.png' height={10} width={10} alt="cool icon" />
                <span className='pl-2 text-xs  text-white pt-1 pb-3'>
                Number of NFTs available in the collection.
                </span>
              </div>
              <Image height={12} width={12} src="/images/infographic.png" alt="infographic" />
            </span>
          </div>
          <input className="border border-black text-black" {...register("editionSize")} />
        </div>

        <div>
          <p><label className="font-header">Token Price</label></p>
          <input className="border border-black text-black" {...register("tokenPrice", {required: "Must set price for token.  Please set to 0 if you wish for your NFTs to be free."} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="tokenPrice" /></p>
        </div>

        <div>
          <div>
            <label className="font-header">Purchase Count</label>
            <span className="pl-1 cursor-pointer group relative">
              <div className="group-hover:visible invisible bg-slate-900 rounded-md absolute right-0 w-64 drop-shadow p-4">
                <Image src='/images/whitestar.png' height={10} width={10} alt="cool icon" />
                <span className='pl-2 text-xs  text-white pt-1 pb-3'>
                Enter the number of NFTs each user can mint at one time.
                </span>
              </div>
              <Image height={12} width={12} src="/images/infographic.png" alt="infographic" />
            </span>
          </div>
          <input className="border border-black text-black" {...register("maxTokenPurchase" )} />
        </div>
      </div>

      {/* Decent contracts support EIP 2981 */}
      <div className="pb-2">
      <label>Creator Royalty</label>
      <span className="pl-1 cursor-pointer group relative">
        <div className="group-hover:visible invisible bg-slate-900 rounded-md absolute left-0 bottom-0 w-64 drop-shadow p-4">
          <Image src='/images/whitestar.png' height={10} width={10} alt="cool icon" />
          <span className='pl-2 text-xs  text-white pt-1 pb-3'>
          Please enter a percentage that you would like to receive from the value of every sale.
          </span>
        </div>
        <Image height={12} width={12} src="/images/infographic.png" alt="infographic" />
      </span>
    </div>
    <div className="flex items-center w-fit text-black relative">
      <input 
        className="border border-black" {...register("royalty")} />
      <p className="text-sm absolute right-3">%</p>
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