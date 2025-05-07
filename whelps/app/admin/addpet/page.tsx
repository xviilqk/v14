"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const AddPetPage = () => {
  const [activeTab, setActiveTab] = useState('Pets');
  const [petData, setPetData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    healthCondition: '',
    story: '',
    status: 'Available',
    type: 'dog',
    vaccinated: false,
    image: null as File | null,
    previewImage: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPetData(prev => ({ ...prev, [name]: checked }));
    } else {
      setPetData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPetData(prev => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Submitting pet data:', petData);
    // Reset form after submission
    setPetData({
      name: '',
      breed: '',
      age: '',
      gender: '',
      size: '',
      color: '',
      healthCondition: '',
      story: '',
      status: 'Available',
      type: 'dog',
      vaccinated: false,
      image: null,
      previewImage: ''
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Same as AdminDashboard */}
      <div className="w-64 bg-myOrage shadow-md">
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
        {/* Header - Same as AdminDashboard */}
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

        {/* Add Pet Form */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-myOrage mb-6">Pet Profile</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column - Image/Video Upload */}
                <div className="w-full md:w-1/3 space-y-4">
                  <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    {petData.previewImage ? (
                      <Image
                      src={petData.previewImage} 
                      alt="Pet preview" 
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No image selected</span>
                    )}
                  </div>
                  <label className="block">
                    <span className="sr-only">Choose pet photo</span>
                    <input 
                      type="file" 
                      onChange={handleImageChange}
                      accept="image/*,video/*"
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-myPink file:text-myOrage
                        hover:file:bg-myPink-dark"
                    />
                  </label>
                  <p className="text-sm text-gray-500">Upload an image or video of the pet</p>
                </div>

                {/* Right Column - About Section */}
                <div className="w-full md:w-2/3 space-y-4">
                  <h2 className="text-2xl font-semibold text-myOrage border-b pb-2">About</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={petData.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Breed</label>
                      <input
                        type="text"
                        name="breed"
                        value={petData.breed}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="text"
                        name="age"
                        value={petData.age}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        name="gender"
                        value={petData.gender}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Size</label>
                      <select
                        name="size"
                        value={petData.size}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                        required
                      >
                        <option value="">Select size</option>
                        <option value="Small">Small</option>
                        <option value="Medium">Medium</option>
                        <option value="Large">Large</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Color/Markings</label>
                      <input
                        type="text"
                        name="color"
                        value={petData.color}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-myOrage border-b pb-2">Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      name="type"
                      value={petData.type}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                      required
                    >
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      value={petData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                      required
                    >
                      <option value="Available">Available</option>
                      <option value="In Trial">In Trial</option>
                      <option value="Adopted">Adopted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Medical Info Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-myOrage border-b pb-2">Medical Info</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Health Condition</label>
                  <input
                    type="text"
                    name="healthCondition"
                    value={petData.healthCondition}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={petData.vaccinated}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-myOrage focus:ring-myOrage border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">Vaccinated</label>
                </div>
              </div>

              {/* Story Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-myOrage border-b pb-2">Story</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tell the pets story</label>
                  <textarea
                    name="story"
                    value={petData.story}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-myOrage focus:border-myOrage"
                    required
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <Link href="/admin/pets">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myOrage"
                  >
                    Cancel
                  </button>
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-myOrage hover:bg-myOrage-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-myOrage"
                >
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddPetPage;