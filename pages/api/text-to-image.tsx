import { NextApiRequest, NextApiResponse } from "next";
import { generateAsync, generate } from 'stability-client'

const DREAMSTUDIO_API_KEY = process.env.DREAMSTUDIO_API_KEY || '';


/** 
 * Call `/api/text-to-image?promp=<your-promp>` to generate an image.
 * Request params are hard coded for the time being.
 * Generation is fulfilled by the Stability SDK by stability.ai
 */
export default async function handler(nextReq: NextApiRequest, nextRes: NextApiResponse) {
    const prompt = nextReq.query.prompt as string || 'A DJ playing music on turntables to a crowd of people dancing, cyberpunk, bright and colorful.';

    try {
        const { images }: any = await generateAsync({
            prompt: prompt,
            apiKey: DREAMSTUDIO_API_KEY,
            height: 512,
            width: 512,
            diffusion: 'k_lms',
            engine: 'stable-diffusion-v1',
            outDir: './images',
            steps: 300,
            debug: true,
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