"use client";

interface Language {
  code: string;
  name: string;
  speechCode: string;
}

type PipelineStatus = "idle" | "listening" | "translating" | "speaking";

interface TextDisplayProps {
  sourceLang: string;
  targetLang: string;
  status: PipelineStatus;
  languages: Language[];
  fullTranscript: string;
  originalText: string;
  interimTranscript: string;
  translatedText: string;
}

export default function TextDisplay({
  sourceLang,
  targetLang,
  status,
  languages,
  fullTranscript,
  originalText,
  interimTranscript,
  translatedText,
}: TextDisplayProps) {
  return (
    <div className="grid md:grid-cols-2 gap-3 sm:gap-4 px-2 sm:px-0">
      {/* Original Text (Source Language) */}
      <div className="p-3 sm:p-4 bg-transparent backdrop-blur-sm rounded-2xl border border-[#3E5151]/50 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-[#3E5151] to-[#DECBA4] bg-clip-text text-transparent flex items-center gap-1.5 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="url(#headerGradient)" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DECBA4" />
                  <stop offset="100%" stopColor="#3E5151" />
                </linearGradient>
              </defs>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            {languages.find((l) => l.code === sourceLang)?.name || "Original"}
          </h3>
          {status === "listening" && (
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#DECBA4] rounded-full animate-pulse shadow-[0_0_10px_rgba(222,203,164,0.5)]" />
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-200 min-h-[80px] sm:min-h-[100px]">
          {fullTranscript || originalText || (
            <span className="text-gray-500 italic">
              {status === "listening"
                ? "Speak now..."
                : "Your speech will appear here"}
            </span>
          )}
          {interimTranscript && (
            <span className="text-[#DECBA4]/60 italic">
              {interimTranscript}
            </span>
          )}
        </p>
      </div>

      {/* Translated Text (Target Language) */}
      <div className="p-3 sm:p-4 bg-transparent backdrop-blur-sm rounded-2xl border border-[#3E5151]/50 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-[#3E5151] to-[#DECBA4] bg-clip-text text-transparent flex items-center gap-1.5 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="speakerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DECBA4" />
                  <stop offset="100%" stopColor="#3E5151" />
                </linearGradient>
              </defs>
              <path stroke="url(#speakerGradient)" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            {languages.find((l) => l.code === targetLang)?.name || "Translation"}
          </h3>
          {status === "speaking" && (
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#DECBA4] rounded-full animate-pulse shadow-[0_0_10px_rgba(222,203,164,0.5)]" />
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-200 min-h-[80px] sm:min-h-[100px]">
          {translatedText || (
            <span className="text-gray-500 italic">
              {status === "translating"
                ? "Translating..."
                : "Translation will appear here"}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
