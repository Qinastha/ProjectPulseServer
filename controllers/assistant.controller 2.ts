import { Request, Response } from 'express';
import OpenAI from "openai";

export const queryGPT = async (req: Request, res: Response) => {
    const { prompt } = req.body;
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
    const response = await client.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });

    if (response.choices[0]) {
        res.json(response.choices[0]);
    } else {
        res.status(500).json({ message: 'Error querying GPT' });
    }
};