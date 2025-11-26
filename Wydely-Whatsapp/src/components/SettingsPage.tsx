import { User, Bell, Shield, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="w-full h-full overflow-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and settings</p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <h2>Profile Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white">
                  JD
                </div>
                <div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-2">
                    Change Photo
                  </button>
                  <p className="text-gray-500">JPG, PNG or GIF, max 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Bio</label>
                <textarea
                  defaultValue="Product designer and creative thinker"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2>Notification Preferences</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Email notifications</p>
                  <p className="text-gray-600">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Push notifications</p>
                  <p className="text-gray-600">Receive push notifications on your device</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-900">Weekly summary</p>
                  <p className="text-gray-600">Get a weekly summary of your activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center gap-3">
              <Palette className="w-5 h-5 text-gray-600" />
              <h2>Appearance</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Theme</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Accent Color</label>
                <div className="flex gap-3">
                  {["bg-blue-600", "bg-purple-600", "bg-green-600", "bg-orange-600", "bg-pink-600"].map((color, index) => (
                    <button
                      key={index}
                      className={`w-10 h-10 ${color} rounded-lg ${index === 0 ? "ring-2 ring-offset-2 ring-blue-600" : ""}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
            <button className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
