import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import CreateNft from '../components/CreateNft';
import GenerateImage from '../components/GenerateImage';
import { useNetwork, useAccount } from 'wagmi';
import setAllowList from '../lib/setAllowList';
// import SetAllowList from '../lib/SetAllowList';
import * as ethers from "ethers"

const Home: NextPage = () => {
  const [generatedImage, setGeneratedImage] = useState<any>(null);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [connected, setConnected] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState('');
  const [collectors, setCollectors] = useState([]);
  

  const displayMessage = useCallback(() => {
    if (connected && allowed) {
      setMessage('true')
    }
    else if (!connected && allowed) {
      setMessage('Please connect your wallet to continue.')
    } 
    else if (connected && !allowed) {
      setMessage('You must have a Mint Podcast Season 6 Listener Badge to continue.')
    }
    else setMessage('Please connect your wallet to continue.')
  }, [connected, allowed]);

  // need collectors to load before the next if statement
  // const checkAllowed = useCallback( () => {
  //   setAllowList(setCollectors);
  //   let lookUp:string = address || " ";
  //   if (collectors.indexOf(lookUp) !== -1) {
  //     setAllowed(true);
  //   }
  // }, [address, collectors])

  const checkAllowed = () => {
    let collectors = setAllowList()
    //   .then(() => {
    //     if (collectors.indexOf(address) !== -1) {
    //       setAllowed(true)
    //     }
    // })
    console.log(allowed)
  }

  useEffect(() => {
    chain && setConnected(true);
    checkAllowed();
    displayMessage();
    console.log("connectd",connected, "allow",allowed)
  }, [chain, displayMessage, allowed, connected,])

  return (
    <div className={`${styles.container} background`}>
      <Head>
        <title>AI NFTs</title>
        <meta
          name="description"
          content='Create NFTs using DALL·E 2 in 3 clicks with Decent.'
        />
        <link rel="icon" href="/images/icon.png" />
      </Head>

      <main className={styles.main}>
        <h1 className={`${styles.title} pt-16 text-black`}>
          Create NFTs using DALL·E 2
        </h1>
        {message === 'true' ?
          <GenerateImage setGeneratedImage={setGeneratedImage} />
          : <p className='bg-black p-1 tracking-widest uppercase text-sm font-[400]'>{message}{connected && !allowed && <span> Claim on <a target="_blank" className='text-indigo-500 cursor-pointer'>here</a></span>}</p>
        }
        <div className='mt-8'>
          {connected ?
          <CreateNft generatedImage={generatedImage}/>
          :
          generatedImage && <p className='bg-black p-1 tracking-widest uppercase text-sm font-[400]'>Please Connect Your Wallet to Continue</p>
          }
        </div>
      </main>

      <footer className='py-8 border-t border-white'>
        <div>
        <p className='flex justify-center pb-4 text-base tracking-widest uppercase'>You&apos;re Now A Prompt Arist</p>
        <div className='flex items-center justify-center text-xl'>
          <a href="https://decent.xyz" target="_blank" rel="noopener noreferrer">
            <Image src='/images/icon2.png' height={24} width={24} alt='Decent 💪' />
          </a>
          <span className='px-2 pb-1'>X</span>
          <a href="https://openai.com/api/" target="_blank" rel="noopener noreferrer">
            <Image src='/images/openai.png' height={24} width={24} alt='Open AI' className='rounded-full overflow-hidden' />
          </a>
        </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;