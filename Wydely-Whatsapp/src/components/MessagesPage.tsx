import { Search, MoreVertical } from "lucide-react";

export default function MessagesPage() {
  const conversations = [
    { id: 1, name: "Sarah Johnson", message: "Thanks for the update!", time: "2m ago", unread: 2, avatar: "SJ" },
    { id: 2, name: "Mike Chen", message: "Can we schedule a meeting?", time: "15m ago", unread: 0, avatar: "MC" },
    { id: 3, name: "Emily Rodriguez", message: "The project looks great!", time: "1h ago", unread: 1, avatar: "ER" },
    { id: 4, name: "Team Design", message: "New mockups uploaded", time: "3h ago", unread: 0, avatar: "TD" },
    { id: 5, name: "Alex Turner", message: "Approved the changes", time: "Yesterday", unread: 0, avatar: "AT" },
  ];

  const messages = [
    { id: 1, sender: "Sarah Johnson", content: "Hey! How's the project coming along?", time: "10:30 AM", isMine: false },
    { id: 2, sender: "You", content: "Going really well! Just finished the main components.", time: "10:32 AM", isMine: true },
    { id: 3, sender: "Sarah Johnson", content: "That's awesome! Can't wait to see it.", time: "10:33 AM", isMine: false },
    { id: 4, sender: "You", content: "I'll share the demo link in a few minutes.", time: "10:35 AM", isMine: true },
    { id: 5, sender: "Sarah Johnson", content: "Thanks for the update!", time: "10:36 AM", isMine: false },
  ];

  return (
    <div className="w-full h-full flex">
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                conv.id === 1 ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="text-gray-900 truncate">{conv.name}</p>
                    <span className="text-gray-500 ml-2">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 truncate">{conv.message}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
              SJ
            </div>
            <div>
              <p className="text-gray-900">Sarah Johnson</p>
              <p className="text-gray-500">Active now</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-md ${message.isMine ? "order-2" : "order-1"}`}>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.isMine
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p>{message.content}</p>
                </div>
                <p className={`text-gray-500 mt-1 ${message.isMine ? "text-right" : "text-left"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
