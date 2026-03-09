import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Chatbot from "../components/Chatbot.jsx";

const CustomerLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="flex w-full flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 animate-fade-in">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default CustomerLayout;

