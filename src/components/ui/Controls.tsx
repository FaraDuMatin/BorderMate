type PipelineStatus = "idle" | "listening" | "translating" | "speaking";

interface ControlsProps {
  status: PipelineStatus;
  startListening: () => void;
  stopPipeline: () => void;
}

export default function Controls({ status, startListening, stopPipeline }: ControlsProps) {
  return (
    <div className="flex justify-center gap-4">
      {status === "idle" ? (
        <button
          onClick={startListening}
          className="p-4 sm:p-6 bg-transparent backdrop-blur-sm rounded-full border border-gray-200/20 dark:border-gray-700/30 hover:border-[#DECBA4]/50 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(222,203,164,0.3)] hover:scale-105"
        >
          <svg width="48" height="48" viewBox="-3 0 19 19" xmlns="http://www.w3.org/2000/svg" className="sm:w-16 sm:h-16">
            <defs>
              <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#3E5151', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#DECBA4', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path fill="url(#micGradient)" d="M11.665 7.915v1.31a5.257 5.257 0 0 1-1.514 3.694 5.174 5.174 0 0 1-1.641 1.126 5.04 5.04 0 0 1-1.456.384v1.899h2.312a.554.554 0 0 1 0 1.108H3.634a.554.554 0 0 1 0-1.108h2.312v-1.899a5.045 5.045 0 0 1-1.456-.384 5.174 5.174 0 0 1-1.641-1.126 5.257 5.257 0 0 1-1.514-3.695v-1.31a.554.554 0 1 1 1.109 0v1.31a4.131 4.131 0 0 0 1.195 2.917 3.989 3.989 0 0 0 5.722 0 4.133 4.133 0 0 0 1.195-2.917v-1.31a.554.554 0 1 1 1.109 0zM3.77 10.37a2.875 2.875 0 0 1-.233-1.146V4.738A2.905 2.905 0 0 1 3.77 3.58a3 3 0 0 1 1.59-1.59 2.902 2.902 0 0 1 1.158-.233 2.865 2.865 0 0 1 1.152.233 2.977 2.977 0 0 1 1.793 2.748l-.012 4.487a2.958 2.958 0 0 1-.856 2.09 3.025 3.025 0 0 1-.937.634 2.865 2.865 0 0 1-1.152.233 2.905 2.905 0 0 1-1.158-.233A2.957 2.957 0 0 1 3.77 10.37z"/>
          </svg>
        </button>
      ) : (
        <button
          onClick={stopPipeline}
          className="p-4 sm:p-6 bg-transparent backdrop-blur-sm rounded-full border border-gray-200/20 dark:border-gray-700/30 hover:border-[#DECBA4]/50 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(222,203,164,0.3)] hover:scale-105"
        >
          <svg width="48" height="48" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="sm:w-16 sm:h-16">
            <defs>
              <linearGradient id="stopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#3E5151', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#DECBA4', stopOpacity: 1}} />
              </linearGradient>
            </defs>
            <path fill="url(#stopGradient)" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z M336,320 c0,8.837-7.163,16-16,16H192c-8.837,0-16-7.163-16-16V192c0-8.837,7.163-16,16-16h128c8.837,0,16,7.163,16,16V320z"/>
          </svg>
        </button>
      )}
    </div>
  );
}
