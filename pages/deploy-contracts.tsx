import { useState } from "react";
import { NextPage } from "next";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { DecentSDK, edition, ipfs } from '@decent.xyz/sdk'; //Note: not using ipfs in demo
import { useSigner, useNetwork } from 'wagmi';
import { ethers } from "ethers";
import InfoField from "../components/InfoField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import getDeploymentMetadata from "../lib/getDeploymentMetadata";
import MediaUpload from "../components/MediaUpload/MediaUpload";

const schema = yup.object().shape({
  collectionName: yup.string()
    .required('Name your collection.'),
  symbol: yup.string()
    .required('Give your collection a symbol.'),
  tokenPrice: yup.number()
    .typeError('Must set price for token. Please set to 0 if you wish for your NFTs to be free.'),
  editionSize: yup.number()
    .min(1, 'Edition size must be greater than 0')
    .typeError('Please enter the number of NFTs included in this collection.'),
  maxTokenPurchase: yup.lazy((value) => {
    return value === ''
      ? yup.string()
      : yup.number()
        .typeError('Cap must be a valid number. Please set to 0 if you do not wish to set a cap.')
  }),
  royalty: yup.lazy((value) => {
    return value === ''
      ? yup.string()
      : yup.number()
        .typeError('Royalty must be a valid number. Please set to 0 if you do not wish to set a royalty.')
  }),
  nftImage: yup.mixed()
    .test('file', 'Upload your NFT art.', (value) => {
      return value?.length > 0;
    }),
});

type FormData = {
  collectionName: string;
  symbol: string;
  description: string;
  nftImage: any;
  audioFile: any;
  editionSize: number;
  tokenPrice: string;
  maxTokenPurchase: number;
  royalty: number;
};

const Deploy: NextPage = () => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();

  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { register, getValues, handleSubmit, clearErrors, reset, formState: { errors, isValid } } = methods;
  const onSubmit = handleSubmit(data => console.log(data));

  const [nftImage, setNftImage] = useState({ preview: '/images/icon.png', raw: { type: "" } });
  const [audioFile, setAudioFile] = useState({ preview: '/images/icon.png', raw: { type: "" } });
  const [showLink, setShowLink] = useState(false);
  const [link, setLink] = useState('');

  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const [isHovering3, setIsHovering3] = useState(false);

  const resetForm = () => {
    clearErrors();
  }

  const getMetadata = async () => {
    const ipfsHash = await getDeploymentMetadata({
      image: nftImage,
      name: getValues("collectionName"),
      description: getValues("description"),
      title: getValues("collectionName"),
      audioFile: audioFile
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
            getValues("symbol"),
            getValues("editionSize"),
            ethers.utils.parseEther(getValues("tokenPrice")),
            getValues("maxTokenPurchase") || 0,
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


  return (
    <>
    <div className="background min-h-screen text-white py-24 px-16">
      <div className="flex flex-wrap space-x-10 justify-center">
        <div className="space-y-8 pb-8 text-center">
          <h1>Reference Implementation</h1>
          <p className="w-96">{`Deploy Decent's 721A contract and use the Metadata Renderer modulet to view your contract on the blockscanner of your choice.  The Decent Protocol currently supports Ethereum, Arbitrum, Optimism, Polygon, and zkSync's testnet.`}</p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>

    <FormProvider {...methods}>
    <form onSubmit={onSubmit} className='gap-4 lg:mx-24 sm:mx-16'>

      <div className="flex justify-between pb-6">
        <h3 className="font-header text-2xl">Create Your 721A</h3>
        <button onClick={() => resetForm()}>
          <input type="reset" className="cursor-pointer"/>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-12">
        <div>
          <p className="font-header">Collection Name</p>
          <input className="border border-black text-black" {...register("collectionName", {required: "Name your collection"} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="collectionName" /></p>
        </div>

        <div>
          <div className="pb-2 flex gap-1 items-center">
            <p className="font-header">Edition Size</p>
            <InfoField isHovering={isHovering1} setIsHovering={setIsHovering1} xDirection={'right'} yDirection={'bottom'} infoText={"Number of NFTs available in the collection."} />
          </div>
          <input className="border border-black text-black" {...register("editionSize")} />
        </div>

        <div>
          <div className="pb-2 flex gap-1 items-center">
            <p className="font-header">Purchase Count (Optional)</p>
            <InfoField isHovering={isHovering2} setIsHovering={setIsHovering2} xDirection={'right'} yDirection={'bottom'} infoText={"Enter the number of NFTs each user can mint at one time.."} />
          </div>
          <input className="border border-black text-black" {...register("maxTokenPurchase" )} />
        </div>

        <div>
          <p className="font-header">Symbol</p>
          <input className="border border-black text-black" {...register("symbol", {required: "Give your collection a symbol"} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="symbol" /></p>
        </div>

        <div>
          <p className="font-header">Token Price</p>
          <input className="border border-black text-black" {...register("tokenPrice", {required: "Must set price for token.  Please set to 0 if you wish for your NFTs to be free."} )} />
          <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="tokenPrice" /></p>
        </div>

        {/* Decent contracts support EIP 2981 */}
        <div>
          <div className="pb-2 flex gap-1">
            <p>Creator Royalty (Optional)</p>
            <InfoField isHovering={isHovering3} setIsHovering={setIsHovering3} xDirection={'left'} yDirection={'bottom'} infoText={"Please enter a percentage that you would like to receive from the value of every sale.  We use EIP 2981."} />
          </div>
          <div className="flex items-center w-fit text-black relative">
            <input 
              className="border border-black" {...register("royalty")} />
            <p className="text-sm absolute right-3">%</p>
          </div>
        </div>
      </div>

      <div>
        <p className="font-header">Description</p>
        <textarea className="border border-black text-black w-1/2" {...register("description", {required: "Please enter a description."} )} />
        <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="description" /></p>
      </div>

      <MediaUpload nftImage={nftImage} setNftImage={setNftImage} audioFile={audioFile} setAudioFile={setAudioFile} />

      <button className="pt-8 flex gap-4 items-center" type="button" onClick={() => deployFunction()}>
        <input type="submit" className="cursor-pointer bg-white text-black px-4 py-1 rounded-full"/>
      </button>
      <p className="italic text-xs pt-4">{showLink ? `Edition created! Paste this into the blockscanner of your chain of choice to verify ${link}` : 'be patient, wallet confimration can take a sec'}</p>
      </form>
      </FormProvider>
    </div>
  </>
  )
}

export default Deploy