"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center p-4 text-center sm:p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto w-full max-w-lg space-y-10 rounded-[2rem] bg-white/60 backdrop-blur-xl p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/50"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ rotate: -180, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 150, damping: 20 }}
            className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-green-300 to-emerald-500 shadow-[0_10px_30px_rgba(16,185,129,0.3)] border-4 border-white"
          >
            <svg
              className="h-16 w-16 text-white drop-shadow-sm"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-900 font-serif">
              Haritha Karma Sena
            </h1>
            <p className="text-sm md:text-md font-bold text-emerald-600/80 mt-3 uppercase tracking-[0.2em]">
              Nature&apos;s Guardians Portal
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="space-y-4 pt-4"
        >
          <Link href="/login" className="block w-full">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white py-6 text-lg rounded-xl shadow-md border border-emerald-300/50 font-bold tracking-wide transition-all">
                Login as User
              </Button>
            </motion.div>
          </Link>
          <Link href="/login/admin" className="block w-full">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full bg-white hover:bg-emerald-50 text-emerald-700 py-6 text-lg rounded-xl shadow-sm border-2 border-emerald-200 font-bold tracking-wide transition-all">
                Login as Admin
              </Button>
            </motion.div>
          </Link>
          <Link href="/login/staff" className="block w-full">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button className="w-full bg-white hover:bg-emerald-50 text-emerald-600 py-6 text-lg rounded-xl shadow-sm border border-emerald-100 font-medium tracking-wide transition-all">
                Login as Staff
              </Button>
            </motion.div>
          </Link>
          <p className="text-xs text-emerald-700/60 pt-4 font-serif italic tracking-wide">
            Select your role to securely access the portal.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
