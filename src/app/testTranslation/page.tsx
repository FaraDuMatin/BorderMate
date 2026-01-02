"use client";

import { useState } from "react";
import { translate } from "@/services/translationService";

export default function TestTranslationPage() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to translate");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const result = await translate(inputText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError("Translation failed. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-4xl font-bold">🌐 Translation Test</h1>

      <div className="w-full max-w-2xl space-y-4">
        {/* Language selectors */}
        <div className="flex gap-4 items-center justify-center">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-4 py-2 border rounded-lg  bg-white dark:bg-black text-black dark:text-white"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
          </select>

          <span className="text-2xl">→</span>

          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="px-4 py-2 border rounded-lg  bg-white dark:bg-black text-black dark:text-white"
          >
            <option value="es">Spanish</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ar">Arabic</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Input text */}
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to translate..."
          className="w-full p-4 border rounded-lg min-h-37.5 text-lg"
        />

        {/* Translate button */}
        <button
          onClick={handleTranslate}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 text-lg font-semibold"
        >
          {isLoading ? "Translating..." : "Translate"}
        </button>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Result */}
        {translatedText && (
          <div className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Translation:</h2>
            <p className="text-lg">{translatedText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
