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
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Gemini Image Generation Error:", err.message);
        } else {
            console.error("Gemini Image Generation Error:", err);
        }
    }
}