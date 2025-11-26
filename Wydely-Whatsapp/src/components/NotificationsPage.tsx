import { Bell, Check, X, Info, AlertCircle } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "New team member joined",
      message: "Alex Turner has joined your workspace",
      time: "5 minutes ago",
      read: false,
      icon: Info,
      color: "bg-blue-500",
    },
    {
      id: 2,
      type: "success",
      title: "Task completed",
      message: "Sarah Johnson marked 'Website Redesign' as complete",
      time: "1 hour ago",
      read: false,
      icon: Check,
      color: "bg-green-500",
    },
    {
      id: 3,
      type: "warning",
      title: "Deadline approaching",
      message: "Project 'Mobile App' is due in 2 days",
      time: "3 hours ago",
      read: true,
      icon: AlertCircle,
      color: "bg-orange-500",
    },
    {
      id: 4,
      type: "info",
      title: "Comment on your post",
      message: "Mike Chen commented on your status update",
      time: "Yesterday",
      read: true,
      icon: Info,
      color: "bg-blue-500",
    },
    {
      id: 5,
      type: "success",
      title: "Report generated",
      message: "Your monthly analytics report is ready",
      time: "2 days ago",
      read: true,
      icon: Check,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="w-full h-full overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your latest activities</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              Mark all as read
            </button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Settings
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border ${
                notification.read ? "border-gray-200" : "border-blue-200 bg-blue-50"
              } p-6 hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`${notification.color} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                  <notification.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900">{notification.title}</p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <span className="text-gray-500 mt-2 block">{notification.time}</span>
                    </div>
                    <div className="flex gap-1 ml-4">
                      {!notification.read && (
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Mark as read">
                          <Check className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Dismiss">
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-900 mb-2">No notifications</p>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
