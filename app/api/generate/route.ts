import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { HfInference } from '@huggingface/inference';


const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

const SYSTEM_PROMPT = `You are a dream interpreter and creative storyteller. 
You will receive a user's dream journal entry and your task is to turn it into a short, surreal, and imaginative story. 
Make it vivid, strange, and poetic — like something out of a dream. 
The story should be in the third person, use descriptive language, and capture the emotions or atmosphere of the dream.
Do not mention that it's a dream or refer back to the original entry. Just tell the story. Make sure the story is short so that it can be used to generate an image.
`


export async function POST(request: NextRequest) {
    try {
        const { entry } = await request.json();

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
        console.error("error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}





/*You are a creative storyteller and illustrator.
Your task is to take a dream or journal entry and transform it into a compelling narrative with vivid imagery.
You will generate a story that captures the essence of the dream, including key details and emotions.
The story should be engaging, imaginative, and suitable for visual representation.
You will also generate a description for each panel of the story, which can be used to create illustrations.
The story should be structured in a way that allows for clear visual storytelling, with distinct scenes and actions.
Use descriptive language to evoke imagery and emotions, making the story come alive.
Remember to keep the story coherent and focused on the main themes of the dream or entry.
Your output should include:
1. A detailed narrative story based on the provided entry.
2. A description for each panel that can be used to create illustrations.*/