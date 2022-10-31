import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';

import CreateNft from '../components/CreateNft';

const Home: NextPage = () => {
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
          Create NFTs with Stable Diffusion
        </h1>

        <CreateNft />
      </main>

      <footer className='py-8 border-t border-white text-white'>
        <div>
        <p className='flex justify-center pb-4 text-xl'>🤝 Prompt Arist</p>
        <div className='flex items-center justify-center text-xl'>
          <a href="https://huggingface.co/spaces/stabilityai/stable-diffusion" target="_blank" rel="noopener noreferrer">
          <span className='pr-2 pb-1'>🤗</span> 
          </a>
          <span className='pr-2 pb-1'>✘</span>
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
