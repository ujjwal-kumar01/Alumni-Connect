import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const GiveBack = () => {
    const handleDonation = async (amount) => {
        try {
            const { data: order } = await axios.post('http://localhost:8000/api/v1/razorpay/create-order', { amount });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "Alumni Network",
                description: "Donation or Sponsorship",
                order_id: order.id,
                handler: async function (response) {
                    const verify = await axios.post('http://localhost:8000/api/v1/razorpay/verify', response);
                    if (verify.data.success) {
                        alert("🎉 Payment Successful!");
                    } else {
                        alert("❌ Payment verification failed.");
                    }
                },
                prefill: {
                    name: "Alumni",
                    email: "alumni@example.com",
                },
                theme: {
                    color: "#8b5cf6",
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
        } catch (err) {
            console.error('Payment Error:', err);
            alert("Error initiating payment. Please try again.");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 bg-gradient-to-br from-blue-100 via-blue-100 to-blue-100">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">🤝 Give Back to Your Alma Mater</h1>

            <p className="text-center text-gray-600 mb-10">
                As an alumnus, you have the opportunity to make a lasting impact on the lives of current students.
                Here are a few ways you can contribute and stay connected with your college community.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Post Jobs */}
                <div className="p-6 rounded-lg shadow bg-white text-center">
                    <h2 className="text-xl font-semibold mb-2 text-green-600">💼 Post Job Opportunities</h2>
                    <p className="text-gray-600 mb-4">Share openings from your company and help students or fellow alumni find their next opportunity.</p>
                    <Link to="/jobs" className="text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                        Post a Job
                    </Link>
                </div>

                {/* Donate or Sponsor */}
                <div className="p-6 rounded-lg shadow bg-white text-center">
                    <h2 className="text-xl font-semibold mb-2 text-purple-600">❤️ Donate or Sponsor</h2>
                    <p className="text-gray-600 mb-4">Support events, scholarships, or campus development through monetary or material contributions.</p>
                    <Link to="/donate" className="text-sm text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded">
                        Donate Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GiveBack;
