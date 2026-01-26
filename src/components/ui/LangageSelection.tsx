import * as Select from "@radix-ui/react-select";

type PipelineStatus = "idle" | "listening" | "translating" | "speaking";

interface Language {
  code: string;
  name: string;
  speechCode: string;
}

interface LanguageSelectionProps {
  sourceLang: string;
  targetLang: string;
  setSourceLang: (lang: string) => void;
  setTargetLang: (lang: string) => void;
  swapLanguages: () => void;
  status: PipelineStatus;
  languages: Language[];
}

export default function LanguageSelection({
  sourceLang,
  targetLang,
  setSourceLang,
  setTargetLang,
  swapLanguages,
  status,
  languages,
}: LanguageSelectionProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 md:gap-6 flex-wrap px-2 sm:px-0">
      {/* Source Language Select */}
      <Select.Root value={sourceLang} onValueChange={setSourceLang} disabled={status !== "idle"}>
        <Select.Trigger className="inline-flex items-center justify-between gap-2 sm:gap-3 pl-4 sm:pl-6 md:pl-8 pr-3 sm:pr-4 py-3 sm:py-3.5 md:py-4 bg-transparent backdrop-blur-sm rounded-2xl border border-[#3E5151]/30 dark:border-[#3E5151]/50 text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 hover:border-[#DECBA4]/50 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#DECBA4]/50 disabled:opacity-50 cursor-pointer min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
          <Select.Value />
          <Select.Icon>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content 
            position="popper"
            className="overflow-visible bg-black/95 backdrop-blur-xl rounded-2xl border border-[#3E5151]/50 shadow-2xl"
            style={{ maxHeight: 'none' }}
          >
            <Select.Viewport className="p-2 max-h-[400px] overflow-y-auto">
              {languages.map((lang) => (
                <Select.Item
                  key={lang.code}
                  value={lang.code}
                  className="relative flex items-center px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-base sm:text-lg text-gray-200 rounded-xl outline-none cursor-pointer select-none hover:bg-[#DECBA4]/10 focus:bg-[#DECBA4]/20 data-[highlighted]:bg-[#DECBA4]/20 transition-colors"
                >
                  <Select.ItemText>{lang.name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      {/* Swap Button */}
      <button
        onClick={swapLanguages}
        disabled={status !== "idle"}
        className="p-3 sm:p-3.5 md:p-4 bg-transparent backdrop-blur-sm rounded-full border border-[#3E5151]/30 dark:border-[#3E5151]/50 hover:border-[#DECBA4]/50 transition-all shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        title="Swap languages"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="sm:w-7 sm:h-7 md:w-8 md:h-8">
          <defs>
            <linearGradient id="flipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#DECBA4", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#3E5151", stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <g data-name="Layer 2">
            <g data-name="flip-2">
              <rect width="24" height="24" transform="rotate(180 12 12)" opacity="0" />
              <path
                fill="url(#flipGradient)"
                d="M6.09 19h12l-1.3 1.29a1 1 0 0 0 1.42 1.42l3-3a1 1 0 0 0 0-1.42l-3-3a1 1 0 0 0-1.42 0 1 1 0 0 0 0 1.42l1.3 1.29h-12a1.56 1.56 0 0 1-1.59-1.53V13a1 1 0 0 0-2 0v2.47A3.56 3.56 0 0 0 6.09 19z"
              />
              <path
                fill="url(#flipGradient)"
                d="M5.79 9.71a1 1 0 1 0 1.42-1.42L5.91 7h12a1.56 1.56 0 0 1 1.59 1.53V11a1 1 0 0 0 2 0V8.53A3.56 3.56 0 0 0 17.91 5h-12l1.3-1.29a1 1 0 0 0 0-1.42 1 1 0 0 0-1.42 0l-3 3a1 1 0 0 0 0 1.42z"
              />
            </g>
          </g>
        </svg>
      </button>

      {/* Target Language Select */}
      <Select.Root value={targetLang} onValueChange={setTargetLang} disabled={status !== "idle"}>
        <Select.Trigger className="inline-flex items-center justify-between gap-2 sm:gap-3 pl-4 sm:pl-6 md:pl-8 pr-3 sm:pr-4 py-3 sm:py-3.5 md:py-4 bg-transparent backdrop-blur-sm rounded-2xl border border-[#3E5151]/30 dark:border-[#3E5151]/50 text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 hover:border-[#DECBA4]/50 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#DECBA4]/50 disabled:opacity-50 cursor-pointer min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
          <Select.Value />
          <Select.Icon>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content 
            position="popper"
            className="overflow-hidden bg-black/95 backdrop-blur-xl rounded-2xl border border-[#3E5151]/50 shadow-2xl"
            sideOffset={5}
          >
            <Select.Viewport className="p-2 max-h-[400px] overflow-y-auto">
              {languages.map((lang) => (
                <Select.Item
                  key={lang.code}
                  value={lang.code}
                  className="relative flex items-center px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-base sm:text-lg text-gray-200 rounded-xl outline-none cursor-pointer select-none hover:bg-[#DECBA4]/10 focus:bg-[#DECBA4]/20 data-[highlighted]:bg-[#DECBA4]/20 transition-colors"
                >
                  <Select.ItemText>{lang.name}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
