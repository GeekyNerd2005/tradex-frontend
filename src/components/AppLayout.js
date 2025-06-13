// src/components/AppLayout.js
import React from "react";
import Navbar from "./Navbar";

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div> {/* Adjust if navbar is sticky */}
    </>
  );
}
