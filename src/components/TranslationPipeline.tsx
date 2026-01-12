"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { translate } from "@/services/translationService";

// Language configurations
const LANGUAGES = [
  { code: "en", name: "English", speechCode: "en-US" },
  { code: "fr", name: "French", speechCode: "fr-FR" },
  { code: "es", name: "Spanish", speechCode: "es-ES" },
  { code: "de", name: "German", speechCode: "de-DE" },
  { code: "it", name: "Italian", speechCode: "it-IT" },
  { code: "pt", name: "Portuguese", speechCode: "pt-PT" },
  { code: "ru", name: "Russian", speechCode: "ru-RU" },
  { code: "zh", name: "Chinese", speechCode: "zh-CN" },
  { code: "ja", name: "Japanese", speechCode: "ja-JP" },
  { code: "ko", name: "Korean", speechCode: "ko-KR" },
  { code: "ar", name: "Arabic", speechCode: "ar-SA" },
];

type PipelineStatus = "idle" | "listening" | "translating" | "speaking";

export default function TranslationPipeline() {
  // Source and target language
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("fr");

  // Pipeline state
  const [status, setStatus] = useState<PipelineStatus>("idle");
  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [error, setError] = useState("");



  // Hooks
  const {
    transcript,
    interimTranscript,
    fullTranscript,
    isListening,
    error: sttError,
    startListening: startSTT,
    stopListening: stopSTT,
    clearTranscript,
  } = useSpeechRecognition();

  const {
    isSpeaking,
    speak,
    stop: stopTTS,
    getVoicesByLang,
  } = useSpeechSynthesis();

  // Refs for managing async operations
  const lastProcessedText = useRef("");
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
const wasSpeakingRef = useRef(false);
  
  // Refs to track current language values for swapping
  const sourceLangRef = useRef(sourceLang);
  const targetLangRef = useRef(targetLang);
  
  // Keep refs in sync with state
  useEffect(() => {
    sourceLangRef.current = sourceLang;
    targetLangRef.current = targetLang;
  }, [sourceLang, targetLang]);

  // Get the speech code for a language
  const getSpeechCode = (langCode: string) => {
    return LANGUAGES.find((l) => l.code === langCode)?.speechCode || langCode;
  };

  // Custom start listening with language
  const startListening = useCallback(() => {
    setError("");
    clearTranscript();
    lastProcessedText.current = "";
    setOriginalText("");
    setTranslatedText("");

    // Start STT with source language
    startSTT(getSpeechCode(sourceLang));
    setStatus("listening");
  }, [startSTT, clearTranscript, sourceLang]);

  // Stop the entire pipeline
  const stopPipeline = useCallback(() => {
    stopSTT();
    stopTTS();
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }
    setStatus("idle");
  }, [stopSTT, stopTTS]);

  // Translate and speak function
  const translateAndSpeak = useCallback(
    async (text: string) => {
      if (!text.trim() || text === lastProcessedText.current) return;

      // Stop listening once we start translating
      stopSTT();

      lastProcessedText.current = text;
      setOriginalText(text);
      setStatus("translating");
      setError("");

      try {
        const result = await translate(text.trim(), sourceLang, targetLang);
        setTranslatedText(result);

        if (result) {
          setStatus("speaking");
          speak(result, { lang: getSpeechCode(targetLang) });
        } else {
          setStatus("idle");
        }
      } catch (err) {
        console.error("Translation error:", err);
        setError(err instanceof Error ? err.message : "Translation failed");
        setStatus("idle");
      }
    },
    [sourceLang, targetLang, speak, stopSTT]
  );

  // Watch for transcript changes - debounced translation
  useEffect(() => {
    if (!transcript.trim()) return;

    // Clear previous timeout
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current);
    }

    // Debounce: wait for user to stop speaking before translating
    translationTimeoutRef.current = setTimeout(() => {
      translateAndSpeak(transcript);
    }, 1500); // 1.5 second delay after last speech

    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current);
      }
    };
  }, [transcript, translateAndSpeak]);

  // Update status based on hook states and swap languages when speaking ends
  useEffect(() => {
    if (isSpeaking) {
      wasSpeakingRef.current = true;
      setStatus("speaking");
    } else if (wasSpeakingRef.current) {
      // Speaking just ended - swap languages for the other person to respond
      wasSpeakingRef.current = false;
      const newSource = targetLangRef.current;
      const newTarget = sourceLangRef.current;
      setSourceLang(newSource);
      setTargetLang(newTarget);
      setStatus('idle');
    }
  }, [isSpeaking]);

  // Handle STT errors
  useEffect(() => {
    if (sttError) {
      setError(sttError);
      setStatus("idle");
    }
  }, [sttError]);


  // Swap languages
  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  // Get status display
  const getStatusDisplay = () => {
    switch (status) {
      case "listening":
        return { text: "🎙️ Listening...", color: "text-green-500" };
      case "translating":
        return { text: "🔄 Translating...", color: "text-blue-500" };
      case "speaking":
        return { text: "🔊 Speaking...", color: "text-purple-500" };
      default:
        return { text: "⏸️ Ready", color: "text-gray-500" };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🌍 BorderMate</h1>
        <p className="text-gray-600 dark:text-gray-400">
        </p>
      </div>

      {/* Language Selection */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="flex flex-col items-center">
          {/* <label className="text-sm text-gray-500 mb-1">From</label> */}
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
            disabled={status !== "idle"}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={swapLanguages}
          disabled={status !== "idle"}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
          title="Swap languages"
        >
          ⇄
        </button>

        <div className="flex flex-col items-center">
          {/* <label className="text-sm text-gray-500 mb-1">To</label> */}
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
            disabled={status !== "idle"}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Indicator */}
      {/* <div className="text-center">
        <span className={`text-xl font-semibold ${statusDisplay.color}`}>
          {statusDisplay.text}
        </span>
      </div> */}

      {/* Main Controls */}
      <div className="flex justify-center gap-4">
        {status === "idle" ? (
          <button
            onClick={startListening}
            className="px-8 py-4 bg-green-500 text-white rounded-xl text-lg font-semibold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
          >
            🎤 Start Speaking
          </button>
        ) : (
          <button
            onClick={stopPipeline}
            className="px-8 py-4 bg-red-500 text-white rounded-xl text-lg font-semibold hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
          >
            ⏹️ Stop
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Pipeline Visualization */}
      <div className="flex items-center justify-center gap-2 text-xl text-gray-500">
        <span
          className={status === "listening" ? "text-green-500 font-bold" : ""}
        >
          🎤 STT
        </span>
        <span>→</span>
        <span
          className={status === "translating" ? "text-blue-500 font-bold" : ""}
        >
          🌐 Translate
        </span>
        <span>→</span>
        <span
          className={status === "speaking" ? "text-purple-500 font-bold" : ""}
        >
          🔊 TTS
        </span>
      </div>

      {/* Text Display Panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Original Text (Source Language) */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400">
              🎤{" "}
              {LANGUAGES.find((l) => l.code === sourceLang)?.name || "Original"}
            </h3>
            {status === "listening" && (
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <div className="min-h-[120px] p-3 bg-white dark:bg-gray-800 rounded border">
            <p className="text-gray-800 dark:text-gray-200">
              {fullTranscript || originalText || (
                <span className="text-gray-400 italic">
                  {status === "listening"
                    ? "Speak now..."
                    : "Your speech will appear here"}
                </span>
              )}
              {interimTranscript && (
                <span className="text-gray-400 italic">
                  {interimTranscript}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Translated Text (Target Language) */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-green-700 dark:text-green-400">
              🔊{" "}
              {LANGUAGES.find((l) => l.code === targetLang)?.name ||
                "Translation"}
            </h3>
            {status === "speaking" && (
              <span className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
            )}
          </div>
          <div className="min-h-[120px] p-3 bg-white dark:bg-gray-800 rounded border">
            <p className="text-gray-800 dark:text-gray-200">
              {translatedText || (
                <span className="text-gray-400 italic">
                  {status === "translating"
                    ? "Translating..."
                    : "Translation will appear here"}
                </span>
              )}
            </p>
          </div>

          {/* Manual speak button */}
          {translatedText && !isSpeaking && (
            <button
              onClick={() =>
                speak(translatedText, { lang: getSpeechCode(targetLang) })
              }
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
            >
              🔊 Replay
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
