"use client";

import { useState } from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function TTSTestPage() {
  const [text, setText] = useState("Hello, this is a text-to-speech test!");
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);

  const { voices, isSpeaking, speak, stop } = useSpeechSynthesis();

  const handleSpeak = () => {
    speak(text, { voiceName: selectedVoice, rate, pitch });
  };

  // Group voices by language
  const voicesByLang = voices.reduce((acc, voice) => {
    const lang = voice.lang.split("-")[0];
    if (!acc[lang]) acc[lang] = [];
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-4xl font-bold">🔊 Text-to-Speech Test</h1>

      <div className="w-full max-w-2xl space-y-4">
        {/* Text input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to speak..."
          className="w-full p-4 border rounded-lg min-h-[120px] text-lg"
        />

        {/* Voice selector */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Voice ({voices.length} available):</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-black text-black dark:text-white"
          >
            {Object.entries(voicesByLang).map(([lang, langVoices]) => (
              <optgroup key={lang} label={lang.toUpperCase()}>
                {langVoices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Rate slider */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Speed: {rate}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Pitch slider */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Pitch: {pitch}</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSpeak}
            disabled={isSpeaking || !text.trim()}
            className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-600 text-lg font-semibold"
          >
            {isSpeaking ? "🔊 Speaking..." : "Speak"}
          </button>

          <button
            onClick={stop}
            disabled={!isSpeaking}
            className="px-6 py-3 bg-red-500 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-600"
          >
            Stop
          </button>
        </div>

        {/* Info */}
        <div className="text-sm text-gray-500 mt-4">
          <p>💡 TTS uses Web Speech Synthesis API (built into browser)</p>
          <p>🌐 Voice availability varies by browser and OS</p>
        </div>
      </div>
    </div>
  );
}
