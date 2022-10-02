import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className={`${styles.container} background`}>
      <Head>
        <title>Start Decent</title>
        <meta
          name="A template for implementing the Decent Protocol wtih Rainbowkit in Next JS"
        />
        <link rel="icon" href="/images/favi.png" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={`${styles.title} font-medium`}>
          Welcome to the Decent Protocol
        </h1>

        {/* need to update decent docs link */}
        <div className={`${styles.description} flex items-center gap-2`}>
          <p>Powered by</p>
          <a className='pt-2' href="https://github.com/decentxyz/DecentSDK-docs"><Image src='/images/icon.png' height={20} width={25} alt='decent icon'/></a>
          <a href="https://rainbowkit.com" className='text-lg'> + 🌈</a>
          <a href='href="https://nextjs.org/docs"'> + Next.js</a>
        </div>

        <div className={styles.grid}>
          {/* need to confirm this is the url we want */}
          <Link href='/deploy-contracts'>
          <p className={styles.card}>
            <h2 className='font-medium'>Test Decent Contracts &rarr;</h2>
            <p>Deploying sophisticated contracts has never been easier.</p>
          </p>
          </Link>

          <a href="https://github.com/decentxyz/DecentSDK-docs" className={styles.card}>
            <h2 className='font-medium'>Decent Protocol Docs &rarr;</h2>
            <p>Review smart contracts and architecture.</p>
          </a>

          <a href="https://rainbowkit.com" className={styles.card}>
            <h2 className='font-medium'>RainbowKit Docs &rarr;</h2>
            <p>Learn how to customize your wallet connection flow.</p>
          </a>

          <a href="https://wagmi.sh" className={styles.card}>
            <h2 className='font-medium'>wagmi Docs &rarr;</h2>
            <p>Learn how to interact with Ethereum.</p>
          </a>

          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2 className='font-medium'>Next.js Docs &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app" className={styles.card}>
            <h2 className='font-medium'>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className='py-8 border-t border-white text-white'>
        <div>
        <p className='flex justify-center pb-4 text-xl'>{`Here's to the crazy ones`}</p>
        <a className='flex justify-center items-center text-xl' href="https://decent.xyz" target="_blank" rel="noopener noreferrer">
         <span className='pr-4'>🏗️</span> 
        <Image src='/images/decent.png' height={18} width={100} alt='Decent 💪' />
        </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
