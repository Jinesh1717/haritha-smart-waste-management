"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Leaf, Home, Lock, Key, Truck, UserRound } from "lucide-react";

const translations = {
  en: {
    brand: "Harithakarmasena",
    subtitle: "Smart Waste Management",
    home: "home",
    login: "Login",
    langToggle: "EN | മൽ",
    mainTitle: "Smart Waste Management System",
    description: "Revolutionizing waste collection for a cleaner, greener tomorrow. Efficient, transparent, and community-driven.",
    portalTitle: "Login To Your Portal",
    adminLogin: "Admin Login",
    collectorLogin: "Collector Login",
    residentLogin: "Resident Login",
    learnMore: "Learn More About Us"
  },
  ml: {
    brand: "ഹരിതകർമ്മസേന",
    subtitle: "സ്മാർട്ട് വേസ്റ്റ് മാനേജ്മെന്റ്",
    home: "ഹോം",
    login: "ലോഗിൻ",
    langToggle: "മൽ | EN",
    mainTitle: "സ്മാർട്ട് വേസ്റ്റ് മാനേജ്മെന്റ് സിസ്റ്റം",
    description: "ശുദ്ധവും ഹരിതാഭവുമായ നാളേക്കായി മാലിന്യ ശേഖരണത്തിൽ ഒരു വിപ്ലവം. കാര്യക്ഷമവും സുതാര്യവും സമൂഹത്തെ അടിസ്ഥാനമാക്കിയുള്ളതും.",
    portalTitle: "നിങ്ങളുടെ പോർട്ടലിലേക്ക് ലോഗിൻ ചെയ്യുക",
    adminLogin: "അഡ്മിൻ ലോഗിൻ",
    collectorLogin: "കളക്ടർ ലോഗിൻ",
    residentLogin: "റസിഡന്റ് ലോഗിൻ",
    learnMore: "കൂടുതൽ വിവരങ്ങൾ"
  }
};

type Lang = 'en' | 'ml';

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ml' : 'en');
  };

  return (
    <main className="relative min-h-[100dvh] w-full flex flex-col font-sans text-white overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/80 to-emerald-950/60" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 w-full max-w-[1400px] mx-auto">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="text-emerald-400">
            <Leaf className="w-8 h-8 md:w-9 md:h-9 fill-emerald-400" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold leading-none tracking-tight">{t.brand}</h1>
            <p className="text-[10px] md:text-xs text-gray-300 font-medium mt-1">{t.subtitle}</p>
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full px-1.5 py-1.5 border border-white/10">
          <Link href="/" className="flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/80 text-white font-medium text-sm transition-colors">
            <Home className="w-4 h-4 fill-amber-500 text-amber-500" /> {t.home}
          </Link>
          <Link href="/login" className="flex items-center gap-2 px-6 py-2 rounded-full hover:bg-white/10 text-white font-medium text-sm transition-colors">
            <Lock className="w-4 h-4 text-amber-500" /> {t.login}
          </Link>
        </nav>

        {/* Right Nav */}
        <div className="hidden md:flex items-center">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium text-sm hover:bg-white/10 transition-colors"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 w-full max-w-5xl mx-auto text-center space-y-8 mt-[-10dvh] md:mt-[-5dvh]">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="space-y-5"
        >
          <h2 className="text-emerald-400 font-bold tracking-[0.25em] text-sm md:text-sm uppercase drop-shadow-md">
            {t.brand}
          </h2>
          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl ${lang === 'en' ? 'font-sans' : ''}`}>
            {t.mainTitle}
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-200 mt-6 font-medium drop-shadow-lg leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="w-full flex flex-col items-center pt-8 space-y-6"
        >
          <h3 className="text-emerald-400 font-bold tracking-[0.2em] text-xs md:text-sm uppercase drop-shadow-md">
            {t.portalTitle}
          </h3>

          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-4 w-full md:w-auto">
            <Link href="/login/admin" className="w-full md:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center justify-center gap-3 px-8 py-3.5 bg-emerald-100/30 hover:bg-emerald-100/40 backdrop-blur-md rounded-2xl border border-emerald-200/40 text-white font-semibold transition-all shadow-xl">
                <Key className="w-5 h-5 text-amber-200 fill-amber-200" />
                {t.adminLogin}
              </motion.div>
            </Link>
            
            <Link href="/login/staff" className="w-full md:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center justify-center gap-3 px-8 py-3.5 bg-emerald-100/30 hover:bg-emerald-100/40 backdrop-blur-md rounded-2xl border border-emerald-200/40 text-white font-semibold transition-all shadow-xl">
                <Truck className="w-5 h-5 text-amber-200 md:fill-white" />
                {t.collectorLogin}
              </motion.div>
            </Link>

            <Link href="/login" className="w-full md:w-auto">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center justify-center gap-3 px-8 py-3.5 bg-emerald-100/30 hover:bg-emerald-100/40 backdrop-blur-md rounded-2xl border border-emerald-200/40 text-white font-semibold transition-all shadow-xl">
                <Home className="w-5 h-5 text-amber-200" />
                {t.residentLogin}
              </motion.div>
            </Link>
          </div>

          <div className="pt-8">
            <Link href="/about">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/40 text-white font-medium transition-all text-sm shadow-lg">
                {t.learnMore}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
