"use client";
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link';
import Image from 'next/image';
import "@/styles/appointments-calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Appointment = {
  name: string;
  petBooked: string;
  date: string;
  time: string;
};

type PetStats = {
  dogs: number;
  cats: number;
  petsAvailable: number;
  inTrial: number;
};

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  healthCondition: string;
  details: string;
  image: string;
  status: "Available" | "In Trial" | "Adopted";
  type: "dog" | "cat";
  story: string;
}

const AdminDashboard = () => {
  const [date, setDate] = useState<Value>(new Date(2025, 3, 1)); // April 2025
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [petStats, setPetStats] = useState<PetStats>({
    dogs: 0,
    cats: 0,
    petsAvailable: 0,
    inTrial: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pets');
        const pets: Pet[] = await response.json();
        
        setPetStats({
          dogs: pets.filter(pet => pet.type === 'dog').length,
          cats: pets.filter(pet => pet.type === 'cat').length,
          petsAvailable: pets.filter(pet => pet.status === 'Available').length,
          inTrial: pets.filter(pet => pet.status === 'In Trial').length,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const appointments: Appointment[] = [
    {
      name: 'Mica Hanna Longalong',
      petBooked: 'Cleo',
      date: '04/03/25',
      time: '10:00 AM',
    },
    {
      name: 'John Paul Cerro',
      petBooked: 'Milo',
      date: '04/01/25',
      time: '1:00 PM',
    },
  ];

  const todayAppointment = {
    name: 'Elisha Nicole San Juan',
    time: '2:00 PM',
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setDate(value);
    } else if (Array.isArray(value)) {
      setDate(value[0]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="m-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-myOrage"></div>
          <p className="mt-4 text-myOrage">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-myOrage shadow-md">
        {/* Logo - Centered */}
        <div className="flex justify-center p-4">
          <Link href="/admin/dashboard" className="flex justify-center">
            <div className="h-30 w-30 rounded-full overflow-hidden border-none cursor-pointer">
              <Image 
                src="/images/Whelpswhite.png"
                alt="WHELPS Logo"
                width={180}
                height={180}
                className="object-cover"
              />
            </div>
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="p-4">
          <ul>
            {[
              { name: 'Dashboard', path: '/admin/dashboard' },
              { name: 'Pets', path: '/admin/pets' },
              { name: 'Appointments', path: '/admin/appointments' },
              { name: 'Pet Matching', path: '/admin/matching' },
              { name: 'Questionnaire', path: '/admin/questionnaire' },
              { name: 'Settings', path: '/admin/settings' }
            ].map((item) => (
              <li key={item.name} className="mb-2">
                <Link
                  href={item.path}
                  className={`flex items-center w-full text-left text-2xl px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.name 
                      ? 'bg-myPink text-myOrage font-semibold' 
                      : 'text-white hover:bg-myPink hover:bg-opacity-50'
                  }`}
                  onClick={() => setActiveTab(item.name)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1"></div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 border placeholder-myOrage rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-myOrage"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 flex justify-end items-center">
              <span className="mr-2 text-gray-700">Admin 1</span>
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium"></span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Pet Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Row - Dogs and Cats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-myPink p-2 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-myOrage">Dogs</h3>
                  <p className="text-5xl font-bold text-myOrage">{petStats.dogs}</p>
                </div>
                <div className="bg-myPink p-2 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-myOrage">Cats</h3>
                  <p className="text-5xl font-bold text-myOrage">{petStats.cats}</p>
                </div>
              </div>

              {/* Bottom Row - Pets Available and In-trial */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-myPink p-2 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-myOrage">Pets Available</h3>
                  <p className="text-5xl font-bold text-myOrage">{petStats.petsAvailable}</p>
                </div>
                <div className="bg-myPink p-2 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-myOrage">In-trial</h3>
                  <p className="text-5xl font-bold text-myOrage">{petStats.inTrial}</p>
                </div>
              </div>

              {/* Appointment History */}
              <h3 className="text-3xl font-semibold text-myOrage mb-4">Appointment History</h3>
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b bg-myOrage">
                      <th className="text-left py-2 px-4 text-white font-medium">Name</th>
                      <th className="text-left py-2 px-4 text-white font-medium">Pet Booked</th>
                      <th className="text-left py-2 px-4 text-white font-medium">Date</th>
                      <th className="text-left py-2 px-4 text-white font-medium">Time</th>
                      <th className="text-left py-2 px-4 text-white font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => (
                      <tr key={index} className="border-b bg-myPink">
                        <td className="py-3 px-4 text-myOrage">{appointment.name}</td>
                        <td className="py-3 px-4 text-myOrage">{appointment.petBooked}</td>
                        <td className="py-3 px-4 text-myOrage">{appointment.date}</td>
                        <td className="py-3 px-4 text-myOrage">{appointment.time}</td>
                        <td className="py-3 px-4">
                          <button className="text-myOrage hover:text-blue-800">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column - Calendar and Today's Appointment */}
            <div className="space-y-6">
              {/* Calendar */}
              <div className="bg-myPink p-6 rounded-lg shadow">
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  view="month"
                  prev2Label={null}
                  next2Label={null}
                  calendarType="gregory"
                  tileClassName={({ date: tileDate, view }) => 
                    view === 'month' && tileDate.getMonth() !== (date instanceof Date ? date.getMonth() : new Date().getMonth()) 
                      ? 'text-gray-400' 
                      : ''
                  }
                />
              </div>

              {/* Today's Appointment */}
              <div className="bg-myPink p-2 rounded-lg shadow">
                <h3 className="text-2xl font-semibold text-myOrage mb-4">Appointment Today</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-myOrage">{todayAppointment.name}</p>
                    <p className="text-myOrage">{todayAppointment.time}</p>
                  </div>
                  <button className="text-myOrage hover:text-blue-800">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;