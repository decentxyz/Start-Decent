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
    <label>
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
      <div className="relative cursor-pointer w-full flex items-center justify-center border border-gray-400 border-dashed rounded-md mt-6 gap-3 p-2">
        <p style={{ left:17, top:9 }}>
          <Image
            title=""
            width={68}
            height={59.23}
            src={nftImage.preview}
            alt="nft image"
          />
        </p>
        <div>
          <p className="upload-header">{label}</p>
          <p className="upload-subtext">Image, video, pdfs, 3D {"&"} html</p>
        </div>
      </div>
      <p className="error-text"><ErrorMessage errors={errors} name={formRegisterName} /></p>
    </label>
  );
};

export default ImageUpload;
