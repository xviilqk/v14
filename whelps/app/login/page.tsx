"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaBars, FaTimes, FaChevronDown, FaChevronUp, FaEye, FaEyeSlash } from "react-icons/fa";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  age_group?: string;
  profile_pic?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface ApiError {
  detail?: string;
  email?: string[];
  password?: string[];
  non_field_errors?: string[];
}

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdoptOpen, setIsAdoptOpen] = useState(false);
  const [isMobileAdoptOpen, setIsMobileAdoptOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const router = useRouter();

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) {
      showMessage("Please agree to the terms and policies");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeatPassword") as string;

    if (password !== repeatPassword) {
      showMessage("Passwords don't match");
      return;
    }

    const userData = {
      email: formData.get("email") as string,
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      age_group: formData.get("age") as string,
      password: password,
      repeat_password: repeatPassword,
    };

    try {
      const response = await fetch('http://localhost:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data as AuthResponse;
        localStorage.setItem('auth_token', token);
        setLoggedInUser(user);
        showMessage("Account created successfully!");
        router.push('/');
      } else {
        handleApiError(data as ApiError);
      }
    } catch (error) {
      showMessage("Network error. Please try again.");
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const credentials = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data as AuthResponse;
        localStorage.setItem('auth_token', token);
        setLoggedInUser(user);
        showMessage("Login successful!");
        router.push('/');
      } else {
        handleApiError(data as ApiError);
      }
    } catch (error) {
      showMessage("Network error. Please try again.");
      console.error("Login error:", error);
    }
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        setLoggedInUser(user);
      } else {
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const handleApiError = (error: ApiError) => {
    if (error.detail) {
      showMessage(error.detail);
    } else if (error.non_field_errors) {
      showMessage(error.non_field_errors[0]);
    } else if (error.email) {
      showMessage(error.email[0]);
    } else if (error.password) {
      showMessage(error.password[0]);
    } else {
      showMessage("An error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setLoggedInUser(null);
    showMessage("Logged out successfully");
    router.push('/');
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block lg:hidden text-myOrage"
          >
            <FaBars className="text-2xl" />
          </button>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <button 
                  onClick={() => setIsAdoptOpen(!isAdoptOpen)}
                  className="flex items-center text-myOrage hover:text-blue-600 transition-colors"
                >
                  ADOPT NOW
                  {isAdoptOpen ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
                </button>
                
                {isAdoptOpen && (
                  <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link href="/dogs" className="block px-4 py-2 text-myOrage hover:bg-gray-100" onClick={() => setIsAdoptOpen(false)}>
                      DOGS
                    </Link>
                    <Link href="/cats" className="block px-4 py-2 text-myOrage hover:bg-gray-100" onClick={() => setIsAdoptOpen(false)}>
                      CATS
                    </Link>
                  </div>
                )}
              </div>

              <Link href="/about" className="text-myOrage hover:text-blue-600 transition-colors">ABOUT</Link>
              <Link href="/#contacts" className="text-myOrage hover:text-blue-600 transition-colors">CONTACTS</Link>
              <Link href="/appointments" className="text-myOrage hover:text-blue-600 transition-colors">APPOINTMENTS</Link>
            </div>
            
            {loggedInUser ? (
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-none cursor-pointer">
                  <Image 
                    src={loggedInUser.profile_pic || "/images/default-profile.png"} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="object-cover"
                  />
                </div>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-1 rounded-full hover:bg-red-700 transition-colors">
                  Logout
                </button>
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

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isMenuOpen ? 'block' : 'hidden'}`} onClick={() => setIsMenuOpen(false)}>
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setIsMenuOpen(false)} className="block lg:hidden text-myOrage mb-6">
            <FaTimes className="text-2xl" />
          </button>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <button 
                onClick={() => setIsMobileAdoptOpen(!isMobileAdoptOpen)}
                className="flex items-center justify-between text-myOrage hover:text-blue-600 transition-colors py-2"
              >
                <span>ADOPT NOW</span>
                {isMobileAdoptOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
              </button>
              
              {isMobileAdoptOpen && (
                <div className="ml-4 mt-2 space-y-3">
                  <Link href="/dogs" className="block text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    DOGS
                  </Link>
                  <Link href="/cats" className="block text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    CATS
                  </Link>
                </div>
              )}
            </div>

            <Link href="/about" className="text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>ABOUT</Link>
            <Link href="/#contacts" className="text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>CONTACTS</Link>
            <Link href="/appointments" className="text-myOrage hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>APPOINTMENTS</Link>
            {loggedInUser ? (
              <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors text-center"
              >
                Logout
              </button>
            ) : (
              <Link href="/login">
                <button 
                  className="bg-myOrage text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  LOGIN
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Message Popup */}
      {message && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
          {message}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow flex justify-center items-center mt-52 mb-20 px-4 sm:px-8 lg:px-16">
        <div className="relative bg-myOrage p-10 rounded-xl shadow-lg w-full max-w-2xl text-center flex flex-col items-center">
          {/* Tab Switch */}
          <div className="absolute -top-6 left-0 right-0 flex">
            <button 
              className={`w-1/2 py-3 text-lg font-bold transition-colors rounded-t-xl ${activeTab === "login" ? "bg-myOrage text-white shadow-lg" : "bg-orange-100 text-myOrage"}`} 
              onClick={() => setActiveTab("login")}
            >
              Log In
            </button>
            <button 
              className={`w-1/2 py-3 text-lg font-bold transition-colors rounded-t-xl ${activeTab === "signup" ? "bg-myOrage text-white shadow-lg" : "bg-orange-100 text-myOrage"}`} 
              onClick={() => setActiveTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Log In Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="mt-12 space-y-4 w-full flex flex-col">
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-3 rounded bg-orange-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                required 
              />
              <div className="relative">
                <input 
                  name="password" 
                  type={showLoginPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="w-full px-4 py-3 rounded bg-orange-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10" 
                  required 
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button type="submit" className="w-full py-3 bg-white text-myOrage font-semibold rounded-full shadow-lg hover:bg-gray-200 transition">
                Log In
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignUp} className="mt-12 space-y-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  name="firstName" 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full px-4 py-3 rounded bg-orange-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                  required 
                />
                <input 
                  name="lastName" 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full px-4 py-3 rounded bg-orange-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                  required 
                />
              </div>
              <select 
                name="age" 
                className="w-full px-4 py-3 rounded bg-orange-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                required
              >
                <option value="">Select Age Group</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
              </select>
              <input 
                name="email" 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-3 rounded bg-orange-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                required 
              />
              <div className="relative">
                <input 
                  name="password" 
                  type={showSignupPassword ? "text" : "password"} 
                  placeholder="Create Password" 
                  className="w-full px-4 py-3 rounded bg-orange-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10" 
                  required 
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <input 
                  name="repeatPassword" 
                  type={showRepeatPassword ? "text" : "password"} 
                  placeholder="Repeat Password" 
                  className="w-full px-4 py-3 rounded bg-orange-200 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10" 
                  required 
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                >
                  {showRepeatPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input 
                    id="agreement" 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-myOrage focus:ring-myOrage" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                  />
                </div>
                <label htmlFor="agreement" className="ml-2 text-sm text-white">
                  Creating this account means you agree with our <Link href="/privacy" className="underline hover:text-gray-200">Privacy Policy</Link>, <Link href="/terms" className="underline hover:text-gray-200">Terms of Service</Link> and <Link href="/policies" className="underline hover:text-gray-200">Shelter Policies</Link>
                </label>
              </div>
              
              <button 
                type="submit" 
                className={`py-3 px-4 w-full bg-white text-myOrage font-semibold rounded-full shadow-lg hover:bg-gray-200 transition mt-4 ${!agreed ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!agreed}
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>

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