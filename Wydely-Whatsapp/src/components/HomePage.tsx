import { LayoutGrid, TrendingUp, Users, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-gray-600 mb-1">Total Projects</h3>
            <p className="text-gray-900">24</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-600 mb-1">Growth</h3>
            <p className="text-gray-900">+12.5%</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-600 mb-1">Team Members</h3>
            <p className="text-gray-900">42</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-600 mb-1">Active Tasks</h3>
            <p className="text-gray-900">156</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { title: "New project created", time: "2 hours ago", color: "bg-blue-500" },
                { title: "Team meeting scheduled", time: "4 hours ago", color: "bg-green-500" },
                { title: "Report submitted", time: "Yesterday", color: "bg-purple-500" },
                { title: "Task completed", time: "2 days ago", color: "bg-orange-500" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-2 h-2 ${item.color} rounded-full mt-2`}></div>
                  <div className="flex-1">
                    <p className="text-gray-900">{item.title}</p>
                    <p className="text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <LayoutGrid className="w-6 h-6 text-gray-600 mb-2" />
                <p className="text-gray-900">New Project</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="w-6 h-6 text-gray-600 mb-2" />
                <p className="text-gray-900">Add Member</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Activity className="w-6 h-6 text-gray-600 mb-2" />
                <p className="text-gray-900">View Reports</p>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <TrendingUp className="w-6 h-6 text-gray-600 mb-2" />
                <p className="text-gray-900">Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
