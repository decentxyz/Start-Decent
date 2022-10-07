import Image from "next/image";
import { useFormContext } from "react-hook-form";

const AudioUpload = ({ audioFile, setAudioFile, formRegisterName }: any) => {
  const { register } = useFormContext();

  const updateAudioFile = (e:any) => {
    setAudioFile({
      preview: "/icons/success.png",
      raw: e.target.files[0],
    });
  };

  return (
    <label>
      <input
        type="file"
        style={{ display: "none" }}
        {...register(formRegisterName, {
          onChange: updateAudioFile,
        })}
      />
      <div className="relative cursor-pointer w-full flex items-center justify-center border border-gray-400 border-dashed rounded-md mt-6 gap-3 p-2">
        <p style={{ left:17, top:9 }}>
          <Image
            title=""
            width={68}
            height={59.23}
            src={audioFile.preview}
            alt="nft image"
          />
        </p>
        <div>
          <p className="upload-header">Upload Audio (Optional)</p>
          <p className="upload-subtext">mp3 or .wav</p>
        </div>
      </div>
    </label>
  );
};

export default AudioUpload;
