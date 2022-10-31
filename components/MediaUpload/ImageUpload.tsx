import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

const ImageUpload = ({ nftImage, setNftImage, formRegisterName, label }: any) => {
  const { register, formState: { errors } } = useFormContext();

  const updateNftImage = (e:any) => {
    if (e.target.files.length) {
      setNftImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  return (
    <label className="flex justify-center">
      <input
        type="file"
        style={{ display: "none" }}
        {...register(formRegisterName, {
          onChange: updateNftImage,
          required: "Upload your NFT art.",
          validate: () => {
            return nftImage?.raw?.type != "";
          }
        })}
      />
      <div className="relative h-96 w-96 border border-white rounded-md">
        <div style={{ height: "100%", width: "100%" }}>
          <Image className="rounded-md" src={nftImage.preview} fill object-fit='contain' alt='your nft' />
        </div>
      </div>
      <p className="error-text"><ErrorMessage errors={errors} name={formRegisterName} /></p>
    </label>
  );
};

export default ImageUpload;
