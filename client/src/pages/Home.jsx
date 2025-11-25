import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Shield, Users, Wallet, Star, MapPin, 
  Clock, TrendingDown, Leaf, Award, ChevronRight,
  Search, UserCheck, Car
} from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const reviews = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Saved ₹5000 on my monthly commute! The drivers are friendly and the app is super easy to use.",
      image: "/assets/avatar1.png"
    },
    {
      name: "Rahul Patel",
      location: "Pune",
      rating: 5,
      text: "Great way to meet new people while traveling. Highly recommend for daily commuters!",
      image: "/assets/avatar2.png"
    },
    {
      name: "Anjali Desai",
      location: "Sangli",
      rating: 5,
      text: "Safe, affordable, and eco-friendly. This is the future of travel!",
      image: "/assets/avatar3.png"
    }
  ];

  const benefits = [
    {
      icon: <Wallet className="h-8 w-8" />,
      title: "Save Up to 60%",
      description: "Cut your travel costs significantly by sharing fuel expenses",
      color: "emerald",
      stat: "₹500+",
      statLabel: "Avg. Monthly Savings"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% Safe",
      description: "Verified profiles, ratings, and secure payment system",
      color: "blue",
      stat: "50K+",
      statLabel: "Verified Users"
    },
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Eco-Friendly",
      description: "Reduce carbon emissions by sharing rides",
      color: "green",
      stat: "30%",
      statLabel: "Less CO₂ Emissions"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Growing Community",
      description: "Join thousands of travelers across India",
      color: "purple",
      stat: "100K+",
      statLabel: "Active Riders"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      image: "/assets/step1.png",
      title: "Register & Verify",
      description: "Create your account and verify your identity to join our trusted community.",
      color: "emerald"
    },
    {
      step: 2,
      image: "/assets/step2.png",
      title: "Find or Offer a Ride",
      description: "Search for a ride to your destination or offer empty seats in your car.",
      color: "blue"
    },
    {
      step: 3,
      image: "/assets/step3.png",
      title: "Travel Together",
      description: "Book your seat, meet your co-travelers, and enjoy a comfortable journey.",
      color: "purple"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900">
      {/* Hero Section - Professional & Clean */}
      <section className="relative bg-white overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-8 border border-emerald-100">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
                Trusted by 100,000+ Commuters
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Smart Travel, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
                  Better Connections
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                Join India's fastest-growing carpooling community. Save money, reduce traffic, and make every journey memorable with verified professionals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/rides">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full"
                  >
                    Find a Ride
                  </Button>
                </Link>
                <Link to="/create-ride">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-10 py-4 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 rounded-full"
                  >
                    Offer a Ride
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-slate-400 grayscale opacity-70">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium">Verified Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span className="text-sm font-medium">4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Secure Travel</span>
                </div>
              </div>
            </div>

            {/* Right Image - Generated Professional Hero */}
            <div className="relative lg:h-[600px] w-full">
              <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white/50">
                <img 
                  src="/assets/hero.png" 
                  alt="Happy professionals carpooling" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs hidden md:block border border-slate-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Environmental Impact</p>
                    <p className="font-bold text-slate-900">30% Less CO₂</p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[70%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Roadmap Style */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Your Journey Roadmap</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Simple steps to get you on the road with trusted companions.</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 transform -translate-y-1/2 z-0 mx-20"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {howItWorks.map((item, index) => (
                <div key={index} className="group">
                  <div className="relative flex flex-col items-center text-center">
                    {/* Image Container */}
                    <div className="relative mb-8">
                      <div className="w-48 h-48 bg-white rounded-full shadow-lg flex items-center justify-center p-6 border-4 border-white group-hover:border-emerald-50 transition-all duration-300">
                        <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
                      </div>
                      {/* Step Number Badge */}
                      <div className="absolute -top-2 -right-2 h-10 w-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg border-4 border-slate-50">
                        {item.step}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed max-w-xs mx-auto">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Clean Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why RideShare Connect?</h2>
            <p className="text-lg text-slate-600">Designed for the modern commuter.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 border border-slate-100"
              >
                <div className={`h-14 w-14 bg-${benefit.color}-50 text-${benefit.color}-600 rounded-xl flex items-center justify-center mb-6`}>
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{benefit.description}</p>
                <div className="pt-6 border-t border-slate-50">
                  <div className={`text-2xl font-bold text-${benefit.color}-600`}>{benefit.stat}</div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wide mt-1">{benefit.statLabel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Minimalist */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Community Stories</h2>
              <p className="text-lg text-slate-600">Hear from people who share your journey.</p>
            </div>
            <div className="hidden md:flex gap-2">
              <Button className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:bg-slate-50">
                <ChevronRight className="h-5 w-5 rotate-180" />
              </Button>
              <Button className="rounded-full h-10 w-10 p-0 flex items-center justify-center bg-slate-900 text-white hover:bg-slate-800">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-slate-700 text-lg mb-8 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-slate-100">
                    <img src={review.image} alt={review.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-slate-500">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Professional Gradient */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/80"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to transform your commute?</h2>
          <p className="text-xl mb-10 text-slate-300 font-light max-w-2xl mx-auto">Join a community of forward-thinking travelers. Save money, save the planet.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 rounded-full"
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
