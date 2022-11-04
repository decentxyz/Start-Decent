import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import CreateNft from '../components/CreateNft';
import GenerateImage from '../components/GenerateImage';
import { useNetwork } from 'wagmi';

const Home: NextPage = () => {
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  const { chain } = useNetwork();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    chain && setConnected(true)
  }, [chain])
  

  return (
    <div className={`${styles.container} background`}>
      <Head>
        <title>AI NFTs</title>
        <meta
          name="description"
          content='Create NFTs using DALLE in 2 clicks with Decent.'
        />
        <link rel="icon" href="/images/ai-robot.png" />
      </Head>

      <main className={styles.main}>

        <h1 className={`${styles.title} font-medium pt-16`}>
          Create NFTs with DALLE-2
        </h1>
        
        <GenerateImage setGeneratedImage={setGeneratedImage} />
        {/* causing hydration error */}
        {connected ?
        <CreateNft generatedImage={generatedImage}/>
        :
        <p>Please Connect Your Wallet to Continue</p>
        }
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
