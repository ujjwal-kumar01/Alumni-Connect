import React, { useState } from 'react';
import axios from 'axios';

const Donate = () => {
  const [amount, setAmount] = useState('');

  const loadRazorpay = async () => {
    try {
      const { data } = await axios.post('http://localhost:8000/api/v1/razorpay/create-order', { amount });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Alumni Network',
        description: 'Donation',
        order_id: data.order.id,
        handler: async (response) => {
          const verifyRes = await axios.post('http://localhost:8000/api/v1/razorpay/verify-payment', response);
          if (verifyRes.data.success) {
            alert('✅ Payment successful and verified!');
          } else {
            alert('❌ Payment verification failed.');
          }
        },
        prefill: {
          name: 'Alumni User',
          email: 'user@example.com',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Payment initiation failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-center bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-purple-600">❤️ Donate or Sponsor</h2>
      <input
        type="number"
        placeholder="Enter Amount (INR)"
        className="w-full mb-4 px-4 py-2 border rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button
        onClick={loadRazorpay}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
      >
        Donate Now
      </button>
    </div>
  );
};

export default Donate;
