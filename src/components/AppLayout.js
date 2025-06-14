import React from "react";
import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F2F] text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
