import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://tradex-backend.onrender.com/api/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen font-[Orbitron] bg-[#0a0a0a] text-[#f0c4cb] flex items-center justify-center relative overflow-hidden"
        style={{ fontFamily: "'Orbitron', sans-serif" }}
      >
        {/* 🌌 Faint Aurora Layer */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#09030f] via-[#120014] to-[#09030f]" />

        {/* ✨ Very subtle, soft aurora blobs */}
        <div
          className="absolute top-1/3 left-1/2 w-[450px] h-[450px] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,20,60,0.06), transparent 80%)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full blur-[110px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(180,0,70,0.04), transparent 80%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* 🔻 Tradex Branding */}
        <div className="absolute top-6 left-6 z-10">
          <h1 className="text-4xl font-bold text-[#ff3366] tracking-widest uppercase drop-shadow-sm">
            Tradex<span className="text-[#ff99cc]">.</span>
          </h1>
          <p className="text-sm text-[#ffc2d9] italic mt-1 opacity-70">
            Trade smarter. Trade <span className="text-[#ff5588]">Tradex</span>.
          </p>
        </div>

        {/* 🔐 Login Form */}
        <form
          onSubmit={handleLogin}
          className="z-10 bg-[#10000b]/90 border border-[#ff446622] p-10 rounded-xl shadow-md backdrop-blur-md w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold text-center mb-8 text-[#ff6688] tracking-wide uppercase border-b border-[#ff225533] pb-3">
            Member Login
          </h2>

          {error && (
            <div className="bg-[#2a0d18] text-red-300 p-2 text-sm rounded border border-red-500 mb-4">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm mb-1 text-[#ffccd5]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#0f0a0c] text-[#ffe6ee] border border-[#ff336622] focus:outline-none focus:ring-1 focus:ring-[#ff4466] placeholder:text-[#ffb3c2]"
              placeholder="your_username"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm mb-1 text-[#ffccd5]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#0f0a0c] text-[#ffe6ee] border border-[#ff336622] focus:outline-none focus:ring-1 focus:ring-[#ff4466] placeholder:text-[#ffb3c2]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff0033] to-[#cc0055] hover:from-[#cc0055] hover:to-[#ff0033] transition-all duration-300 py-2 rounded-lg font-bold tracking-widest text-black shadow-md"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-black mx-auto"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Log In"
            )}
          </button>

          <p className="text-center mt-4 text-sm text-[#ffc2d9]">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[#ff99cc] hover:underline font-medium"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
