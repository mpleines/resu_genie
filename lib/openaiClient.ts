import { createOpenAI } from '@ai-sdk/openai';

const openAiClient = createOpenAI({
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default openAiClient;
