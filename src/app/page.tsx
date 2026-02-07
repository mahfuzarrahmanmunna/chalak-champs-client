// import Image from "next/image";
// import Navbar from "./components/Navbar/Navbar";
"use client";
import HeroBanner from "./components/Hero/Hero";
import useAuth from "./hooks/useAuth";
// import { useAuth } from "./providers/FirebaseProvider";

export default function Home() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div>
      <HeroBanner />
    </div>
  );
}
