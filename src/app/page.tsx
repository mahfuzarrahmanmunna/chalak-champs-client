"use client";
import EmailSignup from "./components/EmailSignup/EmailSignup";
import FAQ from "./components/FAQ/FAQ";
import HeroBanner from "./components/Hero/Hero";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <FAQ />
      <EmailSignup />
    </div>
  );
}
