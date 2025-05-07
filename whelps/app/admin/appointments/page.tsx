"use client";
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Link from 'next/link';
import Image from 'next/image';
import "@/styles/admin-appointments-calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Appointment = {
  name: string;
  petBooked: string;
  date: string;
  time: string;
  status: 'pending' | 'completed';
};

const AdminAppointments = () => {
  const [activeTab, setActiveTab] = useState('Appointments');
  const [selectedDate, setSelectedDate] = useState<Value>(null);

  const appointments: Appointment[] = [
    {
      name: 'Mica Hanna Longalong',
      petBooked: 'Cleo',
      date: '04/03/25',
      time: '10:00 AM',
      status: 'completed'
    },
    {
      name: 'John Paul Cerro',
      petBooked: 'Milo',
      date: '04/01/25',
      time: '1:00 PM',
      status: 'completed'
    },
    {
      name: 'Elisha Nicole San Juan',
      petBooked: 'Nala',
      date: '04/05/25',
      time: '2:00 PM',
      status: 'pending'
    },
  ];

  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const completedAppointments = appointments.filter(app => app.status === 'completed');

  const handleDateChange = (value: Value) => {
    setSelectedDate(value);
  };

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

        {/* Appointments Content */}
        <main className="p-6">
          {/* Top Row - Summary and Calendar */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Total Appointments - Now horizontal */}
            <div className=" rounded-lg w-full">
              <div className="flex flex-wrap text-center gap-4">
                <div className="bg-myPink p-4 shadow rounded-lg flex-1 min-w-[200px]">
                  <p className="text-myOrage text-xl">Total Appointment</p>
                  <p className="text-3xl font-bold text-myOrage">{appointments.length}</p>
                </div>
                <div className="bg-myPink p-4 shadow rounded-lg flex-1 min-w-[200px]">
                  <p className="text-myOrage text-xl">Pending Appointment</p>
                  <p className="text-3xl font-bold text-myOrage">{pendingAppointments.length}</p>
                </div>
                <div className="bg-myPink p-4 shadow rounded-lg flex-1 min-w-[200px]">
                  <p className="text-myOrage text-xl">Completed Appointment</p>
                  <p className="text-3xl font-bold text-myOrage">{completedAppointments.length}</p>
                </div>
              </div>
            </div>
          </div>
          <h3 className="text-2xl font-semibold text-myOrage mb-4">Today Appointments</h3>
          {/* Second Row - Today's Appointments and Calendar */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Today Appointments */}
            <div className="bg-white p-4 rounded-lg shadow flex-1">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 text-myOrage font-medium">Name</th>
                    <th className="text-left py-2 text-myOrage font-medium">Pet</th>
                    <th className="text-left py-2 text-myOrage font-medium">Date</th>
                    <th className="text-left py-2 text-myOrage font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAppointments.map((appointment, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 text-myOrage">{appointment.name}</td>
                      <td className="py-2 text-myOrage">{appointment.petBooked}</td>
                      <td className="py-2 text-myOrage">{appointment.date}</td>
                      <td className="py-2 text-myOrage">{appointment.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calendar */}
            <div className="bg-myPink p-4 rounded-lg w-full md:w-1/3 max-w-xl">
              <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  className="border-none bg-transparent w-full"
                  view="month"
                  minDetail="year"
                  showNeighboringMonth={true}
                  calendarType="gregory"
                  formatShortWeekday={(_locale, date) => 
                      ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][date.getDay()]
                  }
                  tileDisabled={() => false}
              />
            </div>
          </div>

          {/* Bottom Row - Appointments Tables */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-myOrage mb-4">Appointment History</h3>
            {/* Appointment History */}
            <div className="bg-white p-4 rounded-t-lg shadow">
              <table className="min-w-full">
                <thead>
                  <tr className="text-myOrage items-center">
                    <th className="text-left py-2 font-medium">Name</th>
                    <th className="text-left py-2 font-medium">Pet</th>
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {completedAppointments.map((appointment, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-2 text-myOrage">{appointment.name}</td>
                      <td className="py-2 text-myOrage">{appointment.petBooked}</td>
                      <td className="py-2 text-myOrage">{appointment.date}</td>
                      <td className="py-2 text-myOrage">{appointment.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminAppointments;