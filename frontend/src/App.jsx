import { useState, useEffect } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'

import { Toaster } from "react-hot-toast";
import { useAuthStore } from './stores/useAuthStore';

import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import ProfilePage from './components/ProfilePage';
import Contact from './components/Contact.jsx';
import MultiStepForm from "./components/MultiStepForm.jsx";
import CreateBlogPage from './components/CreateBlogPage';
import AllBlogsPage from './components/AllBlogsPage';
import BlogDetails from './components/BlogDetailPage';
import ChatPage from './components/ChatPage';
import LogoutPage from './components/LogoutPage';
import ContestPage from './components/ContestPage.jsx';
import YtLinkAddPage from './components/YtLinkAddPage.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import Timepass from './components/Timepass.jsx';
import ModelChk from './components/ModelChk.jsx';
import Earth from './components/Earth.jsx';
import Preloader from "./components/Preloader.jsx";
import Footer from './components/Footer.jsx';
import TeamPage from './components/TeamPage.jsx';
import Ratings from './components/Ratings.jsx';
import SettingPage from './components/SettingPage.jsx';
import Abc from './components/Abc.jsx';
import { genOrGetToken } from './lib/utils.js';
import { onMessage } from 'firebase/messaging';
import { messaging } from './context Api/Firebase.jsx';

function App() {

  const { authUser, isCheckingAuth, checkAuth, getTotalUsers, fullname } = useAuthStore();
  const [showPreloader, setShowPreloader] = useState(false);
  const notiToken = localStorage.getItem("notiToken");


  useEffect(() => {
    genOrGetToken();
    console.log("USEEFFECT Notitoken: ", notiToken);
    checkAuth(notiToken);
    getTotalUsers();

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📬 Foreground message received:", payload);

      if (payload.notification) {
        const { title, body } = payload.notification;
    
        new Notification(title, {
          body,
          icon: "/avatar.png",
        });
      } else {
        console.warn("No notification object in payload");
      }
    });
    // Optional cleanup
    return () => {
      unsubscribe(); // ensures no memory leaks
    };
  },[]);

  // if(isCheckingAuth && !authUser){
  //   return <h1>wait for a while...</h1>
  // }


  const setWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime()+ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if(!itemStr) return false;

    const item = JSON.parse(itemStr);
    const now = new Date();
    if(now.getTime()>item.expiry){
      localStorage.removeItem(key);
      return false;
    }
    return item.value;
  }


  useEffect(() => {
    const hasVisited = getWithExpiry('hasVisited');
    if(!hasVisited){

      setShowPreloader(true);
      const ttl = 1*24*60*60*1000;
      setWithExpiry('hasVisited', true, ttl);

      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 13500); // adjust duration as needed
  
      return () => clearTimeout(timer);
    }
    // Simulate loading time or wait for resources
  }, []);



  return (

      <>
        {showPreloader ? 
          <Preloader/> :
          <div>
        <Navbar />    {/* Navbar will be displayed on all pages */}

        <Routes>
          <Route path="/" element={ <HomePage />} />
          <Route path="/signup" element={!authUser ? <SignupPage /> : < Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/logout" element={authUser ? <LogoutPage /> : <Navigate to="/" />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/setting" element={authUser ? <SettingPage /> : <Navigate to="/login" />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/oauth-form' element={fullname ? <MultiStepForm /> : <Navigate to="/login" /> } />
          <Route path="/createBlog" element={ <CreateBlogPage /> } />
          <Route path="/blogs" element={ authUser ? <AllBlogsPage /> : <Navigate to="/login" />} />
          <Route path="/blogs/:blogid" element={ <BlogDetails /> } />
          <Route path="/chat" element={ authUser ? <ChatPage /> : <Navigate to="/login" /> } />
          <Route path="/contest-list" element ={<ContestPage/>} />
          <Route path="/addYtLink" element={ <YtLinkAddPage /> } />
          <Route path="/timepass" element= { <Timepass />} />
          <Route path="/modelchk" element= { <ModelChk />} />
          <Route path="/earthchk" element= { <Earth />} />
          <Route path='/team' element={<TeamPage />} />
          <Route path='/rankings' element={ <Ratings />}/>          

          <Route path="*" element={<NotFoundPage />} />
          
          
        </Routes>

        <Footer />

        <Toaster />
      </div>
        
        }
      </>
  );
};

export default App
