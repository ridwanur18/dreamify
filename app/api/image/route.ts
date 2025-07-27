import { HfInference } from "@huggingface/inference";
import { GoogleGenAI, Modality } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY, 
        });

        const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: prompt,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];

        let base64Image = null;
        for (const part of parts) {
            if (part.inlineData?.mimeType?.startsWith("image/")) {
                base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }

        if (!base64Image) {
            return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
        }

        return NextResponse.json({ imageUrl: base64Image });
    } catch (err: any) {
        console.error("Gemini Image Generation Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}









/*
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
        }

        const image = await hf.textToImage({
            provider: "nebius",
            model: "black-forest-labs/FLUX.1-dev",
            inputs: prompt,
            parameters: { num_inference_steps: 5 },
        });

        // If the returned image is already a base64 string or a data URL, you can use it directly.
        // Optionally, you can log or process the image string here.
        console.log("Generated image:", image);

        // If you need only the base64 part (without the prefix), you can extract it like this:
        // const base64Only = image.split(',')[1];

        return NextResponse.json({ imageUrl: image });
    } catch (error: any) {
        console.error("Image generation error:", error.message);
        return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }
}
    */