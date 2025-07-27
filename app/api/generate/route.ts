import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { InferenceClient } from '@huggingface/inference';


const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

const SYSTEM_PROMPT = `You are a dream interpreter and creative storyteller. 
You will receive a user's dream journal entry and your task is to turn it into a short, surreal, and imaginative story. 
Make it vivid, strange, and poetic — like something out of a dream. 
The story should be in the third person, use descriptive language, and capture the emotions or atmosphere of the dream.
Do not mention that it's a dream or refer back to the original entry. Just tell the story. Make sure the story is short so that it can be used to generate an image.
`


export async function POST(request: NextRequest) {
    try {
        const { entry } = await request.json();
        console.log("Received entry:", entry);

        const response = await hf.chatCompletion({
            model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: entry }
            ],
            max_tokens: 1024
        })

        const story = response.choices[0].message.content

        //const story = data?.[0]?.generated_text || "No story generated."

        return NextResponse.json({ story })
    } catch (error) {
        console.error("Full Error Object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
