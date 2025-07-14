"use client";
import React from "react";
import { translateText, translateMessage } from "../utilities/api";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import CollectionsPage from "./CollectionsPage";

function MainComponent() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [fromLanguage, setFromLanguage] = React.useState("auto");
  const [toLanguage, setToLanguage] = React.useState("Spanish");
  const [inputText, setInputText] = React.useState("");
  const [translatedText, setTranslatedText] = React.useState("");
  const [isRecording, setIsRecording] = React.useState(false);
  const [translationHistory, setTranslationHistory] = React.useState([
    {
      id: 1,
      original: "Hello",
      translated: "Hola",
      from: "English",
      to: "Spanish",
      timestamp: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      original: "How are you?",
      translated: "¿Cómo estás?",
      from: "English",
      to: "Spanish",
      timestamp: new Date().toLocaleDateString(),
    },
    {
      id: 3,
      original: "Thank you",
      translated: "Gracias",
      from: "English",
      to: "Spanish",
      timestamp: new Date().toLocaleDateString(),
    },
  ]);
  const [currentPage, setCurrentPage] = React.useState("home");
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [translatedMessages, setTranslatedMessages] = React.useState({});
  const [selectedCollection, setSelectedCollection] = React.useState(null);
  const [showTranslationResult, setShowTranslationResult] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [messageToSave, setMessageToSave] = React.useState(null);
  const [showNewCollectionModal, setShowNewCollectionModal] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState("");
  const [newCollectionDescription, setNewCollectionDescription] = React.useState("");
  const [collections, setCollections] = React.useState([
    {
      id: 1,
      title: "Travel Phrases",
      description: "Essential phrases for traveling",
      phrases: [
        {
          id: 1,
          text: "¿Dónde está el aeropuerto?",
          language: "Spanish",
          pronunciation: "DON-deh es-TAH el ah-eh-ro-PWER-toh",
          english: "Where is the airport?",
        },
        {
          id: 2,
          text: "Necesito un taxi",
          language: "Spanish",
          pronunciation: "neh-seh-SEE-toh oon TAHK-see",
          english: "I need a taxi",
        },
        {
          id: 3,
          text: "¿Habla inglés?",
          language: "Spanish",
          pronunciation: "AH-blah in-GLEYS",
          english: "Do you speak English?",
        },
        {
          id: 4,
          text: "La cuenta, por favor",
          language: "Spanish",
          pronunciation: "lah KWEN-tah por fah-VOR",
          english: "The check, please",
        },
        {
          id: 5,
          text: "¿Dónde puedo cambiar dinero?",
          language: "Spanish",
          pronunciation: "DON-deh PWEH-doh kahm-bee-AHR dee-NEH-roh",
          english: "Where can I exchange money?",
        },
        {
          id: 6,
          text: "¿Cuánto cuesta?",
          language: "Spanish",
          pronunciation: "KWAN-toh KWES-tah",
          english: "How much does it cost?",
        },
        {
          id: 7,
          text: "No entiendo",
          language: "Spanish",
          pronunciation: "noh en-tee-EN-doh",
          english: "I don't understand",
        },
        {
          id: 8,
          text: "¿Dónde está el hotel?",
          language: "Spanish",
          pronunciation: "DON-deh es-TAH el oh-TEL",
          english: "Where is the hotel?",
        },
      ],
    },
    {
      id: 2,
      title: "Business Terms",
      description: "Professional phrases for business",
      phrases: [
        {
          id: 1,
          text: "Mucho gusto en conocerle",
          language: "Spanish",
          pronunciation: "MOO-choh GOOS-toh en koh-noh-SEHR-leh",
          english: "Nice to meet you",
        },
        {
          id: 2,
          text: "¿Podemos programar una reunión?",
          language: "Spanish",
          pronunciation: "poh-DEH-mohs proh-grah-MAHR OO-nah reh-oo-nee-OHN",
          english: "Can we schedule a meeting?",
        },
        {
          id: 3,
          text: "Enviaré el informe mañana",
          language: "Spanish",
          pronunciation: "en-vee-ah-REH el in-FOR-meh mah-NYAH-nah",
          english: "I will send the report tomorrow",
        },
        {
          id: 4,
          text: "¿Cuál es su opinión?",
          language: "Spanish",
          pronunciation: "kwal es soo oh-pee-nee-OHN",
          english: "What is your opinion?",
        },
        {
          id: 5,
          text: "Gracias por su tiempo",
          language: "Spanish",
          pronunciation: "GRAH-see-ahs por soo tee-EM-poh",
          english: "Thank you for your time",
        },
        {
          id: 6,
          text: "Necesito revisar los documentos",
          language: "Spanish",
          pronunciation: "neh-seh-SEE-toh reh-vee-SAHR lohs doh-koo-MEN-tohs",
          english: "I need to review the documents",
        },
        {
          id: 7,
          text: "¿Cuándo es la fecha límite?",
          language: "Spanish",
          pronunciation: "KWAN-doh es lah FEH-chah LEE-mee-teh",
          english: "When is the deadline?",
        },
        {
          id: 8,
          text: "Estoy de acuerdo",
          language: "Spanish",
          pronunciation: "es-TOY deh ah-KWEHR-doh",
          english: "I agree",
        },
      ],
    },
    {
      id: 3,
      title: "Daily Conversations",
      description: "Common phrases for everyday interactions",
      phrases: [
        {
          id: 1,
          text: "Hola, ¿cómo estás?",
          language: "Spanish",
          pronunciation: "OH-lah KOH-moh es-TAHS",
          english: "Hello, how are you?",
        },
        {
          id: 2,
          text: "¿Qué tal tu día?",
          language: "Spanish",
          pronunciation: "keh tahl too DEE-ah",
          english: "How was your day?",
        },
        {
          id: 3,
          text: "Me gusta mucho",
          language: "Spanish",
          pronunciation: "meh GOOS-tah MOO-choh",
          english: "I like it a lot",
        },
        {
          id: 4,
          text: "¿Dónde está el baño?",
          language: "Spanish",
          pronunciation: "DON-deh es-TAH el BAH-nyoh",
          english: "Where is the bathroom?",
        },
        {
          id: 5,
          text: "No hablo español muy bien",
          language: "Spanish",
          pronunciation: "noh AH-bloh es-pah-NYOHL mwee bee-EN",
          english: "I don't speak Spanish very well",
        },
        {
          id: 6,
          text: "¿Puedes ayudarme?",
          language: "Spanish",
          pronunciation: "PWEH-dehs ah-yoo-DAHR-meh",
          english: "Can you help me?",
        },
        {
          id: 7,
          text: "Hasta luego",
          language: "Spanish",
          pronunciation: "AHS-tah LWEH-goh",
          english: "See you later",
        },
        {
          id: 8,
          text: "Buenas noches",
          language: "Spanish",
          pronunciation: "BWEH-nahs NOH-chehs",
          english: "Good night",
        },
      ],
    },
  ]);

  // Load collections from localStorage on mount
  React.useEffect(() => {
    const savedCollections = localStorage.getItem('fluently_collections');
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    }
  }, []);

  // Save collections to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('fluently_collections', JSON.stringify(collections));
  }, [collections]);

  // Collection management functions
  const saveMessageToCollection = (message, collectionId) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId) {
        const newPhrase = {
          id: Date.now(),
          text: message.text,
          language: message.originalLanguage || "Spanish",
          pronunciation: message.translationDetails?.pronunciation || "",
          english: message.translation || message.text,
          timestamp: new Date().toLocaleDateString(),
          sender: message.sender
        };
        return {
          ...collection,
          phrases: [...collection.phrases, newPhrase]
        };
      }
      return collection;
    }));
    setShowSaveModal(false);
    setMessageToSave(null);
  };

  const createNewCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: Date.now(),
        title: newCollectionName.trim(),
        description: newCollectionDescription.trim() || "Collection of saved phrases",
        phrases: []
      };
      setCollections(prev => [newCollection, ...prev]);
      setNewCollectionName("");
      setNewCollectionDescription("");
      setShowNewCollectionModal(false);
    }
  };

  const removeCollection = (collectionId) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId));
    if (selectedCollection?.id === collectionId) {
      setSelectedCollection(null);
    }
  };

  const removePhraseFromCollection = (collectionId, phraseId) => {
    setCollections(prev => prev.map(collection => {
      if (collection.id === collectionId) {
        return {
          ...collection,
          phrases: collection.phrases.filter(phrase => phrase.id !== phraseId)
        };
      }
      return collection;
    }));
  };

  const languageFlags = {
    "auto": "🌐",
    "English": "🇬🇧",
    "Spanish": "🇪🇸",
    "French": "🇫🇷",
    "German": "🇩🇪",
    "Italian": "🇮🇹",
    "Portuguese": "🇵🇹",
    "Chinese": "🇨🇳",
    "Japanese": "🇯🇵",
    "Korean": "🇰🇷",
    "Arabic": "🇸🇦",
  };
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
  ];
  const fromLanguages = ["auto", ...languages];

  const conversations = [
    {
      id: 1,
      name: "Hana Yamamoto",
      avatar: "👩",
      lastMessage: "¡Hasta luego!",
      time: "2:30 PM",
      messages: [
        {
          id: 1,
          text: "¡Hola! ¿Cómo estás hoy?",
          sender: "them",
          timestamp: "2:15 PM",
          translation: "Hello! How are you today?",
          translationDetails: {
            translation: "Hello! How are you today?",
            tone_of_speech: "friendly",
            cultural_notes: "A common greeting in Spanish-speaking countries"
          }
        },
        {
          id: 2,
          text: "I'm doing well, thank you! How about you?",
          sender: "me",
          timestamp: "2:18 PM"
        },
        {
          id: 3,
          text: "¡Muy bien, gracias! ¿Qué tal tu día?",
          sender: "them",
          timestamp: "2:20 PM",
          translation: "Very well, thank you! How was your day?",
          translationDetails: {
            translation: "Very well, thank you! How was your day?",
            tone_of_speech: "friendly",
            cultural_notes: "A polite way to ask about someone's day"
          }
        },
        {
          id: 4,
          text: "It's been great! I'm learning Spanish.",
          sender: "me",
          timestamp: "2:25 PM"
        },
        {
          id: 5,
          text: "¡Excelente! Me alegra mucho escuchar eso. ¡Hasta luego!",
          sender: "them",
          timestamp: "2:30 PM",
          translation: "Excellent! I'm very happy to hear that. See you later!",
          translationDetails: {
            translation: "Excellent! I'm very happy to hear that. See you later!",
            tone_of_speech: "enthusiastic",
            cultural_notes: "A warm and encouraging response"
          }
        }
      ],
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      avatar: "👨",
      lastMessage: "",
      time: "",
      messages: [],
    },
    {
      id: 3,
      name: "Maria Santos",
      avatar: "👩‍🦰",
      lastMessage: "",
      time: "",
      messages: [],
    },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    const result = await translateText({ inputText, fromLanguage: fromLanguage === "auto" ? "auto" : fromLanguage, toLanguage });
    setTranslatedText(result);
    setShowTranslationResult(true);
    setLoading(false);
    const newTranslation = {
      id: Date.now(),
      original: inputText,
      translated: result,
      from: fromLanguage,
      to: toLanguage,
      timestamp: new Date().toLocaleDateString(),
    };
    setTranslationHistory([newTranslation, ...translationHistory]);
  };

  const handleTranslateMessage = async (messageId, messageText, fromLang) => {
    const result = await translateMessage({ messageText, fromLang, toLanguage });
    setTranslatedMessages((prev) => ({
      ...prev,
      [messageId]: result,
    }));
  };

  const swapLanguages = () => {
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  if (showSplash) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center cursor-pointer"
        onClick={() => setShowSplash(false)}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h1 className="text-4xl font-bold text-purple-600 font-poppins">
            Fluently
          </h1>
          <p className="text-purple-400 mt-2">Tap to continue</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col font-poppins">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Fluently
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-purple-100 to-blue-100">
        {currentPage === "home" && (
          <HomePage
            fromLanguage={fromLanguage}
            setFromLanguage={setFromLanguage}
            toLanguage={toLanguage}
            setToLanguage={setToLanguage}
            inputText={inputText}
            setInputText={setInputText}
            translatedText={translatedText}
            setTranslatedText={setTranslatedText}
            showTranslationResult={showTranslationResult}
            setShowTranslationResult={setShowTranslationResult}
            loading={loading}
            handleTranslate={handleTranslate}
            swapLanguages={swapLanguages}
            translationHistory={translationHistory}
            fromLanguages={fromLanguages}
            languages={languages}
            languageFlags={languageFlags}
          />
        )}
        {currentPage === "chat" && (
          <ChatPage
            conversations={conversations}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            translatedMessages={translatedMessages}
            setTranslatedMessages={setTranslatedMessages}
            handleTranslateMessage={handleTranslateMessage}
            collections={collections}
            setShowSaveModal={setShowSaveModal}
            setMessageToSave={setMessageToSave}
          />
        )}
        {currentPage === "collections" && (
          <CollectionsPage
            collections={collections}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
            createNewCollection={createNewCollection}
            removeCollection={removeCollection}
            removePhraseFromCollection={removePhraseFromCollection}
            showNewCollectionModal={showNewCollectionModal}
            setShowNewCollectionModal={setShowNewCollectionModal}
            newCollectionName={newCollectionName}
            setNewCollectionName={setNewCollectionName}
            newCollectionDescription={newCollectionDescription}
            setNewCollectionDescription={setNewCollectionDescription}
          />
        )}
      </div>

      {/* Save Message Modal */}
      {showSaveModal && messageToSave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Save to Collection</h3>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Message to save:</p>
              <p className="text-gray-800">{messageToSave.text}</p>
              {messageToSave.translation && (
                <p className="text-gray-600 text-sm mt-1">→ {messageToSave.translation}</p>
              )}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {collections.map((collection) => (
                <button
                  key={collection.id}
                  onClick={() => saveMessageToCollection(messageToSave, collection.id)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-800">{collection.title}</div>
                  <div className="text-sm text-gray-600">{collection.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{collection.phrases.length} phrases</div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setMessageToSave(null);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewCollectionModal(true)}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                New Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Collection Modal */}
      {showNewCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Create New Collection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collection Name</label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Enter collection name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNewCollectionModal(false);
                  setNewCollectionName("");
                  setNewCollectionDescription("");
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewCollection}
                disabled={!newCollectionName.trim()}
                className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-white/90 border-t border-blue-200 shadow-lg px-4 py-2 fixed bottom-0 left-0 w-full z-50 backdrop-blur-md">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentPage("home")}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              currentPage === "home"
                ? "bg-purple-100 text-purple-600"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            <span className="text-xl mb-1">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage("chat");
              setSelectedChat(null);
            }}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              currentPage === "chat"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <span className="text-xl mb-1">💬</span>
            <span className="text-xs font-medium">Chat</span>
          </button>

          <button
            onClick={() => {
              setCurrentPage("collections");
              setSelectedCollection(null);
            }}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              currentPage === "collections"
                ? "bg-purple-100 text-purple-600"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            <span className="text-xl mb-1">📚</span>
            <span className="text-xs font-medium">Collections</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;