import React from 'react';
import { 
  Target, Heart, Users, Zap, Award, Globe, 
  TrendingUp, Shield, Leaf, Phone, Mail, MapPin 
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Community First",
      description: "Building connections between travelers and creating a supportive community",
      color: "from-red-400 to-pink-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safety & Trust",
      description: "Verified profiles and secure platform for peace of mind",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Sustainability",
      description: "Reducing carbon footprint through shared transportation",
      color: "from-green-400 to-green-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Innovation",
      description: "Leveraging technology to make carpooling simple and efficient",
      color: "from-yellow-400 to-orange-600"
    }
  ];

  const team = [
    {
      name: "Mission",
      icon: <Target className="h-12 w-12" />,
      description: "To revolutionize urban transportation by making carpooling accessible, affordable, and enjoyable for everyone.",
      color: "emerald"
    },
    {
      icon: <Globe className="h-12 w-12" />,
      name: "Vision",
      description: "A world where every journey is shared, every road is greener, and every traveler is connected.",
      color: "blue"
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      name: "Impact",
      description: "Over 100K+ rides shared, 50K+ tons of CO₂ saved, and countless friendships formed.",
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            About RideShare Connect
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to transform the way India travels - one shared ride at a time.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto mb-8"></div>
          </div>
          <div className="prose prose-lg max-w-none text-slate-600 leading-relaxed space-y-6">
            <p className="text-lg">
              RideShare Connect was born from a simple observation: thousands of people travel the same routes every day, often alone in their cars. We saw an opportunity to bring people together, reduce costs, and make a positive impact on the environment.
            </p>
            <p className="text-lg">
              What started as a small project in 2024 has grown into India's fastest-growing carpooling platform, connecting over 100,000 riders across major cities. We've facilitated over 50,000 shared rides, helping our community save millions of rupees and reduce thousands of tons of CO₂ emissions.
            </p>
            <p className="text-lg">
              But we're more than just a platform - we're a community of like-minded individuals who believe in the power of sharing, sustainability, and human connection. Every ride shared is a step towards a greener, more connected future.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Impact */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
              >
                <div className={`h-20 w-20 bg-${item.color}-100 text-${item.color}-600 rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">{item.name}</h3>
                <p className="text-slate-600 text-center leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className={`relative h-16 w-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg`}>
                  {value.icon}
                </div>
                <h3 className="relative text-xl font-bold text-slate-900 mb-3 text-center">{value.title}</h3>
                <p className="relative text-slate-600 text-center text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl opacity-90">Making a difference, one ride at a time</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold mb-2">100K+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold mb-2">50K+</div>
              <div className="text-lg opacity-90">Rides Completed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold mb-2">₹10M+</div>
              <div className="text-lg opacity-90">Money Saved</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold mb-2">50K</div>
              <div className="text-lg opacity-90">Tons CO₂ Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-xl text-slate-600">We'd love to hear from you</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-slate-600">support@rideshare.com</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
              <p className="text-slate-600">+91 1800-123-4567</p>
            </div>
            <div className="text-center p-6 bg-slate-50 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Location</h3>
              <p className="text-slate-600">Mumbai, India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
