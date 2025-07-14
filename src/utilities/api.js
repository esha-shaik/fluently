// Gemini translation API utilities

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";

function buildPrompt({ inputText, fromLanguage, toLanguage }) {
  return `You are a helpful translation assistant. Translate the following text from ${fromLanguage} to ${toLanguage}.
Return ONLY a JSON object with these fields:
- translation: the translated text
- pronunciation: the pronunciation in Latin script (if applicable)
- detected_language: the detected source language (if auto-detect is used, otherwise repeat the source language)
- part_of_speech: the part of speech of the main word/phrase, or null
- example_usage: a short, natural example sentence using the translation, or null
- synonyms: a list of up to 2 common synonyms for the translation, or null
Text: ${inputText}`;
}

export async function translateText({ inputText, fromLanguage, toLanguage }) {
  if (!inputText.trim()) return { error: '[No input]' };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = buildPrompt({ inputText, fromLanguage, toLanguage });
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    // Try to parse JSON from the response
    try {
      const jsonStart = raw.indexOf('{');
      const jsonEnd = raw.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = raw.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
      }
      return { error: '[Invalid response format]' };
    } catch (e) {
      return { error: '[Failed to parse translation details]' };
    }
  } catch (err) {
    return { error: '[Translation error]' };
  }
}

export async function translateMessage({ messageText, fromLang, toLanguage }) {
  return translateText({ inputText: messageText, fromLanguage: fromLang || 'auto', toLanguage });
}

/**
 * Send a chat message to Gemini and get a reply in the target language.
 * @param {Object} params
 * @param {string} params.message - The user's message
 * @param {string} params.language - The language Gemini should reply in
 * @returns {Promise<string>} The reply text
 */
export async function sendChatMessage({ message, language }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `You are a friendly chat partner. Reply to the following message in a natural, conversational way, in ${language}. Do not translate, just reply as if you are chatting. Only return the reply text, no JSON or extra formatting.\nMessage: ${message}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return reply.trim();
  } catch (err) {
    return '[Error getting response]';
  }
} 