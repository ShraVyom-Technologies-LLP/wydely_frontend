import { HelpCircle, Search, Book, MessageCircle, Mail, ExternalLink } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new project?",
      answer: "Click on the 'New Project' button in the dashboard and follow the setup wizard to configure your project settings.",
    },
    {
      question: "Can I invite team members?",
      answer: "Yes! Go to Settings > Team and click 'Invite Member' to send invitations via email.",
    },
    {
      question: "How do I export my data?",
      answer: "Navigate to Settings > Data & Privacy > Export Data. You'll receive a download link via email once the export is complete.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for enterprise accounts.",
    },
  ];

  const resources = [
    { title: "Getting Started Guide", icon: Book, description: "Learn the basics and get up and running quickly" },
    { title: "Video Tutorials", icon: Book, description: "Watch step-by-step video guides" },
    { title: "API Documentation", icon: Book, description: "Integrate with our powerful API" },
    { title: "Community Forum", icon: MessageCircle, description: "Connect with other users and share ideas" },
  ];

  return (
    <div className="w-full h-full overflow-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="mb-2">Help Center</h1>
          <p className="text-gray-600">Find answers to common questions and get support</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-center mb-6">How can we help you?</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg shrink-0">
                  <resource.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">{resource.title}</p>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-gray-600">{resource.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-600" />
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <div key={index} className="p-6">
                <p className="text-gray-900 mb-3">{faq.question}</p>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-8 text-white">
            <MessageCircle className="w-8 h-8 mb-4" />
            <h3 className="text-white mb-2">Live Chat Support</h3>
            <p className="text-blue-100 mb-4">Get instant help from our support team</p>
            <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              Start Chat
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-8 text-white">
            <Mail className="w-8 h-8 mb-4" />
            <h3 className="text-white mb-2">Email Support</h3>
            <p className="text-purple-100 mb-4">Send us a message and we'll respond within 24 hours</p>
            <button className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
