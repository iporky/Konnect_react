// OpenAI client wrapper (do NOT commit raw API keys; use env variables)
import OpenAI from 'openai';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

// Guard against missing key in build
if (!apiKey) {
  // We don't throw to avoid build crash; requests will fail with a clear error
  // eslint-disable-next-line no-console
  console.warn('REACT_APP_OPENAI_API_KEY is not set. OpenAI calls will fail.');
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true, // NOTE: For production you should proxy through your backend
});

export async function chatCompletion({ prompt, signal }) {
  if (!apiKey) {
    return { error: 'Missing OpenAI API key. Configure REACT_APP_OPENAI_API_KEY.' };
  }
  try {
    // Using a placeholder model name; user mentioned "gpt5 nano" which is not an official model.
    const model = 'gpt-5';
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 1,
    }, { signal });

    const content = response.choices?.[0]?.message?.content || '';
    return { content, raw: response };
  } catch (e) {
    if (e.name === 'AbortError') return { error: 'Request aborted' };
    return { error: e.message || 'OpenAI request failed' };
  }
}
