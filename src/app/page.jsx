"use client";
import React from "react";
import { translateText, translateMessage } from "../utilities/api";

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

  const collections = [
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
          text: "¿Cómo se dice esto en español?",
          language: "Spanish",
          pronunciation: "KOH-moh seh DEE-seh ES-toh en es-pah-NYOHL",
          english: "How do you say this in Spanish?",
        },
      ],
    },
  ];

  const conversations = [
    {
      id: 1,
      name: "Hana Yamamoto",
      avatar: "👩",
      lastMessage: "I'm doing well! I just moved into my new apartment...",
      time: "2:30 PM",
      messages: [
        {
          id: 1,
          text: "Hello, how are you? 😊 (excited/happy)",
          sender: "them",
          originalLanguage: "Japanese",
          timestamp: "2:25 PM",
        },
        {
          id: 2,
          text: "Hi! I'm good, how are you doing?",
          sender: "me",
          timestamp: "2:28 PM",
        },
        {
          id: 3,
          text: "I'm doing well! I just moved into my new apartment and am currently looking for a job. Are in you in town this week?",
          sender: "them",
          originalLanguage: "Japanese",
          timestamp: "2:30 PM",
        },
      ],
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      avatar: "👨",
      lastMessage: "¿Quieres ir al restaurante nuevo?",
      time: "1:15 PM",
      messages: [
        {
          id: 1,
          text: "¡Hola! ¿Cómo estás?",
          sender: "them",
          originalLanguage: "Spanish",
          timestamp: "1:10 PM",
        },
        {
          id: 2,
          text: "Hi Carlos! I'm doing well, thanks!",
          sender: "me",
          timestamp: "1:12 PM",
        },
        {
          id: 3,
          text: "¿Quieres ir al restaurante nuevo?",
          sender: "them",
          originalLanguage: "Spanish",
          timestamp: "1:15 PM",
        },
      ],
    },
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    const result = await translateText({ inputText, fromLanguage: fromLanguage === "auto" ? "auto" : fromLanguage, toLanguage });
    setTranslatedText(result);
    setShowTranslationResult(true);
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

  const renderHomePage = () => (
    <div className="flex-1 p-4 flex flex-col min-h-0 space-y-0 pb-28">
      {/* Main content split: translation area (top, fixed height) + history (bottom, fills remaining space) */}
      <div className="flex flex-col flex-shrink-0">
        {/* Translation Box */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4 flex flex-col gap-4" style={{ flex: '0 0 auto' }}>
          {/* Language Selection */}
          <div className="flex items-center justify-between mb-2">
            <div className="relative w-full">
              <select
                value={fromLanguage}
                onChange={(e) => setFromLanguage(e.target.value)}
                className="bg-purple-50 text-purple-700 px-3 pl-8 py-2 rounded-lg border-none outline-none font-medium shadow-sm focus:ring-2 focus:ring-purple-200 appearance-none w-full"
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
              <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">▼</span>
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
                className="bg-blue-50 text-blue-700 px-3 pl-8 py-2 rounded-lg border-none outline-none font-medium shadow-sm focus:ring-2 focus:ring-blue-200 appearance-none w-full"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <span className="pointer-events-none absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">{languageFlags[toLanguage] || "🌐"}</span>
              <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">▼</span>
            </div>
          </div>

          {/* Input Area */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full p-4 border-2 border-purple-100 rounded-xl resize-none h-24 outline-none focus:border-purple-300 transition-colors shadow-sm bg-purple-50 text-gray-800"
            />
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors shadow ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
              }`}
              aria-label="Record"
            >
              🎤
            </button>
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-purple-100" />

          {/* Translation Result Card with animation and close button */}
          {showTranslationResult && translatedText && typeof translatedText === 'object' && !translatedText.error && (
            <div
              className="relative bg-gradient-to-r from-blue-50 to-purple-100 rounded-xl p-6 shadow-xl border border-blue-100 flex flex-col gap-2 transition-all duration-500 animate-fade-in"
              style={{ minHeight: '80px' }}
            >
              {/* If you do not have animate-fade-in, add it to your global CSS: 
              @keyframes fade-in { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none; } }
              .animate-fade-in { animation: fade-in 0.5s ease; }
              */}
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-red-400 text-lg font-bold rounded-full p-1 transition-colors z-10"
                onClick={() => setShowTranslationResult(false)}
                aria-label="Close translation result"
              >
                ×
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌍</span>
                <span className="text-lg font-bold text-blue-800">{translatedText.translation}</span>
                {translatedText.part_of_speech && (
                  <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">{translatedText.part_of_speech}</span>
                )}
              </div>
              {translatedText.pronunciation && (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <span className="text-base">🔊</span>
                  <span>Pronunciation: <span className="font-medium">{translatedText.pronunciation}</span></span>
                </div>
              )}
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-600">
                {translatedText.detected_language && (
                  <span className="flex items-center gap-1"><span className="text-gray-400">🌐</span>Detected: {translatedText.detected_language}</span>
                )}
                {translatedText.literal_translation && (
                  <span className="flex items-center gap-1"><span className="text-gray-400">💬</span>Literal: {translatedText.literal_translation}</span>
                )}
              </div>
              {translatedText.grammar_notes && (
                <div className="mt-2 text-purple-700 text-xs flex items-center gap-2"><span>📝</span><span>{translatedText.grammar_notes}</span></div>
              )}
              {translatedText.example_usage && (
                <div className="mt-2 text-blue-700 text-xs italic flex items-center gap-2"><span>📖</span><span>{translatedText.example_usage}</span></div>
              )}
              {translatedText.synonyms && Array.isArray(translatedText.synonyms) && translatedText.synonyms.length > 0 && (
                <div className="mt-2 text-blue-500 text-xs flex items-center gap-2"><span>🔗</span><span>Synonyms: {translatedText.synonyms.join(", ")}</span></div>
              )}
            </div>
          )}
          {translatedText && translatedText.error && (
            <div className="p-4 bg-red-100 rounded-xl text-red-700">{translatedText.error}</div>
          )}

          <button
            onClick={handleTranslate}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Translate
          </button>
        </div>

        {/* Translation History - always visible, scrollable */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 flex flex-col min-h-0 mt-4 max-h-[400px] overflow-y-auto hide-scrollbar">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
      </div>
    </div>
  );

  const renderChatList = () => (
    <div className="flex-1 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto min-h-0">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Chats</h2>
        <div className="space-y-3">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="text-3xl mr-4">{chat.avatar}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-800">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChatView = () => {
    if (!selectedChat) return renderChatList();

    return (
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Header */}
        <div className="bg-white shadow-sm p-4 flex items-center">
          <button
            onClick={() => setSelectedChat(null)}
            className="mr-3 text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
          >
            ←
          </button>
          <div className="text-2xl mr-3">{selectedChat.avatar}</div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800">{selectedChat.name}</h2>
          </div>
          <div className="flex space-x-2">
            <button className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors">
              📹
            </button>
            <button className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors">
              ⋮
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-50 hide-scrollbar min-h-0">
          {selectedChat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md ${
                  message.sender === "me" ? "order-2" : "order-1"
                }`}
              >
                {message.sender === "them" && (
                  <div className="text-xs text-orange-600 font-medium mb-1">
                    {selectedChat.name}
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl ${
                    message.sender === "me"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.originalLanguage && (
                    <div className="text-xs text-gray-500 mt-1 italic">
                      (translated from {message.originalLanguage} phrases)
                    </div>
                  )}
                </div>

                {/* Translation buttons for received messages */}
                {message.sender === "them" && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleTranslateMessage(message.id, message.text, message.originalLanguage)}
                      className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      see original translation
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                      auto-translate
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors">
                      add phrases
                    </button>
                  </div>
                )}

                {/* Show translation if available */}
                {typeof translatedMessages[message.id] === 'object' && translatedMessages[message.id] && !translatedMessages[message.id].error ? (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg text-sm text-purple-800 space-y-1">
                    <div className="font-semibold">{translatedMessages[message.id].translation}</div>
                    {translatedMessages[message.id].pronunciation && (
                      <div className="text-xs">Pronunciation: {translatedMessages[message.id].pronunciation}</div>
                    )}
                    {translatedMessages[message.id].detected_language && (
                      <div className="text-xs text-gray-500">Detected Language: {translatedMessages[message.id].detected_language}</div>
                    )}
                    {translatedMessages[message.id].literal_translation && (
                      <div className="text-xs text-gray-700">Literal: {translatedMessages[message.id].literal_translation}</div>
                    )}
                  </div>
                ) : translatedMessages[message.id] && translatedMessages[message.id].error ? (
                  <div className="mt-2 p-2 bg-red-100 rounded-lg text-xs text-red-700">{translatedMessages[message.id].error}</div>
                ) : null}

                <div className="text-xs text-gray-500 mt-1 text-right">
                  {message.timestamp}
                </div>
              </div>

              {message.sender === "me" && (
                <div className="text-2xl ml-2 order-3">
                  {selectedChat.avatar}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button className="text-gray-500 hover:text-purple-600 transition-colors">
              😊
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="w-full p-3 border border-gray-200 rounded-full outline-none focus:border-purple-300 transition-colors"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors">
                📎
              </button>
            </div>
            <button className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
              🎤
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderChatPage = () => renderChatView();

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

  const renderCollectionsPage = () => renderCollectionView();

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
        {currentPage === "home" && renderHomePage()}
        {currentPage === "chat" && renderChatPage()}
        {currentPage === "collections" && renderCollectionsPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2 fixed bottom-0 left-0 w-full z-50">
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