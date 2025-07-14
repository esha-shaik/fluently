import React from "react";

function CollectionsPage({
  collections,
  selectedCollection,
  setSelectedCollection,
}) {
  const renderCollectionsList = () => (
    <div className="flex-1 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto min-h-0">
        <div className="flex items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Select a collection
          </h2>
        </div>
        <div className="space-y-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              onClick={() => setSelectedCollection(collection)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-lg mb-1">
                    {collection.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {collection.description}
                  </p>
                </div>
                <button className="bg-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-300 transition-colors">
                  + Save
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <button className="w-full bg-purple-200 text-purple-700 py-4 rounded-full text-lg font-medium hover:bg-purple-300 transition-colors">
            + Collections
          </button>
        </div>
      </div>
    </div>
  );

  const renderCollectionView = () => {
    if (!selectedCollection) return renderCollectionsList();

    return (
      <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
        {/* Collection Header */}
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center mb-2">
            <button
              onClick={() => setSelectedCollection(null)}
              className="mr-3 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center">
            {selectedCollection.title}
          </h2>
        </div>

        {/* Phrases List */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto hide-scrollbar min-h-0">
          {selectedCollection.phrases.map((phrase) => (
            <div
              key={phrase.id}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  {phrase.text}
                </h3>
                <button className="text-gray-400 hover:text-gray-600 text-xl">
                  🔊
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Language:</span>
                  <span className="text-gray-600 ml-2">{phrase.language}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Pronunciation:
                  </span>
                  <span className="text-gray-600 ml-2">
                    {phrase.pronunciation}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">English:</span>
                  <span className="text-gray-600 ml-2">{phrase.english}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Phrase Button */}
        <div className="p-4 bg-white border-t border-gray-200">
          <button className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium">
            + Add Phrase
          </button>
        </div>
      </div>
    );
  };

  return renderCollectionView();
}

export default CollectionsPage; 