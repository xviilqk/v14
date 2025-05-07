"use client";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaBars, FaTimes, FaChevronDown, FaChevronUp, FaHeart, FaSignOutAlt } from "react-icons/fa";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  age_group?: string;
  profile_pic?: string;
}

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdoptOpen, setIsAdoptOpen] = useState(false);
  const [isMobileAdoptOpen, setIsMobileAdoptOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const questions = [
    {
      id: 1,
      question: "How would you describe yourself?",
      options: [
        "Calm and easygoing",
        "Social and outgoing",
        "Adventurous and active",
        "Independent and low-key"
      ]
    },
    {
      id: 2,
      question: "How do you like to spend your free time?",
      options: [
        "Relaxing at home",
        "Spending time with friends and family",
        "Exploring outdoors or traveling",
        "Working on hobbies or projects"
      ]
    },
    {
      id: 3,
      question: "What energy level do you prefer in a pet?",
      options: [
        "Low - relaxed and independent",
        "Medium - playful but calm",
        "High - active and always ready for fun"
      ]
    },
    {
      id: 4,
      question: "How affectionate do you want your pet to be?",
      options: [
        "Very cuddly - loves affection",
        "Balanced - affectionate but not clingy",
        "Independent - doesn't need constant attention"
      ]
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUserProfile(token);
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to localStorage when they change
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData: User = await response.json();
        setLoggedInUser({
          ...userData,
          profile_pic: userData.profile_pic || "/images/default-profile.png"
        });
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const isAllAnswered = Object.keys(answers).length === questions.length;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setLoggedInUser(null);
    setIsProfileDropdownOpen(false);
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
    // Redirect to results page or show matches
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed w-full top-0 bg-white shadow-md z-50">
        <div className="px-6 flex items-center justify-between h-16">
          <Link href="/" className="ml-6">
            <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-none cursor-pointer">
              <Image 
                src="/images/WhelpsLogo.png"
                alt="WHELPS Logo"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block lg:hidden text-myOrage"
          >
            <FaBars className="text-2xl" />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              {/* Adopt Now Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsAdoptOpen(!isAdoptOpen)}
                  className="flex items-center text-myOrage hover:text-blue-600 transition-colors"
                >
                  ADOPT NOW
                  {isAdoptOpen ? (
                    <FaChevronUp className="ml-1" />
                  ) : (
                    <FaChevronDown className="ml-1" />
                  )}
                </button>
                
                {/* Dropdown Menu */}
                {isAdoptOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href="/dogs" 
                      className="block px-4 py-2 text-myOrage hover:bg-gray-100"
                      onClick={() => setIsAdoptOpen(false)}
                    >
                      DOGS
                    </Link>
                    <Link 
                      href="/cats" 
                      className="block px-4 py-2 text-myOrage hover:bg-gray-100"
                      onClick={() => setIsAdoptOpen(false)}
                    >
                      CATS
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/about" className="text-myOrage hover:text-blue-600 transition-colors">
                ABOUT
              </Link>
              <Link href="/#contacts" className="text-myOrage hover:text-blue-600 transition-colors">
                CONTACTS
              </Link>
              <Link href="/appointments" className="text-myOrage hover:text-blue-600 transition-colors">
                APPOINTMENTS
              </Link>
            </div>
            
            {loggedInUser ? (
              <div className="relative ml-8" ref={profileDropdownRef}>
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-myOrage relative">
                    <Image 
                      src={loggedInUser.profile_pic || "/images/default-profile.png"} 
                      alt="Profile" 
                      width={40} 
                      height={40} 
                      className="object-cover"
                    />
                  </div>
                </button>
                
                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900">Hi, {loggedInUser.first_name}</p>
                      <p className="text-xs text-gray-500 truncate">{loggedInUser.email}</p>
                    </div>
                    <Link 
                      href="/favorites" 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FaHeart className="mr-3 text-red-500" />
                      <div>
                        <p className="font-medium">Favorite Pets</p>
                        <p className="text-xs text-gray-500">
                          {favorites.length} {favorites.length === 1 ? 'pet' : 'pets'} saved
                        </p>
                      </div>
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FaSignOutAlt className="mr-3 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-myOrage text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors ml-8">
                  LOGIN
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar with Adopt Now dropdown */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMenuOpen(false)}>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="block lg:hidden text-myOrage mb-6"
          >
            <FaTimes className="text-2xl" />
          </button>
          <div className="flex flex-col space-y-4">
            {/* Mobile Adopt Now Dropdown */}
            <div className="flex flex-col">
              <button 
                onClick={() => setIsMobileAdoptOpen(!isMobileAdoptOpen)}
                className="flex items-center justify-between text-myOrage hover:text-blue-600 transition-colors py-2"
              >
                <span>ADOPT NOW</span>
                {isMobileAdoptOpen ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </button>
              
              {/* Mobile Dropdown Options */}
              {isMobileAdoptOpen && (
                <div className="ml-4 mt-2 space-y-3">
                  <Link 
                    href="/dogs" 
                    className="block text-myOrage hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    DOGS
                  </Link>
                  <Link 
                    href="/cats" 
                    className="block text-myOrage hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CATS
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className="text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              ABOUT
            </Link>
            <Link href="/#contacts" className="text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              CONTACTS
            </Link>
            <Link href="/appointments" className="text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
              APPOINTMENTS
            </Link>
            {loggedInUser ? (
              <>
                <Link href="/favorites" className="text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                  FAVORITES
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-center"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="bg-myOrage text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors w-full">
                  LOGIN
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Assessment Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-myOrage mb-2">
              Find your Fur-fect Match
            </h1>
            <p className="text-myOrage">
              Answer these quick questions to help us find a pet that fits your personality!
            </p>
          </div>

          {/* All Questions */}
          <div className="space-y-8">
            {questions.map((q) => (
              <div key={q.id} className="mb-8">
                <h2 className="text-3xl font-semibold mb-4 text-myOrage text-center">
                  {q.id}. {q.question}
                </h2>
                
                <div className="grid grid-cols-1 gap-3 px-20">
                  {q.options.map((option, index) => (
                    <button
                      key={index}
                      className={`p-2 rounded-lg transition-all text-center text-[22px] ${
                        answers[q.id] === option 
                          ? 'bg-myOrage text-white font-medium' 
                          : 'bg-myPink text-myOrage hover:bg-pink-100'
                      }`}
                      onClick={() => handleAnswerSelect(q.id, option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-12">
          <Link href="/matches">
            <button
              onClick={handleSubmit}
              disabled={!isAllAnswered}
              className={`px-20 py-3 rounded-full flex items-center text-lg ${
                !isAllAnswered 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-myOrage text-white hover:bg-orange-600'
              }`}
            >
              Next
            </button>
          </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacts" className="bg-myOrage text-white py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left"> 
          <div className="flex justify-center md:justify-start">
            <div className="h-32 w-32 md:h-48 md:w-48">
              <Image 
                src="/images/Whelpswhite.png"
                alt="WHELPS Logo"
                width={192}
                height={192}
                className="object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2 text-sm md:items-start items-center"> 
            <h4 className="text-lg font-bold">Contact Us</h4>
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> Pullian, Bulacan</p>
            <p className="flex items-center gap-2"><FaEnvelope /> whelps@gmail.com</p>
            <p className="flex items-center gap-2"><FaPhone /> 0951 718 7064</p>
          </div>

          <div className="flex flex-col space-y-2 text-sm md:items-start items-center"> 
            <h4 className="text-lg font-bold">Information</h4>
            <Link href="/" className="hover:text-black">Home</Link>
            <Link href="/about" className="hover:text-black">About Us</Link>
            <Link href="/faqs" className="hover:text-black">FAQs</Link>
            <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black">Terms of Service</Link>
            <Link href="/policies" className="hover:text-black">Shelter Policies</Link>
          </div>

          <div className="flex flex-col items-center md:items-start space-y-2">
            <h4 className="text-lg font-bold text-center md:text-left">
              Your Fur-ever <span className="block">Friend is Waiting!</span>
            </h4>
            <Link href="/assessment">
            <button className="bg-white text-myOrage px-8 py-3 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition-colors">
                Start Matching
            </button>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-gray-700 pt-3 text-center mt-3">
          <p className="text-[10px] text-gray-300">© 2025 WHELPS. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}