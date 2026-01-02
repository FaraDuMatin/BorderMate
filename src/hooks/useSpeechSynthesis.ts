import { useState, useEffect, useCallback } from 'react';

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback(
    (
      text: string,
      options?: {
        lang?: string;
        voiceName?: string;
        rate?: number;
        pitch?: number;
      }
    ) => {
      if (!text.trim()) return;

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice by name or find by language
      if (options?.voiceName) {
        const voice = voices.find((v) => v.name === options.voiceName);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        }
      } else if (options?.lang) {
        const voice = voices.find((v) => v.lang.startsWith(options.lang!));
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = options.lang;
        }
      }

      utterance.rate = options?.rate ?? 1;
      utterance.pitch = options?.pitch ?? 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    },
    [voices]
  );

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Get voices filtered by language
  const getVoicesByLang = useCallback(
    (lang: string) => {
      return voices.filter((v) => v.lang.startsWith(lang));
    },
    [voices]
  );

  return {
    voices,
    isSpeaking,
    speak,
    stop,
    getVoicesByLang,
  };
}
