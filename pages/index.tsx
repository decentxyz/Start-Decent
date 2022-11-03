import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import CreateNft from '../components/CreateNft';
import GenerateImage from '../components/GenerateImage';
import GenerateImageGame from '../components/GenerateImageGame';
import { useNetwork } from 'wagmi';

const Home: NextPage = () => {
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  const { chain } = useNetwork();
  const [connected, setConnected] = useState(false);
  const [active, setActive] = useState('NFTs');

  useEffect(() => {
    chain && setConnected(true)
  }, [chain])
  

  return (
    <div className={`${styles.container} background`}>
      <Head>
        <title>AI NFTs</title>
        <meta
          name="description"
          content='Create NFTs using stable diffusion.'
        />
        <link rel="icon" href="/images/ai-robot.png" />
      </Head>

      <main className={styles.main}>

        <h1 className={`${styles.title} font-medium`}>
          AI + web3 experiments
        </h1>
        <div className='flex gap-16 py-4'>
          <button className='text-xl font-bold hover:text-indigo-500' onClick={() => {setActive('NFTs'); setGeneratedImage(null)}}>
            <span className={`${active === 'NFTs' && 'text-indigo-500 drop-shadow-md'}`}>Create NFTs with AI</span>
          </button>
          <button className='text-xl font-bold hover:text-indigo-500' onClick={() => {setActive('Game'); setGeneratedImage(null)}}>
          <span className={`${active === 'Game' && 'text-indigo-500 drop-shadow-md'}`}>Play the game</span>
          </button>
        </div>
        {active === 'NFTs' ? 
          <GenerateImage setGeneratedImage={setGeneratedImage} /> :
          <GenerateImageGame setGeneratedImage={setGeneratedImage} />
        }
        <div className='mt-8'>
          {connected ?
          <CreateNft generatedImage={generatedImage}/>
          :
          generatedImage && <p>Please Connect Your Wallet to Continue</p>
          }
        </div>
      </main>

      <footer className='py-8 border-t border-white text-white'>
        <div>
        <p className='flex justify-center pb-4 text-xl'>🤝 Prompt Arist</p>
        <div className='flex items-center justify-center text-xl'>
          <a href="https://stability.ai/" target="_blank" rel="noopener noreferrer">
            <Image src='/images/stability.png' height={24} width={24} alt='Decent 💪' />
          </a>
          <span className='px-2 pb-1'>✘</span>
          <a href="https://decent.xyz" target="_blank" rel="noopener noreferrer">
            <Image src='/images/icon.png' height={24} width={24} alt='Decent 💪' />
          </a>
        </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
