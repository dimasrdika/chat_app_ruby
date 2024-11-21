import { useState, useEffect } from "react";
import Cable from "./service/cable"; // Mengimpor service cable
import { FaPaperPlane, FaUser, FaKey } from "react-icons/fa";

const App = () => {
  const [username, setUsername] = useState(""); // Untuk nama pengguna
  const [room, setRoom] = useState(""); // Untuk room ID
  const [message, setMessage] = useState(""); // Untuk pesan chat
  const [messages, setMessages] = useState([]); // Menyimpan daftar pesan
  const [chatChannel, setChatChannel] = useState(null); // Untuk menyimpan channel

  // Bergabung dengan room
  const joinRoom = () => {
    if (username && room) {
      // Membuat channel baru dan mulai streaming dari room tertentu
      const channel = Cable.subscriptions.create(
        { channel: "ChatChannel", room },
        {
          received: (data) => {
            setMessages((prev) => [...prev, data]);
          },
          sendMessage: (data) => {
            // Gunakan perform untuk mengirim pesan ke server
            channel.perform("send_message", data); // Pastikan ini channel.perform
          },
        }
      );
      setChatChannel(channel); // Menyimpan channel yang dibuat ke state
    }
  };

  // Mengirim pesan
  const sendMessage = () => {
    if (chatChannel && message) {
      // Mengirim pesan ke channel
      chatChannel.sendMessage({ username, message, room });
      setMessage(""); // Reset input message
    }
  };

  // Cleanup ketika komponen unmount
  useEffect(() => {
    return () => {
      if (chatChannel) {
        chatChannel.unsubscribe();
      }
    };
  }, [chatChannel]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {!chatChannel ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-lg">
          <h3 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            Join Chat
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="flex items-center mt-2 border-b border-gray-300 py-2">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border-none text-gray-900 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Room ID
            </label>
            <div className="flex items-center mt-2 border-b border-gray-300 py-2">
              <FaKey className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Enter room ID"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full bg-transparent border-none text-gray-900 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          <button
            onClick={joinRoom}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-lg">
          {/* Header */}
          <div className="flex justify-between border-b border-gray-200 items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              General Talk
            </h3>
          </div>

          {/* Chat Messages */}
          <div className="mb-6 overflow-y-auto h-64">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-4 flex items-start space-x-2 ${
                  msg.username === username ? "justify-end" : ""
                }`}
              >
                {msg.username !== username && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm">
                      {msg.username[0].toUpperCase()}
                    </div>
                  </div>
                )}
                <div
                  className={`flex flex-col space-y-1 ${
                    msg.username === username ? "items-end" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">
                    {msg.username}
                  </span>
                  <span className="text-sm text-gray-700">{msg.message}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                {msg.username === username && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
                      {msg.username[0].toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Pesan */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none transition duration-300"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
