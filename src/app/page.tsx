// import Image from "next/image";
// import Navbar from "./components/Navbar/Navbar";
"use client";
import HeroBanner from "./components/Hero/Hero";
// import useAuth from "./hooks/useAuth";
import { useCurrentUser } from "./hooks/useCurrentUser";
// import { useAuth } from "./providers/FirebaseProvider";

export default function Home() {
  // const { user } = useAuth();
  const { currentUser } = useCurrentUser();
  console.log(currentUser);
  return (
    <div>
      <HeroBanner />
    </div>
  );
}
