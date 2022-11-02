import { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from 'next/image'
import GuessWord from "./GuessWords";

const schema = yup.object().shape({
  prompt: yup.string()
    .required('Prompt is required to generate an image.')
    .min(20, 'Prompt must be at least 20 characters. Too short isnt enough of a challenge!')
    .test('4_word_minimum', 'Prompt must contain at least four words.', (value) => {
      if (value) {
        const words = value.split(' ');
        return words.length >= 4;
      }
      return false;
    }),
});

type FormData = {
  prompt: string;
};

const GenerateImage: React.FC<any> = ({ setGeneratedImage }, page) => {
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
  const [hint, setHint] = useState<any>({});
  const [hintLoading, setHintLoading] = useState(false);

  useEffect(() => {
    const getHint = async () => {
      setHintLoading(true);
      try {
        const response = await fetch('/api/secretWords/hint');
        const data = await response.json();
        const words: string[] = data.wordLengths
          .map((l: number) => Array.from(Array(l).keys()).map(() => '*').join('') )
          // If we passed the `data.lastLetter` array, this would show the letter
          .map((w: string, i: number) => !!data.lastLetter ? `${w.substring(0, w.length-1)}${data.lastLetter[i]}` : w)
        setHint({
          ...data,
          words
        });
        setHintLoading(false);
      } catch (error) {
        console.error(error);
        setHintLoading(false);
      }
    }
    getHint();
  }, []);

  const method = "game";
  const generateImage = async (prompt: string) => {
    setIsLoading(true);
    try {
        console.log(`Generating image with prompt: ${prompt}`);
        const res = await fetch(`/api/generate?method=${method}&prompt=${prompt}`)
        const blob = await res.blob()
        const imageObjectURL = URL.createObjectURL(blob);
        setGeneratedImageUrl(imageObjectURL);
        setGeneratedImage(blob);
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
                    <div className="text-slate-400 w-full create-field bg-white flex gap-1 justify-center">
                      {!hintLoading && hint.words && <span className="tracking-widest">
                        {hint.words[0]}
                      </span>}
                      <input placeholder="Finish prompt to generate an image" className="inline min-w-[260px] h-full text-center" {...register("prompt")} />
                      {!hintLoading && hint.words && <span className="tracking-widest">
                          {hint.words[1]}
                        </span>}
                    </div>
                    <p className="text-red-600 text-sm text-center"><ErrorMessage errors={errors} name="prompt" /></p>
                </div>

                <div className="flex justify-center w-full gap-2">
                    <button 
                        className="p-3 flex gap-4 items-center bg-white rounded-md border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-black font-bold"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {!generatedImageUrl ? 'Generate your Image' : 'Try Generating Again?'}
                    </button>
                </div>
                <div className="w-full">
                    {isLoading && <p className="w-full text-center">Generating Image...</p>}
                    {!isLoading && generatedImageUrl && 
                      <div>
                        <div className="w-full flex justify-center">
                            <Image 
                                height={382} 
                                width={382} 
                                src={generatedImageUrl} 
                                alt='Generated image from user prompt'
                                className="rounded-md border-2 border-white" 
                            />
                        </div>
                        <GuessWord inputText={methods.watch('prompt')}/>
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