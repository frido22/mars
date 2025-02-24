'use client';

import Image from "next/image";
import { useState } from 'react';
import Survey from './components/Survey';
import Results from './components/Results';

export default function Home() {
  const [showSurvey, setShowSurvey] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSurveyComplete = (surveyAnswers: Record<string, string>) => {
    setAnswers(surveyAnswers);
    setShowSurvey(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-h-screen bg-gradient-to-b from-red-50 to-orange-50">
        <div className="container mx-auto px-4 py-12">
          {showSurvey ? (
            <>
              <h1 className="text-4xl font-bold mb-8 text-center cyber-text glowing-text">
                Mars Migration Survey 🚀
              </h1>
              <p className="text-xl mb-12 text-center cyber-text">
                Ready to ditch Earth&apos;s problems for some fresh Martian ones? Take our quiz to discover your cosmic destiny!
              </p>
              <Survey onComplete={handleSurveyComplete} />
            </>
          ) : (
            <Results answers={Object.values(answers)} />
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
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
  );
}
