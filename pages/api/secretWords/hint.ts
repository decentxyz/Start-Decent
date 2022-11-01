import { NextApiRequest, NextApiResponse } from "next";
 
// We'll store this in a db most likely (or can hardcode a ton)
// Will only be exposed via the generate, hint, and check api endpoints.
export const SECRET_WORDS = ['dolphin', 'cyberpunk'];
export const SECRET_HINT = 'An animal and a style'

/** 
 * Hint is stored in our backend
 */
export default async function handler(nextReq: NextApiRequest, nextRes: NextApiResponse) {
    return nextRes.status(200).json({
        wordLengths: SECRET_WORDS.map((w) => w.length), 
        hint: SECRET_HINT,

        // After some period of time could reveal the first, 3rd, last letters etc
        // lastLetter: SECRET_WORDS.map((w) => w[w.length - 1]),
        // firstLetter: SECRET_WORDS.map((w) => w[0]),
        // thirdLetter: SECRET_WORDS.map((w) => w[2]),
    });
}
