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
    if (!answers || !answers.motivation || !answers.concerns || !answers.knowledge) {
      console.error('Missing required fields in answers:', answers);
      return NextResponse.json(
        { error: 'Missing required survey answers' },
        { status: 400 }
      );
    }

    const prompt = `Create a humorous and engaging response for someone interested in going to Mars. Their survey responses:
    - What excites them: ${answers.motivation}
    - Their main concern: ${answers.concerns}
    - Their knowledge level: ${answers.knowledge}

    Please provide three separate responses:
    1. A funny reason why they should leave Earth (something exaggerated and humorous)
    2. An entertaining pitch for why Mars is perfect for them (based on their motivation)
    3. A completely made-up, humorous method of how they'll get to Mars

    Keep each response under 150 words and maintain a light, playful tone.`;

    console.log('Sending prompt to OpenAI:', prompt);

    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o",
        temperature: 0.8,
      });

      console.log('OpenAI response:', completion.choices[0]?.message);

      if (!completion.choices[0]?.message?.content) {
        throw new Error('No response content from OpenAI');
      }

      const response = completion.choices[0].message.content;
      const parts = response.split('\n\n').filter(Boolean);

      if (parts.length < 3) {
        console.error('Invalid response format from OpenAI. Parts:', parts);
        throw new Error('Invalid response format from OpenAI');
      }

      const result = {
        whyLeave: parts[0].replace(/^1\.\s*/, ''),
        whyMars: parts[1].replace(/^2\.\s*/, ''),
        howToGet: parts[2].replace(/^3\.\s*/, ''),
      };

      console.log('Sending response to client:', result);
      return NextResponse.json(result);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate response from AI' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in generate-response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
