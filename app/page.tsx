'use client';

import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

export default function HomePage() {
    const [entry, setEntry] = React.useState("");
    const [story, setStory] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState<string>("");

    React.useEffect(() => {
        console.log("Image URL:", imageUrl);
    }, [imageUrl]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);
        setStory("");

        if (!entry || entry.length < 5) {
            setError("entry too short. please provide at least 5 characters.");
            setLoading(false);
            return;
        }

        try {
            fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ entry: entry.trim() }),
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || "Failed to generate story");
                    }
                    return response.json();
                })
                .then((data) => {
                    setStory(data.story);
                    setLoading(false);
                    generateImage(data.story);
                });
        } catch (error) {
            setError("Failed to generate story. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const generateImage = async (story: string) => {
        try {
            const res = await fetch('/api/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: story })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to generate image");
            }
            
            setImageUrl(data.imageUrl);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error("Image Error:", err.message);
                setError(err.message);
            } else {
                console.error("Unknown error:", err);
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <main className="min-h-screen pb-20 flex flex-col items-center justify-center p-6 bg-white dark:bg-black"
                style={{
                    backgroundImage: "linear-gradient(to bottom right, #1e3a8a, black, #3b0764)",
        }}>
            <h1 className="text-4xl font-bold mb-4 text-center">🌌 {'Dreamify'.split('').map((char, i) => (
                <span
                    key={i}
                    className="inline-block transition-all duration-250 hover:scale-110 hover:text-violet-400 hover:shadow-inner ease-in-out glow-hover"
                >
                {char}
                </span>
            ))}</h1>
            <p className="text-gray-600 mb-6 text-center max-w-lg">
                Turn your dreams into stunning illustrated stories.
            </p>
          
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6"> 
                <textarea
                    className="w-150 max-w-2xl h-52 p-4 rounded-2xl backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none text-sm sm:text-base shadow-inner"
                    placeholder="what did you dream about last night?"
                    name="entry"
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                />

                <button
                    type="submit"
                    className="mt-4 backdrop-blur-xl flex items-center justify-center gap-2 min-w-[180px] px-6 py-3 rounded-full transition-all duration-200 ease-in-out hover:bg-white/5 disabled:opacity-50 shadow-md"
                    disabled={loading || entry.length < 5}
                >
                    {loading ? (
                    <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Generating...
                        </>
                    ) : (
                        <>
                        <Sparkles className="h-5 w-5" />
                        Generate Story
                        </>
                    )}
                </button>
            </form>

            {story && (
                <div className="mt-8 max-w-2xl p-6 rounded-2xl backdrop-blur-md bg-white/10 dark:bg-white/5 shadow-lg border border-white/0 transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-3 text-center text-white/80 tracking-wide">Generated Story:</h2>
                    <p className="text-sm sm:text-base text-white/90 leading-relaxed whitespace-pre-line">{story}</p>
                </div>
            )}
          
            {imageUrl && (
                <div className="mt-6">
                    <img
                        src={imageUrl}
                        alt="Generated Story Illustration"
                        className="rounded-lg shadow-lg max-w-full"
                    />
                </div>
            )}
        </main>
    );
}


















  /*return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );*/

