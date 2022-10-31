import ImageUpload from "./ImageUpload";

const MediaUpload = (props:any) =>  (
  <>
  <ImageUpload label="Upload NFT Art (Required)" nftImage={props.nftImage} setNftImage={props.setNftImage} formRegisterName="nftImage" />
  </>
)

export default MediaUpload