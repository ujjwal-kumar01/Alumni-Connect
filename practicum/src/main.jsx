import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
  createRoutesFromElements,
  Route,
  RouterProvider,
  createBrowserRouter
} from 'react-router-dom';

import Home from './components/Home.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Alumini from './components/Alumini.jsx';
import Profile from './components/Profile.jsx';
import EditProfile from './components/EditProfile.jsx';
import Chat from './components/Chat.jsx';
import Events from './components/Events.jsx';
import JobBoard from './components/JobBoard.jsx';
import PostJob from './components/PostJob.jsx';
import GiveBack from './components/GiveBack.jsx';
import DonateSponsor from './components/DonateSponsor.jsx'; // ✅ Import donation component
import Chatbot from './components/Chatbot.jsx'; // 👈 import it
import Applicants from './components/Applicants.jsx';
import GlobalChat from './components/Globalchat.jsx';




const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="alumini" element={<Alumini />} />
      <Route path="profile/:id" element={<Profile />} />
      <Route path="events" element={<Events />} />
      <Route path="update-profile/:id" element={<EditProfile />} />
      <Route path="chat/:receiverId" element={<Chat />} />
      <Route path="jobs" element={<JobBoard />} />
      <Route path="post-job" element={<PostJob />} />
      <Route path="give-back" element={<GiveBack />} />
      <Route path="donate" element={<DonateSponsor />} /> {/* ✅ Donate page */}
      <Route path="chatbot" element={<Chatbot />} />  
      <Route path="/jobs/:jobId/applicants" element={<Applicants />} />
      <Route path="/global-chat" element={<GlobalChat  />} />
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
