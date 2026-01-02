// Free LibreTranslate mirrors (no API key required)
const LIBRE_TRANSLATE_MIRRORS = [
  'http://localhost:5000/translate', // Local Docker instance (priority)
  'https://libretranslate.de/translate',
  'https://translate.argosopentech.com/translate',
  'https://translate.terraprint.co/translate',
];

// Lingva Translate instances (Google Translate frontend, no API key)
const LINGVA_INSTANCES = [
  'https://lingva.ml/api/v1',
  'https://lingva.lunar.icu/api/v1',
  'https://translate.plausibility.cloud/api/v1',
];

// Fallback: Lingva Translate (free Google Translate frontend)
async function translateWithLingva(
  text: string,
  source: string,
  target: string
): Promise<string> {
  let lastError: Error | null = null;

  for (const baseUrl of LINGVA_INSTANCES) {
    try {
      const url = `${baseUrl}/${source}/${target}/${encodeURIComponent(text)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data.translation) {
        console.log(`✅ Translation successful via: ${baseUrl}`);
        return data.translation;
      }

      throw new Error('No translation in response');
    } catch (error) {
      console.warn(`❌ Lingva instance failed: ${baseUrl}`, error);
      lastError = error as Error;
      continue;
    }
  }

  throw lastError || new Error('All Lingva instances failed');
}

// Fallback: MyMemory API (free, 1000 words/day, no setup needed)
async function translateWithMyMemory(
  text: string,
  source: string,
  target: string
): Promise<string> {
  const langPair = `${source}|${target}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || 'MyMemory translation failed');
  }

  return data.responseData.translatedText;
}

export async function translate(
  text: string,
  source: string,
  target: string
): Promise<string> {
  let lastError: Error | null = null;

  // Try each LibreTranslate mirror first
  for (const url of LIBRE_TRANSLATE_MIRRORS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: source,
          target: target,
          format: 'text',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(`✅ Translation successful via: ${url}`);
      return data.translatedText;
    } catch (error) {
      console.warn(`❌ Mirror failed: ${url}`, error);
      lastError = error as Error;
      continue; // Try next mirror
    }
  }

  // Fallback to Lingva Translate (Google Translate frontend)
  try {
    console.log('🔄 Trying Lingva Translate fallback...');
    const result = await translateWithLingva(text, source, target);
    return result;
  } catch (error) {
    console.warn('❌ Lingva failed:', error);
    lastError = error as Error;
  }

  // Fallback to MyMemory API
  try {
    console.log('🔄 Trying MyMemory API fallback...');
    const result = await translateWithMyMemory(text, source, target);
    console.log('✅ Translation successful via: MyMemory API');
    return result;
  } catch (error) {
    console.warn('❌ MyMemory failed:', error);
    lastError = error as Error;
  }

  throw new Error(
    `All translation services failed. Last error: ${lastError?.message}`
  );
}