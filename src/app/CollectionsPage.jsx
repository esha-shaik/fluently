import React from "react";

function CollectionsPage({
  collections,
  selectedCollection,
  setSelectedCollection,
  createNewCollection,
  removeCollection,
  removePhraseFromCollection,
  showNewCollectionModal,
  setShowNewCollectionModal,
  newCollectionName,
  setNewCollectionName,
  newCollectionDescription,
  setNewCollectionDescription,
}) {
  const renderCollectionsList = () => (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 w-full max-w-6xl mx-auto my-4 sm:my-8 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Collections
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">Organize and save your favorite phrases</p>
          </div>
          <button 
            onClick={() => setShowNewCollectionModal(true)}
            className="group relative flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-5 py-2.5 rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105 w-full sm:w-auto"
          >
            <span className="text-lg sm:text-xl group-hover:rotate-90 transition-transform duration-300">＋</span> 
            <span className="hidden sm:inline">New Collection</span>
            <span className="sm:hidden">New Collection</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="group relative bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/90"
              style={{ minHeight: 180 }}
            >
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => removeCollection(collection.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-600 p-1.5 sm:p-2 rounded-xl transition-colors duration-200"
                >
                  🗑️
                </button>
              </div>
              
              <div 
                className="cursor-pointer h-full flex flex-col"
                onClick={() => setSelectedCollection(collection)}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl sm:text-2xl text-white">📚</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base sm:text-lg text-slate-800 mb-1 line-clamp-1">
                      {collection.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-indigo-600 bg-indigo-100 px-2 sm:px-3 py-1 rounded-full font-medium">
                        {collection.phrases.length} phrases
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3 flex-1">
                  {collection.description}
                </p>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => setSelectedCollection(collection)}
                    className="w-full bg-gradient-to-r from-slate-100 to-slate-200 hover:from-indigo-100 hover:to-purple-100 text-slate-700 hover:text-indigo-700 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl font-semibold transition-all duration-300 group-hover:shadow-md text-xs sm:text-sm"
                  >
                    View Collection →
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {collections.length === 0 && (
            <div className="col-span-full text-center py-12 sm:py-20">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl">
                <span className="text-3xl sm:text-4xl">📚</span>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 mb-3 sm:mb-4">Start Your Collection</h3>
              <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
                Create your first collection to organize and save your favorite phrases from conversations.
              </p>
              <button 
                onClick={() => setShowNewCollectionModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
              >
                Create Your First Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderCollectionView = () => {
    if (!selectedCollection) return renderCollectionsList();

    return (
      <div className="flex flex-col min-h-screen flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Collection Header */}
        <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-lg px-3 sm:px-6 py-3 sm:py-4 border-b border-white/20">
          <div className="max-w-6xl mx-auto flex items-center">
            <button
              onClick={() => setSelectedCollection(null)}
              className="mr-3 sm:mr-4 text-slate-600 hover:text-indigo-600 p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
            >
              <span className="text-xl sm:text-2xl">←</span>
            </button>
            
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-lg sm:text-xl text-white">📚</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-base sm:text-lg text-slate-800 truncate">
                  {selectedCollection.title}
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm truncate">{selectedCollection.description}</p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <span className="text-xs sm:text-sm bg-indigo-100 text-indigo-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-semibold">
                  {selectedCollection.phrases.length} phrases
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phrases List */}
        <div className="flex-1 p-3 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {selectedCollection.phrases.map((phrase) => (
              <div
                key={phrase.id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/30 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-3">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-4 leading-relaxed">
                      {phrase.text}
                    </h3>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-indigo-100">
                      <span className="font-semibold text-indigo-700 text-xs sm:text-sm uppercase tracking-wide">English Translation</span>
                      <p className="text-slate-700 mt-1 text-sm sm:text-base">{phrase.english}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-2 sm:ml-6 self-start">
                    <button className="text-indigo-500 hover:text-indigo-600 p-2 sm:p-3 rounded-xl hover:bg-indigo-50 transition-all duration-200">
                      🔊
                    </button>
                    <button 
                      onClick={() => removePhraseFromCollection(selectedCollection.id, phrase.id)}
                      className="text-red-400 hover:text-red-600 p-2 sm:p-3 rounded-xl hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl">
                    <span className="text-indigo-600 text-base sm:text-lg">🌍</span>
                    <div className="min-w-0">
                      <span className="text-slate-500 text-xs uppercase tracking-wide">Language</span>
                      <p className="font-semibold text-slate-700 truncate">{phrase.language}</p>
                    </div>
                  </div>
                  
                  {phrase.pronunciation && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl">
                      <span className="text-indigo-600 text-base sm:text-lg">🔊</span>
                      <div className="min-w-0">
                        <span className="text-slate-500 text-xs uppercase tracking-wide">Pronunciation</span>
                        <p className="font-mono text-slate-700 text-xs truncate">{phrase.pronunciation}</p>
                      </div>
                    </div>
                  )}
                  
                  {phrase.timestamp && (
                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-xl sm:col-span-1">
                      <span className="text-green-600 text-base sm:text-lg">📅</span>
                      <div className="min-w-0">
                        <span className="text-slate-500 text-xs uppercase tracking-wide">Saved</span>
                        <p className="font-semibold text-slate-700 text-xs truncate">{phrase.timestamp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {selectedCollection.phrases.length === 0 && (
              <div className="text-center py-12 sm:py-20">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
                  <span className="text-2xl sm:text-3xl">💬</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4">No phrases yet</h3>
                <p className="text-slate-600 max-w-md mx-auto text-sm sm:text-base leading-relaxed px-4">
                  Save messages from your conversations to add phrases to this collection.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Info */}
        <div className="fixed bottom-20 left-0 w-full flex justify-center z-40 pointer-events-none px-3 sm:px-6">
          <div className="w-full max-w-4xl flex-shrink-0 pb-4 pointer-events-auto">
            <div className="bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl p-3 sm:p-4 text-center shadow-xl">
              <p className="text-slate-600 font-medium text-sm sm:text-base">
                💡 Save messages from chats to add phrases to this collection
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderCollectionView();
}

export default CollectionsPage; 