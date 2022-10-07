import ImageUpload from "./ImageUpload";
import AudioUpload from "./AudioUpload";

const MediaUpload = (props:any) =>  (
  <>
    <ImageUpload label="Upload NFT Art (Required)" nftImage={props.nftImage} setNftImage={props.setNftImage} formRegisterName="nftImage" />
    <AudioUpload audioFile={props.audioFile} setAudioFile={props.setAudioFile} formRegisterName="audioFile" />
  </>
)

export default MediaUpload