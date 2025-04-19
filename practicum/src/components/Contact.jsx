import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setFormData({
        name: user.fullName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
        setErrorMsg("Phone number must be exactly 10 digits");
        return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/v1/contact/submit', {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone
      });

      if (res.data.success) {
        showPopup("Thanks for reaching out! We will contact you soon.");
        setFormData({ name: '', email: '', phone: '' }); // ✅ Clear the fields
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white py-10 px-6">
      
      {/* ✅ Popup */}
      {popupVisible && (
        <div className="fixed top-5 right-5 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-400">
          {popupMessage}
        </div>
      )}

      <div className="max-w-5xl w-full bg-gray-100 p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left Side Info */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl text-gray-800 font-extrabold tracking-tight">Get in Touch</h1>
            <p className="text-lg text-gray-600">Fill in the form to start a conversation with us.</p>

            <div className="flex items-center space-x-4 text-gray-600">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-md font-semibold">IIIT Una, Saloh, Una, Himachal Pradesh</span>
            </div>

            <div className="flex items-center space-x-4 text-gray-600">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-md font-semibold">01975-257908</span>
            </div>

            <div className="flex items-center space-x-4 text-gray-600">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-md font-semibold">director@iiitu.ac.in</span>
            </div>
          </div>

          {/* Right Side Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="mt-2 py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="mt-2 py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="phone" className="font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone Number"
                required
                className="mt-2 py-3 px-4 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-700 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition duration-300"
            >
              Submit
            </button>

            {errorMsg && <p className="text-red-600 font-medium">{errorMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
