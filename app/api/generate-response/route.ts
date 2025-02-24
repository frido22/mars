import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load the .env file
dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set in .env file');
  throw new Error('OPENAI_API_KEY is not set in .env file');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Parse the request body
    let answers;
    try {
      const body = await request.json();
      console.log('Received request body:', body);
      answers = body.answers;
      console.log('Extracted answers:', answers);
    } catch (e) {
      console.error('Failed to parse request JSON:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate the answers object
    if (!answers || Object.keys(answers).length === 0) {
      console.error('Missing answers object:', answers);
      return NextResponse.json(
        { error: 'Missing survey answers' },
        { status: 400 }
      );
    }

    const generatePrompt = (answers: string[], focus: string) => {
      const answerSummary = answers.join('\n');
      
      switch(focus) {
        case 'leave_earth':
          return `Based on these survey answers about Mars:\n${answerSummary}\n\nGenerate a humorous explanation of why this person should leave Earth. Focus on their fears and current life situations. Keep it funny and light-hearted.`;
        case 'why_mars':
          return `Based on these survey answers about Mars:\n${answerSummary}\n\nGenerate a humorous explanation of why Mars is perfect for this person. Focus on their spiritual and financial motivations. Keep it funny and light-hearted.`;
        case 'how_to':
          return `Based on these survey answers about Mars:\n${answerSummary}\n\nGenerate a humorous explanation of how this person will get to Mars. Make it absurd and entertaining while referencing their survey answers. Keep it funny and light-hearted.`;
        default:
          return '';
      }
    };

    const generateResponse = async (prompt: string) => {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a humorous Mars travel advisor. Keep responses concise, funny, and entertaining."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      return response.choices[0].message.content || '';
    };

    // Group answers by category
    const fearAnswers = [
      answers.fear_crisis,
      answers.fear_survival,
      answers.fear_regret
    ].filter(Boolean);

    const spiritualAnswers = [
      answers.spiritual_purpose,
      answers.spiritual_values,
      answers.spiritual_destiny
    ].filter(Boolean);

    const financialAnswers = [
      answers.money_security,
      answers.money_incentives,
      answers.money_challenges
    ].filter(Boolean);

    // Make three parallel calls for better performance
    const [whyLeave, whyMars, howToGet] = await Promise.all([
      generateResponse(generatePrompt(fearAnswers, 'leave_earth')),
      generateResponse(generatePrompt([...spiritualAnswers, ...financialAnswers], 'why_mars')),
      generateResponse(generatePrompt([...fearAnswers, ...spiritualAnswers, ...financialAnswers], 'how_to'))
    ]);

    console.log('Sending responses to client:', { whyLeave, whyMars, howToGet });
    
    return NextResponse.json({
      whyLeave,
      whyMars,
      howToGet
    });

  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
