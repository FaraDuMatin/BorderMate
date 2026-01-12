"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { translate } from "@/services/translationService";

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

type PipelineStatus =
  | "idle"
  | "p1Speaks"
  | "translatingP1"
  | "speakingP1"
  | "p2Speaks"
  | "translatingP2"
  | "speakingP2";

export default function SecondPipeline() {
  // p1 and p2 langage
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("");

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
    clearTranscript 
  } = useSpeechRecognition();
  
  const { 
    isSpeaking, 
    speak, 
    stop: stopTTS,
    getVoicesByLang 
  } = useSpeechSynthesis();

  



}
