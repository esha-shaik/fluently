import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { sendChatMessage, translateText } from "../utilities/api";

// New helper to get both reply and translation in one Gemini call
async function getReplyAndTranslation({ message, chatLanguage, userName }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`;
  const prompt = `You are roleplaying as a friendly, engaging chat partner named ${userName}. Your persona: you are a witty, curious, and supportive friend who loves learning about the world and helping others practice languages. Reply to the following message in a natural, conversational way, in ${chatLanguage}. Make your reply short and concise (1-2 sentences), but still interesting. Ask a follow-up question and keep the conversation going.\n\nIMPORTANT: RETURN ONLY A JSON OBJECT WITH ALL OF THE FOLLOWING FIELDS, EVEN IF SOME ARE NULL OR EMPTY. DO NOT OMIT ANY FIELD. DO NOT ADD EXTRA TEXT OR EXPLANATION. IF YOU DON'T KNOW A VALUE, RETURN null OR AN EMPTY STRING, BUT ALWAYS INCLUDE EVERY FIELD.\n\nEXAMPLE OUTPUT:\n{\n  "reply": "...",\n  "translation": "...",\n  "tone_of_speech": "...",\n  "part_of_speech": "...",\n  "pronunciation": "...",\n  "detected_language": "...",\n  "example_usage": "...",\n  "synonyms": ["...", "..."],\n  "cultural_notes": "..."\n}\n\nFIELDS TO RETURN:\n- reply: your reply in ${chatLanguage}\n- translation: your reply translated to English\n- tone_of_speech: the tone of your reply (e.g. friendly, formal, playful, etc.)\n- part_of_speech: the part of speech of the main word/phrase, or null\n- pronunciation: the pronunciation in Latin script (if applicable)\n- detected_language: the detected source language (if auto-detect is used, otherwise repeat the source language)\n- example_usage: a short, natural example sentence using the translation, or null\n- synonyms: a list of up to 2 common synonyms for the translation, or null\n- cultural_notes: any cultural meanings, differences, or useful context for the translation (if any, otherwise null)\nMessage: ${message}`;
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Gemini raw response:', raw); // <-- LOG RAW RESPONSE
    try {
      const jsonStart = raw.indexOf('{');
      const jsonEnd = raw.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = raw.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonString);
        console.log('Gemini parsed details:', parsed); // <-- LOG PARSED DETAILS
        return parsed;
      }
      return { reply: raw, translation: '' };
    } catch (e) {
      return { reply: raw, translation: '' };
    }
  } catch (err) {
    return { reply: '[Error getting response]', translation: '' };
  }
}

