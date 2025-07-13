// Gemini translation API utilities

const GEMINI_API_KEY = "AIzaSyBX9gX0FbBsY3mUE4K99Ax9eE0Z4RWdgug";
const GEMINI_MODEL = "gemini-2.5-flash"; // or "gemini-2.5-pro"

export async function translateText({ inputText, fromLanguage, toLanguage }) {
  if (!inputText.trim()) return ['[No input]'];
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Translate the following text from ${fromLanguage} to ${toLanguage}. Only return the translation(s), one per line, with no explanation or extra text.\nText: ${inputText}`;
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
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '[Translation failed]';
    return raw.split(/\r?\n/).filter(line => line.trim() !== '');
  } catch (err) {
    return ['[Translation error]'];
  }
}

export async function translateMessage({ messageText, fromLang, toLanguage }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const prompt = `Translate the following text from ${fromLang || "auto"} to ${toLanguage}. Only return the translation(s), one per line, with no explanation or extra text.\nText: ${messageText}`;
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
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '[Translation failed]';
    return raw.split(/\r?\n/).filter(line => line.trim() !== '');
  } catch (err) {
    return ['[Translation error]'];
  }
} 