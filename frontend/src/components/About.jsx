import React from "react";
import image2 from './image2.png';

export default function About() {
  return (
    <div className="bg-gray-100 min-h-screen">
      
      <header className="bg-blue-600 text-white text-center py-16"
      style={{ backgroundImage: `url(${image2})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <h1 className="text-4xl font-bold">About IIIT UNA</h1>
        <p className="mt-3 text-lg">Excellence in Education & Innovation</p>
      </header>
      
      {/* College Overview */}
      <section className="max-w-5xl mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800">Who We Are</h2>
        <p className="mt-4 text-gray-600">
          Established in 2014, IIIT UNA has been a center of academic excellence, nurturing bright minds and fostering a culture of innovation and leadership. Our mission is to provide world-class education, cutting-edge research, and a dynamic learning environment.
        </p>
      </section>
      
      {/* Mission & Vision */}
      <section className="max-w-5xl mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800">Our Mission & Vision</h2>
        <p className="mt-4 text-gray-600">
          <strong>Mission:</strong> To empower students with knowledge, skills, and values that will help them excel in their careers and contribute to society.
        </p>
        <p className="mt-2 text-gray-600">
          <strong>Vision:</strong> To be recognized globally as a leading institution in education, research, and innovation.
        </p>
      </section>
      
      {/* Achievements & Recognition */}
      <section className="max-w-6xl mx-auto my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-blue-700">{achievement.title}</h3>
            <p className="mt-2 text-gray-600">{achievement.description}</p>
          </div>
        ))}
      </section>
      
      {/* Call to Action */}
      <footer className="bg-blue-600 text-white text-center py-10">
        <h2 className="text-2xl font-bold">Join Us in Shaping the Future</h2>
        <p className="mt-2 text-lg">Experience excellence in education at IIIT Una</p>
      </footer>
    </div>
  );
}

const achievements = [
  { title: "Top-Ranked Institution", description: "Recognized among the top colleges in the country." },
  { title: "Cutting-Edge Research", description: "Innovative research projects making global impact." },
  { title: "Alumni Success", description: "Our graduates excel in top companies worldwide." },
  { title: "State-of-the-Art Campus", description: "Modern infrastructure with world-class facilities." },
  { title: "Diverse & Inclusive", description: "A vibrant community fostering inclusivity and growth." },
  { title: "Global Collaborations", description: "Partnerships with leading universities and industries." },
];
