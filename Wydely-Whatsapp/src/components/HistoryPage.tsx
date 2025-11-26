import { Clock, FileText, Edit, Trash2, Eye } from "lucide-react";

export default function HistoryPage() {
  const historyItems = [
    {
      id: 1,
      action: "Created new project",
      description: "Website Redesign 2024",
      timestamp: "2 hours ago",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: 2,
      action: "Edited document",
      description: "Product Requirements Document",
      timestamp: "4 hours ago",
      icon: Edit,
      color: "bg-green-500",
    },
    {
      id: 3,
      action: "Viewed report",
      description: "Q4 Analytics Report",
      timestamp: "Yesterday at 3:45 PM",
      icon: Eye,
      color: "bg-purple-500",
    },
    {
      id: 4,
      action: "Deleted file",
      description: "old_backup_v1.zip",
      timestamp: "Yesterday at 11:20 AM",
      icon: Trash2,
      color: "bg-red-500",
    },
    {
      id: 5,
      action: "Created new project",
      description: "Mobile App Development",
      timestamp: "2 days ago",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      id: 6,
      action: "Edited document",
      description: "Team Meeting Notes",
      timestamp: "2 days ago",
      icon: Edit,
      color: "bg-green-500",
    },
    {
      id: 7,
      action: "Viewed report",
      description: "Monthly Performance Review",
      timestamp: "3 days ago",
      icon: Eye,
      color: "bg-purple-500",
    },
    {
      id: 8,
      action: "Created new project",
      description: "Marketing Campaign 2024",
      timestamp: "4 days ago",
      icon: FileText,
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="w-full h-full overflow-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="mb-2">Activity History</h1>
          <p className="text-gray-600">Track all your recent activities and changes</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2>Recent Activity</h2>
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                <option>All Actions</option>
                <option>Created</option>
                <option>Edited</option>
                <option>Deleted</option>
                <option>Viewed</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>All time</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {historyItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center shrink-0`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-gray-900">{item.action}</p>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <span className="text-gray-500 ml-4 whitespace-nowrap">{item.timestamp}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-center">
            <button className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
