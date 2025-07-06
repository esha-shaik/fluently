"use client";
import React from "react";

function MainComponent() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [fromLanguage, setFromLanguage] = React.useState("English");
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

  const handleTranslate = () => {
    if (!inputText.trim()) return;

    // Simulate translation (you'll need to integrate with a translation API)
    const mockTranslation = `[${toLanguage} translation of: ${inputText}]`;
    setTranslatedText(mockTranslation);

    // Add to history
    const newTranslation = {
      id: Date.now(),
      original: inputText,
      translated: mockTranslation,
      from: fromLanguage,
      to: toLanguage,
      timestamp: new Date().toLocaleDateString(),
    };
    setTranslationHistory([newTranslation, ...translationHistory]);
  };

  const translateMessage = (messageId, messageText, fromLang) => {
    // Mock translation - in real app, use translation API
    const translations = {
      "Hello, how are you? 😊 (excited/happy)":
        "こんにちは、元気ですか？😊 (興奮/幸せ)",
      "I'm doing well! I just moved into my new apartment and am currently looking for a job. Are in you in town this week?":
        "元気にやっています！新しいアパートに引っ越したばかりで、現在仕事を探しています。今週は街にいますか？",
      "¡Hola! ¿Cómo estás?": "Hello! How are you?",
      "¿Quieres ir al restaurante nuevo?":
        "Do you want to go to the new restaurant?",
    };

    const translated =
      translations[messageText] ||
      `[Translated from ${fromLang}]: ${messageText}`;
    setTranslatedMessages((prev) => ({
      ...prev,
      [messageId]: translated,
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
    <div className="flex-1 p-4 space-y-6">
      {/* Translation Box */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {/* Language Selection */}
        <div className="flex items-center justify-between mb-4">
          <select
            value={fromLanguage}
            onChange={(e) => setFromLanguage(e.target.value)}
            className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg border-none outline-none font-medium"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <button
            onClick={swapLanguages}
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
          >
            ⇄
          </button>

          <select
            value={toLanguage}
            onChange={(e) => setToLanguage(e.target.value)}
            className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border-none outline-none font-medium"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full p-4 border-2 border-purple-100 rounded-xl resize-none h-24 outline-none focus:border-purple-300 transition-colors"
            />
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
                isRecording
                  ? "bg-red-500 text-white"
                  : "bg-purple-100 text-purple-600 hover:bg-purple-200"
              }`}
            >
              🎤
            </button>
          </div>

          {translatedText && (
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-blue-800">{translatedText}</p>
            </div>
          )}

          <button
            onClick={handleTranslate}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-blue-600 transition-all"
          >
            Translate
          </button>
        </div>
      </div>

      {/* Translation History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Translations
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {translationHistory.map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm text-gray-500">
                  {item.from} → {item.to}
                </span>
                <span className="text-xs text-gray-400">{item.timestamp}</span>
              </div>
              <p className="text-gray-800 font-medium">{item.original}</p>
              <p className="text-blue-600">{item.translated}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChatList = () => (
    <div className="flex-1 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
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
      <div className="flex-1 flex flex-col">
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
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gradient-to-br from-purple-50 to-blue-50">
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
                      onClick={() =>
                        translateMessage(
                          message.id,
                          message.text,
                          message.originalLanguage
                        )
                      }
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
                {translatedMessages[message.id] && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg text-sm text-purple-800">
                    {translatedMessages[message.id]}
                  </div>
                )}

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
      <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
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
      <div className="flex-1 flex flex-col bg-gray-50">
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
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col font-poppins">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Fluently
        </h1>
      </div>

      {/* Main Content */}
      {currentPage === "home" && renderHomePage()}
      {currentPage === "chat" && renderChatPage()}
      {currentPage === "collections" && renderCollectionsPage()}

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
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