function ChatPage({
  conversations,
  selectedChat,
  setSelectedChat,
  newMessage,
  setNewMessage,
  handleTranslateMessage,
  collections,
  setShowSaveModal,
  setMessageToSave,
}) {
  const [chatMessages, setChatMessages] = useState(selectedChat ? selectedChat.messages : []);
  const [chatLanguage, setChatLanguage] = useState("Spanish");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  // Remove showOriginal state and button logic for toggling translation
  const [typing, setTyping] = useState(false);
  // Remove per-message translation language dropdown and related state/logic
  // At the top, remove messageLangs state
  // Remove translateToLanguage and showLangPicker from the top-level state
  const [showLangPicker, setShowLangPicker] = useState(false);
  const avatarRef = useRef(null);
  const langPickerRef = useRef(null);
  // At the top, add state for toggling translation view per message
  const [showTranslation, setShowTranslation] = useState({});
  // At the top, add state for tracking translation fetching per message
  const [fetchingTranslation, setFetchingTranslation] = useState({});
  const messagesEndRef = useRef(null);
  // At the top, add state for managing conversations if not already present
  const [allConversations, setAllConversations] = useState(conversations || []);
  // At the top, add state for showing translation details for a message
  const [showDetailsForMessageId, setShowDetailsForMessageId] = useState(null);
  const chatListRef = useRef(null);

  React.useEffect(() => {
    if (selectedChat) {
      setChatMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  // Remove the problematic auto-translate useEffect that was causing infinite loops
  // The translation will be handled when messages are actually received

  // Ensure every 'them' message has an English translation ready (but only if not already present)
  useEffect(() => {
    const messagesNeedingTranslation = chatMessages.filter(msg => 
      msg.sender === 'them' &&
      !msg.translation &&
      (!msg.translationDetails || !msg.translationDetails.English || !msg.translationDetails.English.translation)
    );

    if (messagesNeedingTranslation.length > 0) {
      messagesNeedingTranslation.forEach(msg => {
        translateText({ inputText: msg.text, fromLanguage: 'auto', toLanguage: 'English' }).then(result => {
          setChatMessages(prev => prev.map(m =>
            m.id === msg.id ? { ...m, translation: result.translation || '', translationDetails: { ...m.translationDetails, English: { translation: result.translation || '' } } } : m
          ));
        }).catch(err => {
          console.error('Translation error:', err);
        });
      });
    }
  }, [chatMessages.length]); // Only run when message count changes, not on every message change

  // Modified handleTranslateMessage to support auto flag
  const handleAutoTranslateMessage = async (messageId, messageText, fromLang, auto = false) => {
    // Always translate to English for auto-translation
    const result = await translateText({ inputText: messageText, fromLanguage: 'auto', toLanguage: 'English' });
    setChatMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, translation: result.translation || result.error || '', translationDetails: { ...m.translationDetails, English: { translation: result.translation || '' } } } : m
    ));
  };

  // Close emoji picker on click outside
  React.useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClick(e) {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target) &&
        !e.target.closest("#emoji-picker-popup") &&
        !e.target.closest("#emoji-btn")
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEmojiPicker]);

  useEffect(() => {
    if (!showLangPicker) return;
    function handleClick(e) {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(e.target) &&
        langPickerRef.current &&
        !langPickerRef.current.contains(e.target)
      ) {
        setShowLangPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showLangPicker]);

  // Update handleSendMessage to also update the selected conversation in allConversations
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || sending) return;
    setShowEmojiPicker(false);
    const userMsg = {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setAllConversations(prev => prev.map(conv =>
      conv.id === selectedChat.id
        ? { ...conv, messages: [...conv.messages, userMsg], lastMessage: userMsg.text, time: userMsg.timestamp }
        : conv
    ));
    setNewMessage("");
    setSending(true);
    // Typing indicator delay (natural start)
    const delay = 500 + Math.floor(Math.random() * 700); // 500-1200ms
    setTimeout(() => setTyping(true), delay);
    // Wait for the delay, then fetch the bot reply
    setTimeout(async () => {
      try {
        // Get both reply and translation in one call
        const geminiDetails = await getReplyAndTranslation({ message: userMsg.text, chatLanguage, userName: selectedChat.name });
        console.log('Gemini details used in chat:', geminiDetails); // <-- LOG DETAILS USED
        const { reply, ...details } = geminiDetails;
        const botMsg = {
          id: Date.now() + 1,
          text: reply,
          sender: "them",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          translation: details.translation || '',
          translationDetails: details, // <-- Store all details here
        };
        setChatMessages((prev) => [...prev, botMsg]);
        setAllConversations(prev => prev.map(conv =>
          conv.id === selectedChat.id
            ? { ...conv, messages: [...conv.messages, botMsg], lastMessage: botMsg.text, time: botMsg.timestamp }
            : conv
        ));
      } catch (error) {
        console.error('Error getting bot reply:', error);
        // Add error message to chat
        const errorMsg = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble responding right now. Please try again.",
          sender: "them",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          translation: "Sorry, I'm having trouble responding right now. Please try again.",
          translationDetails: { translation: "Sorry, I'm having trouble responding right now. Please try again." },
        };
        setChatMessages((prev) => [...prev, errorMsg]);
      } finally {
        setTyping(false); // Only turn off typing when the message is ready
        setSending(false);
      }
    }, delay);
  }, [newMessage, sending, selectedChat, chatLanguage]);

  const handleEmojiClick = (emoji) => {
    // Insert emoji at cursor position
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = newMessage.slice(0, start);
    const after = newMessage.slice(end);
    setNewMessage(before + emoji + after);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    }, 0);
    setShowEmojiPicker(false);
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

  const emojiList = [
    "😀", "😂", "😍", "🥳", "😎", "😭", "👍", "🙏", "🎉", "🔥", "❤️", "😅", "🤔", "😇", "🥰"
  ];

  // Update renderChatList to use allConversations and add a 'New Conversation' button
  const renderChatList = () => (
    <div ref={chatListRef} className="flex-1 flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-lg p-3 sm:p-8 w-full max-w-screen-xl px-2 sm:px-8 mx-auto my-3 sm:my-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Chats</h2>
          <button
            className="group relative flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-2 sm:px-5 sm:py-2.5 rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold hover:from-indigo-700 hover:to-purple-700 hover:shadow-2xl hover:scale-105"
            onClick={() => {
              const name = prompt('Enter a name for the new conversation:');
              if (name && name.trim()) {
                setAllConversations(prev => [
                  {
                    id: Date.now(),
                    name: name.trim(),
                    avatar: '',
                    lastMessage: '',
                    time: '',
                    messages: [],
                  },
                  ...prev,
                ]);
              }
            }}
          >
            <span className="text-lg sm:text-xl group-hover:rotate-90 transition-transform duration-300">＋</span> <span className="inline sm:hidden">New</span><span className="hidden sm:inline">New Conversation</span>
          </button>
        </div>
        <div className="divide-y divide-blue-100">
          {allConversations.map((chat, idx) => (
            <div
              key={chat.id}
              className="flex items-center p-2 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl cursor-pointer hover:shadow-xl hover:bg-blue-100 transition-all border border-blue-100 gap-2 sm:gap-6 group relative my-2 sm:my-4"
              style={{ minHeight: 56, minHeight: 'auto', ...(window.innerWidth >= 640 ? { minHeight: 80 } : {}) }}
              onClick={e => {
                if (e.target.closest('.delete-chat-btn')) return;
                setSelectedChat(chat);
              }}
            >
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${chat.name}`}
                alt="avatar"
                className="w-10 h-10 sm:w-20 sm:h-20 rounded-full border-2 border-blue-200 shadow group-hover:border-blue-400 transition-all flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800 truncate max-w-[160px] sm:max-w-none">{chat.name}</h3>
                  <div className="flex items-center gap-1 sm:gap-4">
                    <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">{chat.time}</span>
                    <button
                      className="delete-chat-btn text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors ml-1"
                      title="Delete conversation"
                      onClick={e => {
                        e.stopPropagation();
                        setAllConversations(prev => prev.filter(c => c.id !== chat.id));
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {chat.lastMessage || <span className="italic text-gray-400">No messages yet</span>}
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
        {/* Improved Sticky Chat Header */}
        <div className="sticky top-0 z-20 bg-white/95 shadow-md px-4 py-3 flex items-center border-b border-blue-100 w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl md:mx-auto rounded-b-2xl backdrop-blur-md">
          <button
            onClick={() => setSelectedChat(null)}
            className="mr-3 text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
          >
            ←
          </button>
          {/* Improved clickable avatar with popover for language selection */}
          <div className="relative group flex items-center justify-center mr-4">
            <img
              src={`https://api.dicebear.com/7.x/personas/svg?seed=${selectedChat.name}`}
              alt="avatar"
              className="w-16 h-16 rounded-full border-4 border-blue-200 shadow-md transition-transform duration-200 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-lg cursor-pointer bg-white"
              style={{ boxShadow: '0 4px 16px 0 rgba(80, 120, 255, 0.10)' }}
              onClick={() => setShowLangPicker((v) => !v)}
              ref={avatarRef}
            />
            {/* Language picker popover */}
            {showLangPicker && (
              <div ref={langPickerRef} className="absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 bg-white border border-blue-200 rounded-xl shadow-lg p-2 min-w-[180px]">
                <div className="font-semibold text-blue-700 mb-2 text-sm">User replies in:</div>
                <ul className="max-h-60 overflow-y-auto">
                  {languages.map((lang) => (
                    <li key={lang}>
                      <button
                        className={`w-full text-left px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors ${chatLanguage === lang ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-700'}`}
                        onClick={() => {
                          setChatLanguage(lang);
                          setShowLangPicker(false);
                        }}
                      >
                        {lang}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg md:text-xl text-gray-800 truncate">{selectedChat.name}</h2>
              {/* In the chat header, update 'Active now' to only show the green dot on mobile */}
              <span className="flex items-center gap-1 text-green-600 text-xs font-medium ml-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="hidden sm:inline">Active now</span>
              </span>
            </div>
          </div>
        </div>

        {/* Messages - scrollable, fills available space, with bottom padding for input/nav */}
        <div className={`flex-1 flex flex-col px-1 md:px-8 py-4 space-y-2 md:space-y-[35px] overflow-y-auto max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full ${chatMessages.length > 0 ? 'pb-20' : ''}`} style={{scrollBehavior:'smooth'}}>
          {/* Show filler content when no messages */}
          {chatMessages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] space-y-6 py-12 mt-18 md:mt-20">
              {/* Simple welcome message */}
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">Start a conversation with {selectedChat.name}</h3>
                
              </div>

              {/* Simple tips */}
              <div className="max-w-md bg-blue-50 border border-blue-200 rounded-xl p-5 ">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Quick tips:</h4>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• The AI is using <strong>{chatLanguage}</strong> to respond</li>
                  <li>• Use the translate button to understand new words</li>
                  <li>• Ask questions to keep the conversation going</li>
                </ul>
              </div>
            </div>
          ) : (
            // Use memoized messages instead of inline mapping
            renderedMessages
          )}
          <div ref={messagesEndRef} />
          {/* Typing indicator for bot reply */}
          {typing && chatMessages.length > 0 && chatMessages[chatMessages.length - 1].sender === "me" && (
            <div className="flex items-center gap-2 mt-1 animate-pulse">
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${selectedChat.name}`}
                alt="avatar"
                className="w-7 h-7 rounded-full border border-gray-200 shadow-sm"
              />
              <div className="bg-white border border-blue-100 rounded-2xl px-4 py-2 text-sm text-gray-500">{selectedChat.name || 'Typing'} is typing...</div>
            </div>
          )}
        </div>

        {/* Message Input Bar - fixed at bottom, always visible above nav */}
        <div className="fixed bottom-16 left-0 w-full flex justify-center z-40 pointer-events-none mb-4 sm:mb-10 px-3 sm:px-6">
          <div className="w-full max-w-md md:max-w-4xl lg:max-w-5xl xl:max-w-6xl flex-shrink-0 px-1 md:px-8 pb-2 pointer-events-auto mx-auto">
            <div className="flex items-end space-x-3 bg-white border border-blue-100 rounded-2xl shadow-lg p-2">
              {/* Emoji Button */}
              <div className="relative flex items-center justify-center min-h-[44px]">
                <button
                  id="emoji-btn"
                  className="text-gray-500 hover:text-purple-600 transition-colors text-2xl flex items-center justify-center"
                  style={{ minWidth: 40, minHeight: 40 }}
                  onClick={() => setShowEmojiPicker((v) => !v)}
                  type="button"
                  tabIndex={-1}
                >
                  😊
                </button>
                {showEmojiPicker && (
                  <div
                    id="emoji-picker-popup"
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white border border-blue-200 rounded-xl shadow-lg p-2 grid grid-cols-6 gap-2 z-50 min-w-[220px] min-h-[60px] whitespace-nowrap"
                  >
                    {emojiList.map((emoji) => (
                      <button
                        key={emoji}
                        className="text-2xl p-1 hover:bg-blue-50 rounded-lg transition-colors"
                        onClick={() => handleEmojiClick(emoji)}
                        type="button"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex-1 relative flex items-center">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={window.innerWidth < 640 ? "Message..." : "Write a message..."}
                  className="w-full min-h-[44px] max-h-32 p-3 border border-gray-200 rounded-full outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-blue-50 resize-none pr-12"
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  disabled={sending}
                  autoFocus
                  rows={1}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors text-xl">
                  📎
                </button>
              </div>
              <button
                className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-60 shadow-lg text-xl flex items-center justify-center"
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                aria-label="Send"
                type="button"
              >
                {sending ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : (
                  <span>➤</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Auto-scroll to bottom when chatMessages changes
  useEffect(() => {
    if (selectedChat && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, typing, selectedChat]);

  // When selecting a chat, set chatMessages to the messages of the selected conversation from allConversations
  React.useEffect(() => {
    if (selectedChat) {
      const found = allConversations.find(c => c.id === selectedChat.id);
      setChatMessages(found ? found.messages : []);
    }
  }, [selectedChat, allConversations]);

  // On mount, load allConversations from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('fluently_conversations');
    if (saved) {
      try {
        setAllConversations(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading conversations from localStorage:', error);
        setAllConversations([]);
      }
    }
    // eslint-disable-next-line
  }, []);

  // Save allConversations to localStorage with debouncing to prevent excessive writes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('fluently_conversations', JSON.stringify(allConversations));
      } catch (error) {
        console.error('Error saving conversations to localStorage:', error);
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [allConversations]);

  // Scroll to top when chat list page is shown
  useEffect(() => {
    if (!selectedChat) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedChat]);

  // Memoize the messages rendering to prevent unnecessary re-renders
  const renderedMessages = useMemo(() => {
    if (!selectedChat) return null; // Guard: don't render messages if no chat is selected
    return chatMessages.map((message, idx) => {
      const isMe = message.sender === "me";
      const isSender = !isMe;
      const isTranslationShown = !!showTranslation[message.id];
      const translationObj = message.translationDetails || {};
      const isFetching = !!fetchingTranslation[message.id];
      const shouldShowTranslation = isSender && !!translationObj && !!translationObj.translation;
      const details = translationObj || {};
      
      return (
        <div
          key={message.id}
          className={`flex flex-col items-end ${isMe ? "justify-end" : "justify-start"} w-full animate-fade-in`}
        >
          <div className={`flex items-start ${isMe ? "justify-end" : "justify-start"} w-full`}>
            {!isMe && (
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${selectedChat.name}`}
                alt="avatar"
                className="w-9 h-9 rounded-full mr-2 border border-gray-200 shadow-sm"
                loading="lazy"
              />
            )}
            <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
              <div
                className={`relative px-4 py-2 rounded-2xl shadow transition-all duration-200 text-base break-words ${
                  isMe
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-white text-gray-900 border border-blue-100 rounded-bl-md"
                }`}
                title={message.timestamp}
              >
                {/* Show original by default, translation only if toggled */}
                {isSender && shouldShowTranslation && isTranslationShown
                  ? translationObj.translation
                  : message.text}
                {/* Bubble tail */}
                <span
                  className={`absolute bottom-0 ${isMe ? "right-0" : "left-0"} w-3 h-3 ${isMe ? "bg-blue-500" : "bg-white border-blue-100 border-b border-l"} rounded-bl-2xl rounded-br-2xl transform translate-y-1/2 ${isMe ? "-mr-1" : "-ml-1"}`}
                  style={{ zIndex: 0 }}
                ></span>
              </div>
              {/* Message actions - for both user and bot messages */}
              <div className="flex gap-1.5 mt-2 px-1 justify-end">
                {isSender && (
                  <>
                    <button
                      className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow-sm transition-all duration-200 flex items-center gap-1.5 disabled:opacity-60 font-medium"
                      disabled={isFetching}
                      onClick={async () => {
                        if (!translationObj) {
                          setFetchingTranslation(prev => ({ ...prev, [message.id]: true }));
                          const result = await translateText({
                            inputText: message.text,
                            fromLanguage: 'auto',
                            toLanguage: 'English',
                          });
                          setChatMessages(prev => prev.map(m =>
                            m.id === message.id ? { ...m, translation: result.translation || '', translationDetails: { ...m.translationDetails, English: { translation: result.translation || '' } } } : m
                          ));
                          setShowTranslation(prev => ({ ...prev, [message.id]: true }));
                          setFetchingTranslation(prev => ({ ...prev, [message.id]: false }));
                        } else {
                          setShowTranslation(prev => ({ ...prev, [message.id]: !prev[message.id] }));
                        }
                      }}
                    >
                      {isFetching ? (
                        <svg className="animate-spin h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                      ) : (
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                      )}
                      {isTranslationShown ? "Original" : "Translate"}
                    </button>
                    {translationObj && Object.keys(translationObj).length > 0 && (
                      <button
                        className="text-xs bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 hover:shadow-sm transition-all duration-200 font-medium flex items-center gap-1.5"
                        onClick={() => setShowDetailsForMessageId(showDetailsForMessageId === message.id ? null : message.id)}
                      >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {showDetailsForMessageId === message.id ? 'Hide' : 'Details'}
                      </button>
                    )}
                    <button
                      className="text-xs bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg hover:from-green-100 hover:to-emerald-100 hover:border-green-300 hover:shadow-sm transition-all duration-200 font-medium flex items-center gap-1.5"
                      onClick={() => {
                        setMessageToSave({
                          text: message.text,
                          translation: message.translation,
                          originalLanguage: message.originalLanguage || chatLanguage,
                          translationDetails: message.translationDetails,
                          sender: message.sender
                        });
                        setShowSaveModal(true);
                      }}
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      Save
                    </button>
                  </>
                )}
                {!isSender && translationObj && Object.keys(translationObj).length > 0 && (
                  <button
                    className="text-xs bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg hover:from-purple-100 hover:to-pink-100 hover:border-purple-300 hover:shadow-sm transition-all duration-200 font-medium flex items-center gap-1.5"
                    onClick={() => setShowDetailsForMessageId(showDetailsForMessageId === message.id ? null : message.id)}
                  >
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {showDetailsForMessageId === message.id ? 'Hide' : 'Details'}
                  </button>
                )}
              </div>
            </div>
            {/* Timestamp positioned outside on the right, aligned with message bubble */}
            <div className={`ml-2 text-[10px] text-gray-500 opacity-70 ${isMe ? 'order-first mr-2' : ''}`} style={{ marginTop: '14px' }}>
              {message.timestamp}
            </div>
            {isMe && (
              <img
                src="https://api.dicebear.com/7.x/personas/svg?seed=me"
                alt="me"
                className="w-9 h-9 rounded-full ml-2 border border-gray-200 shadow-sm"
                loading="lazy"
              />
            )}
          </div>
          {/* Translation details panel - improved UI */}
          {translationObj && Object.keys(translationObj).length > 0 && showDetailsForMessageId === message.id && (
            <div className="mt-3 p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 border border-blue-200 rounded-2xl shadow-lg max-w-md relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="space-y-3">
                {translationObj.tone_of_speech && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">🎭</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Tone</div>
                      <div className="text-sm text-gray-800 font-medium">{translationObj.tone_of_speech}</div>
                    </div>
                  </div>
                )}
                {translationObj.cultural_notes && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">🌍</span>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Cultural Context</div>
                      <div className="text-sm text-gray-800">{translationObj.cultural_notes}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    });
  }, [chatMessages, showTranslation, fetchingTranslation, showDetailsForMessageId, selectedChat, chatLanguage, setMessageToSave, setShowSaveModal]);

  return renderChatView();
}

export default ChatPage; 