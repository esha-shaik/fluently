import React, { useState, useMemo } from "react";

function TranslationsPage({ translationHistory, languageFlags, clearHistory }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter translations based on search term
  const filteredTranslations = useMemo(() => {
    return translationHistory.filter(item => {
      const matchesSearch = 
        item.original.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.translated.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [translationHistory, searchTerm]);

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all translation history?")) {
      clearHistory();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="px-3 sm:px-4 py-4 sm:py-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    History
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {filteredTranslations.length} of {translationHistory.length} translations
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearHistory}
                className="group relative flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 text-white text-xs sm:text-sm font-semibold rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-red-400/20"
              >
                <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="relative z-10 hidden sm:inline">Clear</span>
                <span className="relative z-10 sm:hidden">Clear</span>
              </button>
            </div>
            
            {/* Enhanced Search Only */}
            <div className="max-w-2xl">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search your translations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 sm:pl-14 pr-6 py-3 sm:py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md text-base sm:text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Content */}
      <div className="flex-1 px-3 sm:px-4 py-6 sm:py-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {filteredTranslations.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                {searchTerm ? "No translations found" : "No translations yet"}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base px-4">
                {searchTerm 
                  ? "Try adjusting your search terms to find what you're looking for." 
                  : "Start translating text to build your personal translation history and track your progress."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {filteredTranslations.map((item, index) => (
                <div
                  key={item.id || index}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200/50 p-4 sm:p-6 hover:shadow-xl hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-300 hover:border-purple-200"
                >
                  {/* Header with language info and timestamp */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-50 to-blue-50 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl border border-purple-100">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-lg sm:text-2xl">{languageFlags[item.from] || "🌐"}</span>
                          <span className="text-xs sm:text-sm font-semibold text-gray-700">{item.from}</span>
                        </div>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-lg sm:text-2xl">{languageFlags[item.to] || "🌐"}</span>
                          <span className="text-xs sm:text-sm font-semibold text-gray-700">{item.to}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full self-start">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {item.timestamp}
                    </div>
                  </div>
                  
                  {/* Translation content */}
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="p-3 sm:p-4 bg-gray-50/80 rounded-xl sm:rounded-2xl border border-gray-100">
                      <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed">{item.original}</p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl sm:rounded-2xl border border-purple-200 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-full -translate-y-8 sm:-translate-y-10 translate-x-8 sm:translate-x-10"></div>
                      <p className="text-purple-800 font-semibold text-base sm:text-lg leading-relaxed relative z-10">
                        {typeof item.translated === 'object' ? item.translated.translation || item.translated.error : item.translated}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button 
                        onClick={() => copyToClipboard(item.original)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-purple-600 hover:text-purple-700 text-xs sm:text-sm font-medium rounded-xl hover:bg-purple-50 transition-all duration-200 border border-purple-200 hover:border-purple-300 group/btn"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Original
                      </button>
                      <button 
                        onClick={() => copyToClipboard(typeof item.translated === 'object' ? item.translated.translation || item.translated.error : item.translated)}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium rounded-xl hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300 group/btn"
                      >
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Translation
                      </button>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TranslationsPage; 