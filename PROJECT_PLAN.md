# 🌐 Real-Time Translation Web App - Project Plan

## Overview
A browser-based web app that enables two people speaking different languages to communicate in real-time through automatic speech translation.

---

## 🏗️ Architecture Pipeline

```
🎤 Microphone (Person A)
       ↓
Speech-to-Text (Web Speech API)
       ↓
Translation (LibreTranslate API)
       ↓
Text-to-Speech (Web Speech Synthesis API)
       ↓
🔊 Speaker (Person B hears in their language)
```

---

## 📋 Tech Stack

| Component | Technology | Cost |
|-----------|------------|------|
| **Framework** | Next.js (Static Export) | Free |
| **Speech-to-Text** | Web Speech API (Browser built-in) | Free |
| **Translation** | LibreTranslate (Public API or Self-hosted) | Free |
| **Text-to-Speech** | Web Speech Synthesis API (Browser built-in) | Free |
| **Hosting** | GitHub Pages | Free |

---

## 🔧 Component Details

### 1. Speech-to-Text (STT)
**Technology:** Web Speech API (`SpeechRecognition`)

- ✅ Built into modern browsers (Chrome, Edge, Safari)
- ✅ No API key required
- ✅ Supports multiple languages
- ✅ Real-time continuous recognition
- ⚠️ Best support in Chrome/Edge (uses Google's speech recognition)

```javascript
// Example usage
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  // Send to translation
};
```

### 2. Translation
**Technology:** LibreTranslate API

#### Option A: Use Public Instance (Recommended for simplicity)
- **URL:** `https://libretranslate.com/translate`
- **Pros:** No setup required, instant usage
- **Cons:** Rate limits, requires API key for heavy usage
- **API Key:** Get free key at https://portal.libretranslate.com (limited requests)

#### Option B: Use Community Mirrors (Free, no key)
Several community-hosted instances exist that don't require API keys:
- `https://translate.argosopentech.com/translate`
- `https://translate.terraprint.co/translate`
- Check https://github.com/LibreTranslate/LibreTranslate for updated list

#### Option C: Self-Host with Docker (Full control)
```bash
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
```
- **Pros:** No rate limits, full control, privacy
- **Cons:** Requires server hosting (not free unless on your machine)

#### 📌 Recommendation for Your Case:
**Use Option B (Community Mirrors)** - They're free, no API key needed, and work directly from client-side JavaScript. If rate-limited, fall back to another mirror.

```javascript
// API Call Example
const response = await fetch("https://translate.argosopentech.com/translate", {
  method: "POST",
  body: JSON.stringify({
    q: "Hello, how are you?",
    source: "en",
    target: "es"
  }),
  headers: { "Content-Type": "application/json" }
});
const data = await response.json();
console.log(data.translatedText); // "Hola, ¿cómo estás?"
```

### 3. Text-to-Speech (TTS)
**Technology:** Web Speech Synthesis API (`speechSynthesis`)

- ✅ Built into all modern browsers
- ✅ No API key required
- ✅ Multiple voices per language
- ✅ Adjustable rate, pitch, volume

```javascript
// Example usage
const utterance = new SpeechSynthesisUtterance("¡Hola!");
utterance.lang = 'es-ES';
speechSynthesis.speak(utterance);
```

---

## 🌐 Hosting: GitHub Pages

### Is it Possible?
**YES! 100% client-side, no backend needed.**

### Requirements:
1. Next.js with **Static Export** (`output: 'export'` in next.config.js)
2. No server-side features (no API routes, no SSR)
3. All API calls happen in the browser (client-side fetch)

### No Database Needed:
- All processing happens in real-time
- No user data to store
- Language preferences can be stored in `localStorage`

---

## 📝 Step-by-Step Implementation Plan

### Phase 1: Project Setup
- [ ] **1.1** Create Next.js project with TypeScript
- [ ] **1.2** Configure for static export (GitHub Pages compatible)
- [ ] **1.3** Set up project structure and basic styling (Tailwind CSS)
- [ ] **1.4** Create basic UI layout with two user panels

### Phase 2: Speech-to-Text Module
- [ ] **2.1** Create Speech Recognition hook (`useSpeechRecognition`)
- [ ] **2.2** Handle browser compatibility (Chrome/Edge/Safari)
- [ ] **2.3** Implement start/stop recording controls
- [ ] **2.4** Display real-time transcript
- [ ] **2.5** Handle interim vs final results

### Phase 3: Translation Module
- [ ] **3.1** Create Translation service with fallback URLs
- [ ] **3.2** Implement language detection (optional)
- [ ] **3.3** Create language selector component
- [ ] **3.4** Handle translation errors and rate limits
- [ ] **3.5** Add loading states

### Phase 4: Text-to-Speech Module
- [ ] **4.1** Create Speech Synthesis hook (`useSpeechSynthesis`)
- [ ] **4.2** Load available voices for each language
- [ ] **4.3** Implement voice selection
- [ ] **4.4** Add playback controls (pause, resume, stop)

### Phase 5: Integration & UI
- [ ] **5.1** Connect all three modules in the pipeline
- [ ] **5.2** Create two-person interface (Person A & Person B)
- [ ] **5.3** Add language swap functionality
- [ ] **5.4** Implement conversation history display
- [ ] **5.5** Add visual indicators (recording, translating, speaking)

### Phase 6: Polish & UX
- [ ] **6.1** Add responsive design for mobile
- [ ] **6.2** Implement dark/light mode
- [ ] **6.3** Add keyboard shortcuts
- [ ] **6.4** Handle edge cases (no mic permission, no voices, etc.)
- [ ] **6.5** Add "Push to Talk" and "Continuous" modes

### Phase 7: Deployment
- [ ] **7.1** Configure GitHub Actions for auto-deploy
- [ ] **7.2** Set up GitHub Pages
- [ ] **7.3** Test on multiple browsers
- [ ] **7.4** Add PWA support (optional - offline capabilities)

---

## 📁 Proposed Project Structure

```
RealTimeTranslation/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── TranslationPanel.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── RecordButton.tsx
│   │   ├── ConversationHistory.tsx
│   │   └── VoiceSelector.tsx
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts
│   │   ├── useSpeechSynthesis.ts
│   │   └── useTranslation.ts
│   ├── services/
│   │   └── translationService.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── languages.ts
├── public/
│   └── icons/
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## 🌍 Supported Languages (LibreTranslate)

Common pairs available:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Arabic (ar)
- Hindi (hi)
- And 20+ more...

Full list: https://libretranslate.com/languages

---

## ⚠️ Known Limitations

1. **Web Speech API Browser Support**
   - Best on Chrome/Edge (uses Google's servers)
   - Safari has limited support
   - Firefox doesn't support SpeechRecognition

2. **LibreTranslate Rate Limits**
   - Public instance has rate limits
   - Solution: Use multiple fallback mirrors

3. **TTS Voice Quality**
   - Varies by browser and OS
   - Some languages have limited voice options

4. **HTTPS Required**
   - Microphone access requires HTTPS
   - GitHub Pages provides HTTPS by default ✅

---

## 🚀 Getting Started Commands

```bash
# Create Next.js project
npx create-next-app@latest real-time-translation --typescript --tailwind --app

# Navigate to project
cd real-time-translation

# Install dependencies (if any additional needed)
npm install

# Run development server
npm run dev

# Build for static export
npm run build

# The output will be in 'out/' folder for GitHub Pages
```

---

## 📚 Resources

- [Web Speech API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [LibreTranslate Docs](https://docs.libretranslate.com/)
- [LibreTranslate GitHub](https://github.com/LibreTranslate/LibreTranslate)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Pages Deployment](https://pages.github.com/)

---

## ✅ Summary

| Question | Answer |
|----------|--------|
| Backend needed? | **No** - All client-side |
| Database needed? | **No** - Real-time only |
| GitHub Pages compatible? | **Yes** - Static export |
| Total cost? | **$0** - All free APIs |
| LibreTranslate approach? | **API call to public mirrors** (no self-hosting needed) |

---

Ready to start building? Let me know when you want to proceed with Phase 1! 🚀
