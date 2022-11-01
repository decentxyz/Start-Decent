import { NextApiRequest, NextApiResponse } from "next";
import { SECRET_WORDS } from "./hint";

/** 
 * Hint is stored in our backend
 */
export default async function handler(nextReq: NextApiRequest, nextRes: NextApiResponse) {
    const words = nextReq.query.words as string[];

    console.log(words)

    if (words.length !== SECRET_WORDS.length) {
        return nextRes.status(200).json({correct: false, message: 'Invalid number of words'});
    }

    if (words.every((word: string) => SECRET_WORDS.includes(word.trim().toLowerCase()))) {
        return nextRes.status(200).json({correct: true, message: 'Correct! Congratulations!!'});
    }

    return nextRes.status(200).json({correct: false, message: 'Incorrect words!'});
}
