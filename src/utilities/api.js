// Gemini translation API utilities

const GEMINI_API_KEY = "AIzaSyBX9gX0FbBsY3mUE4K99Ax9eE0Z4RWdgug";
const GEMINI_MODEL = "gemini-2.5-flash"; // or "gemini-2.5-pro"

function buildPrompt({ inputText, fromLanguage, toLanguage }) {
  return `Translate the following text from ${fromLanguage} to ${toLanguage}.
Return ONLY a JSON object with these fields:
- translation: the translated text
- pronunciation: the pronunciation of the translation in Latin script
- detected_language: the detected source language (if auto-detect is used, otherwise repeat the source language)
- literal_translation: a literal translation if it differs from the main translation, otherwise null
- part_of_speech: the part of speech of the main word/phrase, or null
- grammar_notes: a brief note about grammar or usage, or null
- example_usage: an example sentence using the translation, or null
- synonyms: a list of up to 3 synonyms for the translation, or null
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