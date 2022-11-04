import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/** 
 * Call `/api/generate?promp=<your-promp>` to generate an image.
 * Generation is fulfilled by the OpenAI DALLE API.
 */
export default async function handler(nextReq: NextApiRequest, nextRes: NextApiResponse) {
    const prompt = nextReq.query.prompt as string || 'DJ playing music on turntables to a crowd of people dancing, bright and colorful.';

    try {
        const response = await openai.createImage({
          prompt: prompt,
          n: 1,
          size: "256x256",
        });
        const image_url = response.data.data[0].url;
        nextRes.status(200).json({ image_url, prompt});
      } catch (e) {
        console.error(e);
        nextRes.status(500).send(e);
      }

  }