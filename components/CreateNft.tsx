import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { DecentSDK, edition, ipfs } from '@decent.xyz/sdk'; //Note: not using ipfs in demo
import { useSigner, useNetwork } from 'wagmi';
import { ethers } from "ethers";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import getDeploymentMetadata from "../lib/getDeploymentMetadata";
import InfoField from "./InfoField";

const schema = yup.object().shape({
  collectionName: yup.string()
    .required('Name your collection.'),
  symbol: yup.string()
    .required('Give your collection a symbol.'),
  tokenPrice: yup.number()
    .typeError('Must set price for token. Please set to 0 if you wish for your NFTs to be free.'),
  royalty: yup.lazy((value) => {
    return value === ''
      ? yup.string()
      : yup.number()
        .typeError('Royalty must be a valid number. Please set to 0 if you do not wish to set a royalty.')
  }),
});

type FormData = {
  collectionName: string;
  symbol: string;
  tokenPrice: string;
  royalty: number;
};

const CreateNft: React.FC<any> = ({ generatedImage }) => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);

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
    console.log("image", generatedImage)
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
          console.log("deploying")
          nft = await edition.deploy(
            sdk,
            getValues("collectionName"),
            "DCNTAI",
            1,
            ethers.utils.parseEther(getValues("tokenPrice")),
            1,
            getValues("royalty") * 100,
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
      <form onSubmit={onSubmit} className='gap-4 sm:mx-20 bg-black bg-opacity-10 drop-shadow-lg p-8 text-black tracking-widest font-[500]'>
        <div className="flex w-full justify-between items-center pb-8">
          <p className="text-2xl">Turn Image into an NFT</p>
          <button onClick={() => resetForm()}>
            <input type="reset" className="cursor-pointer tracking-widest font-[500] text-xs"/>
          </button>
        </div>
        <div className="flex items-center justify-center flex-wrap gap-8">
          <div>
            <p className="font-header py-2">Artwork Title</p>
            <input className="create-field" {...register("collectionName", {required: "Name your collection"} )} />
            <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="collectionName" /></p>
          </div>

          <div>
            <div className="py-2 flex items-center gap-1">
              <p className="font-header">Sale Price</p>
              <InfoField isHovering={isHovering1} setIsHovering={setIsHovering1} xDirection={'left'} yDirection={'bottom'} infoText={"This image will be automatically listed for sale on NFT platforms like OpenSea.  How much would you like to charge for it?"} />
            </div>
            <input className="create-field" {...register("tokenPrice", {required: "Must set price for token.  Please set to 0 if you wish for your NFTs to be free."} )} />
            <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="tokenPrice" /></p>
          </div>

          {/* Decent contracts support EIP 2981 */}
          <div>
            <div className="py-2 flex items-center gap-1">
              <p className="font-header">Creator Royalty (Optional)</p>
              <InfoField isHovering={isHovering2} setIsHovering={setIsHovering2} xDirection={'left'} yDirection={'bottom'} infoText={"Please enter a percentage that you would like to receive from the value of every sale."} />
            </div>
            <div className="flex items-center w-fit text-black relative">
              <input 
                className="create-field" {...register("royalty")} />
              <p className="text-sm absolute right-3">%</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div>
            <button className="w-full flex justify-center" type="button" onClick={() => deployFunction()}>
              <input type="submit" className="cursor-pointer tracking-widest font-[500] text-white bg-black px-4 py-1"/>
            </button>
            <p className="italic text-xs pt-4">{showLink ? `Edition created! Paste this into the blockscanner of your chain of choice to verify ${link}` : 'be patient, wallet confimration can take a sec'}</p>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export default CreateNft