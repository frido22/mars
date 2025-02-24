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

    const prompt = `Create a humorous and engaging response for someone interested in going to Mars. Their survey responses show the following motivations:

    Fear-based responses:
    ${fearAnswers.map((answer, i) => `${i + 1}. ${answer}`).join('\n')}

    Spiritual responses:
    ${spiritualAnswers.map((answer, i) => `${i + 1}. ${answer}`).join('\n')}

    Financial responses:
    ${financialAnswers.map((answer, i) => `${i + 1}. ${answer}`).join('\n')}

    Based on their responses, provide three separate sections:
    1. A funny and exaggerated reason why they should leave Earth (incorporate their strongest fears or motivations)
    2. An entertaining pitch for why Mars is perfect for them (based on their spiritual/financial motivations)
    3. A completely made-up, humorous method of how they'll get to Mars

    Keep each response under 150 words and maintain a light, playful tone. Focus on their dominant motivations (fear/spiritual/financial) in the responses.`;

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
