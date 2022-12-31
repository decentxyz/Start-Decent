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
        <title>Start off Decent</title>
        <meta
          name="description"
          content='A template for implementing the Decent Protocol wtih Rainbowkit in Next JS'
        />
        <link rel="icon" href="/images/favi.png" />
      </Head>

      <main className={styles.main}>
        <div className="flex items-center gap-4">
        <ConnectButton />
          <Link href='https://github.com/decentxyz/Start-Decent' target='_blank'>
            <Image src='/images/github-mark-white.svg' height={22} width={22} alt='link to repository' />
          </Link>
        </div>

        <h1 className={`${styles.title} font-medium`}>
          Welcome to the Decent Protocol
        </h1>

        <div className={`${styles.description} flex items-center gap-2`}>
          <p>Powered by</p>
          <a className='pt-2' href="https://decentxyz.gitbook.io/decent-sdk-documentation/"><Image src='/images/icon.png' height={20} width={25} alt='decent icon'/></a>
          <a href="https://rainbowkit.com" className='text-lg'> + 🌈</a>
          <a href='href="https://nextjs.org/docs"'> + Next.js</a>
        </div>

        <div className={`${styles.grid} cursor-pointer`}>
          <Link href='/deploy-contracts'>
          <div className={styles.card}>
            <h2 className='font-medium'>Test Decent Editions &rarr;</h2>
            <p>Deploying sophisticated contracts has never been easier.</p>
          </div>
          </Link>

          <a href="https://decentxyz.gitbook.io/decent-sdk-documentation/" className={styles.card}>
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

          <a href="https://hq.decent.xyz" className={styles.card}>
            <h2 className='font-medium'>Decent Creator Studio &rarr;</h2>
            <p>
              {`Explore Decent's creator studio for no-code deployments.`}
            </p>
          </a>
        </div>
      </main>

      <footer className='py-8 border-t border-white text-white'>
        <div>
        <p className='flex justify-center pb-4 text-xl'>For the artists of every industry 🥂</p>
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
