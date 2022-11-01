import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { usePageLeave } from "react-use";

const schema = yup.object().shape({
  word1: yup.string()
  .required('A first word is required for your guess.')
  .min(3, 'First word must be at least 3 characters.')
    .test('2_words', 'Guess must contain exactly 1 word1.', (value) => {
      if (value) {
        const words = value.split(' ');
        return words.length === 1;
      }
      return false;
    }),
  word2: yup.string()
    .required('A second word is required for your guess.')
    .min(3, 'Seconds word must be at least 3 characters.')
    .test('2_words', 'Guess must contain exactly 1 word1.', (value) => {
      if (value) {
        const words = value.split(' ');
        return words.length === 1;
      }
      return false;
    }),
});

type FormData = {
  word1: string;
  word2: string;
};

const GuessWord: React.FC<any> = ({inputText}) => {
  const methods = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { register, handleSubmit, formState: { errors, isSubmitting } } = methods;
  const onSubmit = handleSubmit(async (data: FormData) => 
  {
    await checkGuess(data.word1, data.word2);
  });
  const { width, height } = useWindowSize()

  const [guessCorrect, setGuessCorrect] = useState<boolean|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkGuess = async (w1: string, w2: string) => {
    setIsLoading(true);
    try {
        const res = await fetch(`/api/secretWords/check?words=${w1}&words=${w2}`);
        const data = await res.json();
        if (data.correct) {
            setGuessCorrect(true);
            // trigger react-confetti
        } else {
            setGuessCorrect(false);
        }
        setIsLoading(false);
    } catch (error) {
        console.error(error);
        setIsLoading(false);
    }
}

  return (
    <div className="w-full mt-4 mb-4">
        {!!guessCorrect && <Confetti width={width} height={height*1.2} />}
        <FormProvider {...methods}>
            <form onSubmit={onSubmit} className='gap-4 w-full flex justify-center px-4 flex-col'>
                <div className="flex flex-wrap items-center gap-4 w-full max-w-2xl">
                    <div className="w-full">
                    <div className="text-slate-400 w-full create-field bg-white flex gap-1 justify-center">
                      <input placeholder="word1" className="inline min-w-[100px] h-full text-center" {...register("word1")} />
                      <span className="whitespace-nowrap">
                        {inputText}
                      </span>
                      <input placeholder="word2" className="inline min-w-[100px] h-full text-center" {...register("word2")} />
                    </div>
                        {/* <input placeholder="Guess the two mystery words" className="text-slate-400 w-full create-field" {...register("word")} /> */}
                        <p className="text-red-600 text-sm text-center"><ErrorMessage errors={errors} name="word1" /></p>
                        <p className="text-red-600 text-sm text-center"><ErrorMessage errors={errors} name="word2" /></p>
                    </div>
                </div>
                {guessCorrect === true && <p className="text-green-600 text-sm text-center">Correct!</p>}
                {guessCorrect === false && <p className="text-red-600 text-sm text-center">WRONG! Better Luck Tomorrow.</p>}
                <div className="flex justify-center w-full gap-2">
                    <button 
                        className="p-3 flex gap-4 items-center bg-white rounded-md border-gray-500 hover:bg-gray-200 active:bg-gray-400 text-black font-bold"
                        type="button"
                        onClick={onSubmit}
                        disabled={isSubmitting}
                    >
                        {guessCorrect === null ? 'Take a Guess' : 'Guess Again?'}
                    </button>
                </div>
            </form>
        </FormProvider>
    </div>
  )
}

export default GuessWord