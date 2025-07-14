import React from "react";

function ChatPage({
  conversations,
  selectedChat,
  setSelectedChat,
  newMessage,
  setNewMessage,
  translatedMessages,
  handleTranslateMessage,
}) {
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

  return renderChatView();
}

export default ChatPage; 