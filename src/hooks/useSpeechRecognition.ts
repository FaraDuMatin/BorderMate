import { useState, useRef, useCallback } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export function useSpeechRecognition(options?: UseSpeechRecognitionOptions) {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef<any>(null);
  const langRef = useRef(options?.lang || 'en-US');

  const startListening = useCallback((lang?: string) => {
    setError('');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported. Use Chrome or Edge.');
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    
    recognition.continuous = options?.continuous ?? true;
    recognition.lang = lang || langRef.current;
    recognition.interimResults = options?.interimResults ?? true;
    
    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart + ' ';
        } else {
          interim += transcriptPart;
        }
      }
      
      if (final) {
        setTranscript(prev => prev + final);
      }
      setInterimTranscript(interim);
      
      console.log('Recognized:', { final, interim });
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setError(`Error: ${event.error}`);
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      console.log('Recognition ended');
    };
    
    recognition.start();
    recognitionRef.current = recognition;
    langRef.current = lang || langRef.current;
    setIsListening(true);
  }, [options?.continuous, options?.interimResults]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  const setLanguage = useCallback((lang: string) => {
    langRef.current = lang;
  }, []);

  return {
    transcript,
    interimTranscript,
    fullTranscript: transcript + interimTranscript,
    isListening,
    error,
    startListening,
    stopListening,
    clearTranscript,
    setLanguage,
  };
}
