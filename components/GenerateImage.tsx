import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from 'next/image';
import Spinner from "./Spinner";

const schema = yup.object().shape({
  prompt: yup.string().required('Prompt is required to generate an image.').min(10, 'Prompt must be at least 10 characters. The longer the prompt the better the image!'),
});

type FormData = {
  prompt: string;
};

const GenerateImage: React.FC<any> = () => {
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods;
  const onSubmit = handleSubmit(async (data: FormData) => 
  {
    await generateImage(data.prompt);
  });

  const [generatedImageUrl, setGeneratedImageUrl] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const method = "normal";
  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    try {
        const res = await fetch(`/api/generate?prompt=${prompt}`)
        const data = await res.json();
        console.log(data.image_url);
        setGeneratedImageUrl(data.image_url);
        setIsLoading(false);
    } catch (error) {
        console.error(error);
        setIsLoading(false);
    }
}

  return (
    <div className="w-full">
    <FormProvider {...methods}>
        <form onSubmit={onSubmit} className='gap-4 w-full flex justify-center px-4'>
            <div className="flex flex-wrap items-center gap-4 w-full max-w-2xl">
                <div className="w-full">
                    <input placeholder="Enter a prompt to generate an image" className="border border-black text-black prompt-field w-full text-center" {...register("prompt")} />
                    <p className="text-red-600 text-sm"><ErrorMessage errors={errors} name="prompt" /></p>
                </div>

                <div className="flex justify-center w-full gap-2">
                    <button 
                        className="p-3 flex gap-4 items-center bg-white rounded-md border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-black font-bold"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {!generatedImageUrl ? (!isLoading ? 'Generate your Image' : <Spinner height={28} width={28} color='text-black' />) : 'Try Generating Again?'}
                    </button>
                </div>
                <div className="w-full">
                    {!isLoading && generatedImageUrl && 
                        <div className="w-full flex justify-center">
                            <Image 
                                height={382} 
                                width={382} 
                                src={generatedImageUrl} 
                                alt='Generated image from user prompt'
                                className="rounded-md border-2 border-white" 
                            />
                        </div>
                      </div>
                    }
                </div>
            </div>
        </form>
    </FormProvider>
    </div>
  )
}

export default GenerateImage