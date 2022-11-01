import { NextApiRequest, NextApiResponse } from "next";
import { generateAsync, generate } from 'stability-client'
import { SECRET_WORDS } from "./secretWords/hint";

const DREAMSTUDIO_API_KEY = process.env.DREAMSTUDIO_API_KEY || '';

/** 
 * Call `/api/text-to-image?promp=<your-promp>` to generate an image.
 * Request params are hard coded for the time being.
 * Generation is fulfilled by the Stability SDK by stability.ai
 */
export default async function handler(nextReq: NextApiRequest, nextRes: NextApiResponse) {
    const prompt = nextReq.query.prompt as string || 'DJ playing music on turntables to a crowd of people dancing, bright and colorful.';

    const promptWithSecretWords = `${SECRET_WORDS[0]} ${prompt} ${SECRET_WORDS[1]}`;

    try {
        const { images }: any = await generateAsync({
            prompt: promptWithSecretWords,
            apiKey: DREAMSTUDIO_API_KEY,
            height: 512,
            width: 512,
            diffusion: 'k_lms',
            engine: 'stable-diffusion-v1',
            outDir: './images',
            steps: 300,
            cfgScale: 7,
        });
        const image = images[0];
        nextRes.setHeader('Content-Type', image.mimeType);
        nextRes.send(image.buffer);
      } catch (e) {
        // ...
        console.log('ERROR');
        console.error(e);
        nextRes.status(500).send(e);
      }

  }