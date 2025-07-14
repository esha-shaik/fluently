import React from "react";

function HomePage({
  fromLanguage,
  setFromLanguage,
  toLanguage,
  setToLanguage,
  inputText,
  setInputText,
  translatedText,
  setTranslatedText,
  showTranslationResult,
  setShowTranslationResult,
  loading,
  handleTranslate,
  swapLanguages,
  translationHistory,
  fromLanguages,
  languages,
  languageFlags,
}) {
  return (
    <div className="flex-1 p-4 flex flex-col min-h-0 space-y-0 pb-28 bg-gradient-to-br from-purple-100 via-blue-50 to-blue-200">
      {/* Main content split: translation area (top, fixed height) + history (bottom, fills remaining space) */}
      <div className="flex flex-col flex-shrink-0">
        {/* Translation Box */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-2 flex flex-col border border-blue-100 animate-fade-in transition-all duration-300 w-full md:w-4/5 lg:w-3/5 mx-auto" style={{ flex: '0 0 auto' }}>
          {/* Language Selection */}
          <div className="flex items-center justify-between mb-2">
            <div className="relative w-full">
              <select
                value={fromLanguage}
                onChange={(e) => setFromLanguage(e.target.value)}
                className="bg-purple-50 text-purple-700 px-3 pl-8 py-2 rounded-xl border border-purple-200 outline-none font-medium shadow-sm focus:ring-2 focus:ring-purple-300 appearance-none w-full transition-all duration-200"
              >
                <option key="auto" value="auto">Auto Detect</option>
                {fromLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <span className="pointer-events-none absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">{languageFlags[fromLanguage] || "🌐"}</span>
              <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg hidden sm:inline">▼</span>
            </div>

            <button
              onClick={swapLanguages}
              className="p-2 text-purple-500 hover:bg-purple-100 rounded-lg transition-colors border border-purple-100 shadow-sm mx-2"
              aria-label="Swap languages"
            >
              ⇄
            </button>

            <div className="relative w-full">
              <select
                value={toLanguage}
                onChange={(e) => setToLanguage(e.target.value)}
                className="bg-blue-50 text-blue-700 px-3 pl-8 py-2 rounded-xl border border-blue-200 outline-none font-medium shadow-sm focus:ring-2 focus:ring-blue-300 appearance-none w-full transition-all duration-200"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <span className="pointer-events-none absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">{languageFlags[toLanguage] || "🌐"}</span>
              <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg hidden sm:inline">▼</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="relative mb-4">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full p-4 border-2 border-purple-200 rounded-2xl resize-none h-14 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-200 transition-all duration-200 shadow bg-purple-50 text-gray-800 hide-scrollbar"
            />
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-purple-100" />

          {/* Translation Result Card with animation and close button */}
          {showTranslationResult && translatedText && typeof translatedText === 'object' && !translatedText.error && (
            <div
              className="relative bg-gradient-to-r from-blue-50 to-purple-100 rounded-2xl p-7 shadow-xl border border-blue-100 flex flex-col gap-4 transition-all duration-500 animate-fade-in"
              style={{ minHeight: '80px' }}
            >
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-lg font-bold rounded-full p-1 transition-colors z-10"
                onClick={() => setShowTranslationResult(false)}
                aria-label="Close translation result"
              >
                ×
              </button>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🌍</span>
                <span className="text-2xl font-extrabold text-blue-800 bg-blue-100/60 px-4 py-2 rounded-xl shadow-sm">{translatedText.translation}</span>
                {translatedText.part_of_speech && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200 font-semibold">{translatedText.part_of_speech}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {translatedText.pronunciation && (
                  <span className="flex items-center gap-1"><span className="text-blue-400">🔊</span><span className="font-medium">{translatedText.pronunciation}</span></span>
                )}
                {translatedText.detected_language && (
                  <span className="flex items-center gap-1"><span className="text-blue-400">🌐</span>Detected: <span className="font-medium">{translatedText.detected_language}</span></span>
                )}
              </div>
              {translatedText.example_usage && (
                <div className="flex items-center gap-2 text-blue-700 text-base italic mt-2"><span>📖</span><span>{translatedText.example_usage}</span></div>
              )}
              {translatedText.synonyms && Array.isArray(translatedText.synonyms) && translatedText.synonyms.length > 0 && (
                <div className="flex items-center gap-2 text-blue-500 text-sm mt-2">
                  <span>🔗</span>
                  <span>Synonyms:</span>
                  {translatedText.synonyms.slice(0, 2).map((syn, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium border border-blue-200">{syn}</span>
                  ))}
                </div>
              )}
            </div>
          )}
          {translatedText && translatedText.error && (
            <div className="p-4 bg-red-100 rounded-xl text-red-700">{translatedText.error}</div>
          )}

          <button
            onClick={handleTranslate}
            className="w-4/5 mx-auto mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-xl focus:ring-2 focus:ring-blue-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        {/* Translation History - always visible, scrollable */}
        <div className="hidden md:flex bg-white rounded-3xl shadow-xl p-8 flex-1 flex-col min-h-0 mt-6 max-h-[400px] overflow-y-auto pb-10 hide-scrollbar border border-blue-100 animate-fade-in transition-all duration-300 w-full md:w-4/5 lg:w-4/5 mx-auto">
          <h3 className="text-2xl font-bold text-blue-700 mb-5 tracking-tight">
            Recent Translations
          </h3>
          <div className="space-y-3 flex-1 min-h-0 hide-scrollbar">
            {translationHistory.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">
                    {item.from} → {item.to}
                  </span>
                  <span className="text-xs text-gray-400">{item.timestamp}</span>
                </div>
                <div className="font-medium text-gray-800 mb-1">{item.original}</div>
                {item.translated && !item.translated.error && (
                  <div className="flex items-center gap-2 text-blue-800 font-semibold">
                    <span className="text-lg">🌍</span>
                    <span>{item.translated.translation}</span>
                  </div>
                )}
                {item.translated && item.translated.error && (
                  <div className="text-red-600 text-xs">{item.translated.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Mobile: non-scrollable, just let the page scroll */}
        <div className="block md:hidden bg-white rounded-3xl shadow-xl p-8 flex-1 flex flex-col min-h-0 mt-6 border border-blue-100 animate-fade-in transition-all duration-300 w-full mx-auto">
          <h3 className="text-2xl font-bold text-blue-700 mb-5 tracking-tight">
            Recent Translations
          </h3>
          <div className="space-y-3 flex-1 min-h-0">
            {translationHistory.map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-500">
                    {item.from} → {item.to}
                  </span>
                  <span className="text-xs text-gray-400">{item.timestamp}</span>
                </div>
                <div className="font-medium text-gray-800 mb-1">{item.original}</div>
                {item.translated && !item.translated.error && (
                  <div className="flex items-center gap-2 text-blue-800 font-semibold">
                    <span className="text-lg">🌍</span>
                    <span>{item.translated.translation}</span>
                  </div>
                )}
                {item.translated && item.translated.error && (
                  <div className="text-red-600 text-xs">{item.translated.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 