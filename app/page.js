"use client";

import Image from "next/image";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/home");
      return;
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}
