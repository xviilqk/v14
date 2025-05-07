"use client";
import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { FaHeart, FaChevronDown, FaChevronUp, FaSignOutAlt } from "react-icons/fa";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaBars, FaTimes } from "react-icons/fa";

interface Pet {
  id: number;
  name: string;
  details: string;
  image: string;
  type: "dog" | "cat";
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  age_group?: string;
  profile_pic?: string;
}

export default function HomePage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdoptOpen, setIsAdoptOpen] = useState(false);
  const [isMobileAdoptOpen, setIsMobileAdoptOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/pets")
      .then((res) => res.json())
      .then((data: Pet[]) => {
        setPets(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pets:", err);
        setIsLoading(false);
      });

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

  const toggleFavorite = (petId: number) => {
    setFavorites((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setLoggedInUser(null);
    setIsProfileDropdownOpen(false);
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

      {/* New Hero Section */}
      <section className="pt-16 pb-16 px-4 bg-gray-50 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image Container - Left Side */}
          <div className="h-auto md:h-[500px] lg:h-[600px] overflow-hidden md:-ml-8 lg:-ml-24 transform md:translate-x-4">
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Image
                src="/images/FrontpagePet.png"
                alt="Happy pet"
                className="w-full h-auto md:w-[600px] lg:w-[700px]"
                width={900}
                height={700}
              />
            </div>
          </div>

          {/* Text Content - Right Side */}
          <div className="md:ml-8 lg:ml-32 transform md:-translate-x-4">
            {/* Right-aligned heading with paw */}
            <div className="text-right">
              <div className="flex justify-end items-baseline relative">
                {/* Paw positioned slightly lower */}
                <div className="w-11 h-11 mr-3 mb-1 transform translate-y-1 translate-x-3">
                  <Image
                    src="/images/PawPrint.png"
                    alt="Paw decoration"
                    width={46}
                    height={46}
                    className="-rotate-12"
                  />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-myOrage">
                  Find your
                </h1>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-myOrage mt-2">
                Fur-fect Match
              </h1>
            </div>

            {/* Center-aligned description and button */}
            <div className="text-center mt-8 space-y-8">
              <p className="text-xl font-semibold text-black px-4 md:px-0">
                Discover pets that match your personality
                and lifestyle.
              </p>
              <div>
                <Link href="/assessment">
                  <button className="bg-myOrage text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                    Start Matching
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 px-4 bg-myOrage relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content - Left Side */}
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white">
              WELCOME TO
              <span className="block text-white mt-2">WHELPS</span>
            </h2>
            <p className="text-2xl text-white">
              A non-profit organization that aims to create a safe and happy environment for cats & dogs.
            </p>
          </div>

          {/* Image Container - Right Side with absolute positioned paws underneath */}
          <div className="h-64 md:h-96 overflow-hidden order-first md:order-last relative">
            {/* Welcome Photo */}
            <Image
              src="/images/WelcomePhoto.png"
              alt="Our shelter animals"
              className="w-full h-full object-cover relative z-10"
              width={800}
              height={600}
            />
            
            {/* Top Paw - positioned under image */}
            <div className="absolute top-2 left-24 md:left-40 w-16 h-16 z-0">
              <Image
                src="/images/PawPrintWhite.png"
                alt="Decorative paw"
                width={64}
                height={64}
                className="rotate-[-25deg]"
              />
            </div>
            
            {/* Bottom Paw - positioned under image */}
            <div className="absolute bottom-3 right-24 md:right-40 w-16 h-16 z-0">
              <Image
                src="/images/PawPrintWhite.png"
                alt="Decorative paw"
                width={64}
                height={64}
                className="rotate-[25deg]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-5xl text-myOrage font-bold mb-12 text-center">How it Works?</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-center justify-center">
            {[
              {
                image: "/images/Matching.png",
                text: "Take the Compatibility Test",
              },
              {
                image: "/images/Matched.png",
                text: "Get Matched with a Pet",
              },
              {
                image: "/images/Profile.png",
                text: "View Pet Profile & Availability",
              },
              {
                image: "/images/Appointment.png",
                text: "Schedule a Meet-Up",
              },
            ].map((step, index) => (
              <div key={index} className="text-center p-4">
                <Image
                  src={step.image}
                  alt={step.text}
                  width={150}
                  height={150}
                  className="mx-auto mb-6"
                />
                <p className="text-myOrage font-bold text-lg">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pets Grid */}
      <section id="browse" className="py-12 px-4 relative overflow-x-hidden overflow-y-hidden bg-gray-50">
        <h3 className="text-5xl text-myOrage font-bold mb-9 text-center">Who are Waiting for You?</h3>

        {/* Left Paw */}
        <div className="absolute left-0 top-[38%] hidden lg:block" style={{
          transform: 'rotate(65deg)',
          width: '180px',
          height: '180px',
          marginLeft: '-30px'
        }}>
          <Image 
            src="/images/PawPrint.png"
            alt="Left paw"
            width={180}
            height={180}
            className="absolute inset-0"
          />
        </div>

        {/* Right Paw */}
        <div className="absolute right-0 bottom-[2%] hidden lg:block" style={{
          transform: 'rotate(-55deg)',
          width: '170px',
          height: '170px',
          marginRight: '-30px'
        }}>
          <Image 
            src="/images/PawPrint.png"
            alt="Right paw"
            width={160}
            height={160}
            className="absolute inset-0"
          />
        </div>

        <div className="relative z-10">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <>
              {/* Dogs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {pets
                  .filter((pet) => pet.type === "dog")
                  .slice(0, 3)
                  .map((pet) => (
                    <div key={pet.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg relative">
                      <Image src={pet.image} alt={pet.name} width={300} height={200} className="w-full h-64 object-cover" />
                      <div className="p-6 bg-myOrage text-white relative">
                        <h4 className="text-xl font-semibold">{pet.name}</h4>
                        <p className="text-sm">{pet.details}</p>
                        <button onClick={() => toggleFavorite(pet.id)} className="absolute top-4 right-4 text-2xl">
                          <FaHeart className={favorites.includes(pet.id) ? "text-red-500" : "text-white"} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* More Dogs Button */}
              <div className="text-center mt-6 mb-12">
                <Link href="/dogs">
                  <button className="bg-myOrage text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                    MORE
                  </button>
                </Link>
              </div>

              {/* Cats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-8">
                {pets
                  .filter((pet) => pet.type === "cat")
                  .slice(0, 3)
                  .map((pet) => (
                    <div key={pet.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg relative">
                      <Image src={pet.image} alt={pet.name} width={300} height={200} className="w-full h-64 object-cover" />
                      <div className="p-6 bg-myOrage text-white relative">
                        <h4 className="text-xl font-semibold">{pet.name}</h4>
                        <p className="text-sm">{pet.details}</p>
                        <button onClick={() => toggleFavorite(pet.id)} className="absolute top-4 right-4 text-2xl">
                          <FaHeart className={favorites.includes(pet.id) ? "text-red-500" : "text-white"} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* More Cats Button */}
              <div className="text-center mt-6">
                <Link href="/cats">
                  <button className="bg-myOrage text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-600 transition-colors">
                    MORE
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Shelter Video Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Video on the left */}
          <div className="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden shadow-2xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/shelter-tour.mp4" type="video/mp4" />
              <source src="/videos/shelter-tour.webm" type="video/webm" />
              Your browser does not support HTML5 video.
            </video>
          </div>

          {/* Text content on the right */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-3xl text-center md:text-4xl font-bold text-myOrage">
              Every pet deserves a second chance.
            </h3>
            <p className="text-xl text-center text-gray-700">
              Watch their stories.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-12 px-4 bg-myPink pb-0">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-5xl md:text-6xl font-bold text-myOrage mb-8 text-center">
            Benefits of Adopting a Pet
          </h3>
          
          <div className="w-full max-w-4xl mx-auto">
            <Image
              src="/images/Benefit.png"
              alt="Benefits of pet adoption"
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Footer Sections */}
      <footer id="contacts" className="bg-myOrage text-white py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left"> 
          {/* Logo Column */}
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

          {/* Contact Us Column */}
          <div className="flex flex-col space-y-2 text-sm md:items-start items-center"> 
            <h4 className="text-lg font-bold">Contact Us</h4>
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> Pullian, Bulacan</p>
            <p className="flex items-center gap-2"><FaEnvelope /> whelps@gmail.com</p>
            <p className="flex items-center gap-2"><FaPhone /> 0951 718 7064</p>
          </div>

          {/* Information Column */}
          <div className="flex flex-col space-y-2 text-sm md:items-start items-center"> 
            <h4 className="text-lg font-bold">Information</h4>
            <Link href="/" className="hover:text-black">Home</Link>
            <Link href="/about" className="hover:text-black">About Us</Link>
            <Link href="/faqs" className="hover:text-black">FAQs</Link>
            <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black">Terms of Service</Link>
            <Link href="/policies" className="hover:text-black">Shelter Policies</Link>
          </div>

          {/* CTA Column */}
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

        {/* Copyright */}
        <div className="max-w-6xl mx-auto border-t border-gray-700 pt-3 text-center mt-3">
          <p className="text-[10px] text-gray-300">© 2025 WHELPS. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}