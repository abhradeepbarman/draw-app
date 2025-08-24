"use client"
import { useState } from 'react';
import { ChevronDown, Users, Zap, Infinity, RotateCcw, Save, Palette, Check, X } from 'lucide-react';

export default function Index() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index: any) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-cyan-400" />,
      title: "Real-time Sync",
      description: "Collaborate instantly with your team. See changes as they happen in real-time."
    },
    {
      icon: <Palette className="w-8 h-8 text-purple-400" />,
      title: "Multiple Tools",
      description: "Pens, brushes, shapes, text, and more. Everything you need to bring ideas to life."
    },
    {
      icon: <Infinity className="w-8 h-8 text-emerald-400" />,
      title: "Infinite Canvas",
      description: "Never run out of space. Zoom and pan across an unlimited drawing surface."
    },
    {
      icon: <RotateCcw className="w-8 h-8 text-orange-400" />,
      title: "Undo & Redo",
      description: "Experiment fearlessly with powerful undo/redo functionality."
    },
    {
      icon: <Save className="w-8 h-8 text-rose-400" />,
      title: "Auto-save",
      description: "Your work is automatically saved. Never lose your creative progress again."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-400" />,
      title: "Team Collaboration",
      description: "Invite unlimited collaborators and work together seamlessly."
    }
  ];

  const faqs = [
    {
      question: "How does real-time collaboration work?",
      answer: "Drawlio uses WebSocket technology to sync changes instantly across all connected devices. You'll see your teammates' cursors and changes in real-time."
    },
    {
      question: "Can I use Drawlio offline?",
      answer: "Yes! Drawlio works offline and automatically syncs your changes when you're back online. Your work is never lost."
    },
    {
      question: "What file formats can I export to?",
      answer: "You can export your drawings as PNG, JPG, SVG, or PDF. Pro users also get access to PSD and AI format exports."
    },
    {
      question: "Is there a limit to canvas size?",
      answer: "No limits! Our infinite canvas grows as you draw. Zoom out to see the big picture or zoom in for detailed work."
    },
    {
      question: "How secure is my data?",
      answer: "All data is encrypted in transit and at rest. We use enterprise-grade security and never share your drawings with third parties."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg mr-3"></div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Drawlio
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-300 hover:text-cyan-400 transition-colors">FAQ</a>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-300 hover:text-cyan-400 transition-colors">Sign In</button>
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-200">
                Try Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight">
              Draw. Collaborate.<br />Create Together.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most intuitive collaborative whiteboard for teams who think visually. 
              Real-time drawing, infinite canvas, and seamless collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-200">
                Start Drawing Free
              </button>
              <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                Watch Demo
              </button>
            </div>
            
            {/* Demo Image Placeholder */}
            <div className="relative max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden border border-gray-700">
                <div className="bg-gray-800 h-12 flex items-center justify-between px-6 border-b border-gray-700">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-400">Drawlio Workspace</div>
                  <div></div>
                </div>
                <div className="h-96 bg-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
                    <svg className="w-full h-full" viewBox="0 0 800 400">
                      {/* Drawing elements simulation - glowing effect */}
                      <defs>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                          <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <path d="M50 200 Q 150 100 250 200 T 450 200" stroke="#06B6D4" strokeWidth="4" fill="none" className="animate-pulse" filter="url(#glow)" />
                      <circle cx="550" cy="150" r="40" fill="#A855F7" opacity="0.8" filter="url(#glow)" />
                      <rect x="600" y="100" width="80" height="60" fill="#EC4899" opacity="0.7" rx="8" filter="url(#glow)" />
                      <path d="M100 300 L 200 250 L 180 320 Z" fill="#10B981" opacity="0.8" filter="url(#glow)" />
                    </svg>
                    {/* Cursor indicators with glow */}
                    <div className="absolute top-20 left-32 w-4 h-4 bg-cyan-400 rounded-full animate-bounce shadow-lg shadow-cyan-400/50"></div>
                    <div className="absolute top-32 right-40 w-4 h-4 bg-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need to create
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful features designed for seamless collaboration and limitless creativity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that works best for you and your team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-colors">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-5xl font-bold text-white mb-2">$0</div>
                <p className="text-gray-400">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">Up to 3 collaborators</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">5 drawings limit</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">Basic drawing tools</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-400 mr-3" />
                  <span className="text-gray-300">PNG/JPG export</span>
                </li>
                <li className="flex items-center">
                  <X className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-gray-600">Version history</span>
                </li>
              </ul>
              
              <button className="w-full border-2 border-gray-600 text-gray-300 py-3 rounded-full font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-cyan-500/20">
              <div className="absolute top-4 right-4 bg-white text-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-5xl font-bold mb-2">$12</div>
                <p className="text-cyan-100">per user / month</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-300 mr-3" />
                  <span>Unlimited collaborators</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-300 mr-3" />
                  <span>Unlimited drawings</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-300 mr-3" />
                  <span>Advanced tools & brushes</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-300 mr-3" />
                  <span>All export formats</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-300 mr-3" />
                  <span>Version history</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-emerald-300 mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <button className="w-full bg-white text-purple-600 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                Start Pro Trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently asked questions
            </h2>
            <p className="text-xl text-gray-300">
              Everything you need to know about Drawlio.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl shadow-sm border border-gray-700 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-800 transition-colors"
                >
                  <span className="text-lg font-semibold text-white">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg mr-3"></div>
                <span className="text-2xl font-bold">Drawlio</span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                The collaborative whiteboard that brings your team's ideas to life. 
                Create, collaborate, and innovate together.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Updates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Drawlio. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}