import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { DecentSDK, edition, ipfs } from '@decent.xyz/sdk'; //Note: not using ipfs in demo
import { useSigner, useNetwork } from 'wagmi';
import { ethers } from "ethers";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import getDeploymentMetadata from "../lib/getDeploymentMetadata";

const schema = yup.object().shape({
  collectionName: yup.string()
    .required('Name your collection.'),
  symbol: yup.string()
    .required('Give your collection a symbol.'),
  tokenPrice: yup.number()
    .typeError('Must set price for token. Please set to 0 if you wish for your NFTs to be free.'),
  // editionSize: yup.number()
  //   .min(1, 'Edition size must be greater than 0')
  //   .typeError('Please enter the number of NFTs included in this collection.'),
  // maxTokenPurchase: yup.lazy((value) => {
  //   return value === ''
  //     ? yup.string()
  //     : yup.number()
  //       .typeError('Cap must be a valid number. Please set to 0 if you do not wish to set a cap.')
  // }),
  // royalty: yup.lazy((value) => {
  //   return value === ''
  //     ? yup.string()
  //     : yup.number()
  //       .typeError('Royalty must be a valid number. Please set to 0 if you do not wish to set a royalty.')
  // }),
});

type FormData = {
  collectionName: string;
  symbol: string;
  // description: string;
  // editionSize: number;
  tokenPrice: string;
  // maxTokenPurchase: number;
  // royalty: number;
};

const CreateNft: React.FC<any> = ({ generatedImage }) => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { register, getValues, handleSubmit, clearErrors, reset, formState: { errors, isValid } } = methods;
  const onSubmit = handleSubmit(data => console.log(data));

  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState('');

  const resetForm = () => {
    clearErrors();
  }

  const getMetadata = async () => {
    const ipfsHash = await getDeploymentMetadata({
      image: generatedImage,
      name: getValues("collectionName"),
      description: "Created with the Decent Protocol and Stable Diffusion",
      title: getValues("collectionName"),
    })
    return ipfsHash
  }

  const success = (nft:any) => {
    setShowLink(true);
    setLink(nft.address);
  }

  const deployFunction = async () => {
    try {
      if (!signer) {
        console.error("Please connect wallet.")
      } else if (chain) {
        const ipfsHash = await getMetadata().then((res: any) => {
          return res
        });
        
        const onChainMetadata = (chain.id === 1) ?
            null :
            {
              description: ipfsHash.data.description || "",
              imageURI: ipfsHash.data.image.href || "",
              animationURI: ipfsHash.data.animation_url.href || "",
            }

        const sdk = new DecentSDK(chain.id, signer);

        let nft;
        try {
          nft = await edition.deploy(
            sdk,
            getValues("collectionName"),
            "DCNTAI",
            1,
            ethers.utils.parseEther(getValues("tokenPrice")),
            1,
            1000,
            `${ipfsHash.url}?`,
            onChainMetadata
          );
        } catch (error) {
          console.error(error);
        } finally {
          if (nft?.address) {
            success(nft);
            reset();
          }
        }
      } return
    } catch (error: any) {
      if (error.code === "INSUFFICIENT FUNDS") {
        console.error("get more $$, fren");
      }
    }
  }


  if (!generatedImage) return null

  return (
    <FormProvider {...methods}>
    <form onSubmit={onSubmit} className='gap-4 lg:mx-24 sm:mx-16'>
    <div className="flex flex-wrap items-center gap-12">
      <div>
        <p className="font-header">Artwork Title</p>
        <input className="text-slate-400 create-field" {...register("collectionName", {required: "Name your collection"} )} />
        <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="collectionName" /></p>
      </div>

      {/* <div>
        <p className="font-header">Symbol</p>
        <input className="text-slate-400 create-field" {...register("symbol", {required: "Give your collection a symbol"} )} />
        <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="symbol" /></p>
      </div> */}

      <div>
        <p className="font-header">Token Price</p>
        <input className="text-slate-400 create-field" {...register("tokenPrice", {required: "Must set price for token.  Please set to 0 if you wish for your NFTs to be free."} )} />
        <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="tokenPrice" /></p>
      </div>
    </div>

    <div className="flex justify-between items-center">
      <button className="pt-8 flex gap-4 items-center" type="button" onClick={() => deployFunction()}>
        <input type="submit" className="cursor-pointer bg-white text-slate-400 px-4 py-1 rounded-full"/>
      </button>
      <button onClick={() => resetForm()}>
        <input type="reset" className="cursor-pointer"/>
      </button>
    </div>
    <p className="italic text-xs pt-4">{showLink ? `Edition created! Paste this into the blockscanner of your chain of choice to verify ${link}` : 'be patient, wallet confimration can take a sec'}</p>
    <p className="italic text-xs pt-4">*All NFTs automatically include a 10% creator royalty shared between the artist and project creator.</p>
    {/* lets route this through a splits contract where we take 1/2 */}
    </form>
    </FormProvider>
  )
}

export default CreateNft