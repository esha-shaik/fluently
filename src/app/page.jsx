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
          pronunciation: "KOH-moh seh DEY-seh ES-toh en es-pah-NYOHL",
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
      lastMessage: "",
      time: "",
      messages: [],
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      avatar: "👨",
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
          />
        )}
        {currentPage === "collections" && (
          <CollectionsPage
            collections={collections}
            selectedCollection={selectedCollection}
            setSelectedCollection={setSelectedCollection}
          />
        )}
      </div>

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