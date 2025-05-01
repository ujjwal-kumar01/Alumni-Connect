import React from "react";
import { Link } from "react-router-dom";
import image1 from "./image.png";

export default function Home() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div  className="bg-gray-100 min-h-screen ">
      {/* Hero Section */}
      <header
        className="bg-black text-white text-center py-16"
        style={{
          backgroundImage: `url(${image1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="text-4xl font-bold">Welcome to IIIT Una Alumni Network</h1>
        <p className="mt-3 text-lg">Connecting Past, Present & Future</p>

        {!isLoggedIn && (
          <Link
            to="/signup"
            className="mt-6 inline-block bg-orange-500 px-6 py-3 text-lg rounded-lg hover:bg-orange-600 transition"
          >
            Join Now
          </Link>
        )}
      </header>

      {/* About Section */}
      <section className="max-w-5xl mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800">
          <Link className="text-gray-700 hover:text-orange-500" to="/About">
            About Us
          </Link>
        </h2>
        <p className="mt-4 text-gray-600">
          The IIIT Una Alumni Network is a platform designed to connect alumni with current students
          and faculty. Whether you’re looking to reconnect with old friends, mentor young professionals, or explore career opportunities, this is the place for you.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-lg shadow-md text-center transition transform hover:scale-105 hover:shadow-lg hover:bg-blue-50"
          >
            <Link to={feature.site}>
              <h3 className="text-xl font-semibold text-blue-700 hover:text-orange-600 transition">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </Link>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <footer className="bg-blue-600 text-white text-center py-10">
        <h2 className="text-2xl font-bold">Stay Connected. Stay Inspired. Stay Ahead.</h2>
        {!isLoggedIn && (
          <Link
            to="/signup"
            className="mt-4 inline-block bg-orange-500 px-6 py-3 text-lg rounded-lg hover:bg-orange-600 transition"
          >
            Get Started Now
          </Link>
        )}
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Find Alumni",
    description: "Search for seniors based on company, industry, or location.",
    site: "/Alumini",
  },
  {
    title: "Live Chat",
    description: "Connect instantly with alumni for career advice.",
    site: "/global-chat", // Replace with a dynamic route or better landing
  },
  {
    title: "Events & Reunions",
    description: "Stay updated on upcoming meetups and networking events.",
    site: "/Events",
  },
  {
    title: "Job Board",
    description: "Access job and internship listings shared by alumni.",
    site: "/jobs",
  },
  {
    title: "College Blogs & Research Papers",
    description: "Explore insightful blogs and groundbreaking research published by our students, alumni, and faculty at IIIT Una.",
    site: "/collegeBlogs", // Ensure this route/component is created and linked properly
  },  
  {
    title: "Give Back",
    description: "Support students through mentorship and events.",
    site: "/give-back",
  },
];
