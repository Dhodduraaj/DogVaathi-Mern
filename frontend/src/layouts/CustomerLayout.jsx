import React from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import Chatbot from "../components/Chatbot.jsx";

const CustomerLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-cream-50 via-cream-50 to-cream-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Navbar />
      <main className="flex w-full flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default CustomerLayout;

