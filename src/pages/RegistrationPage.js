import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        username,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&display=swap"
        rel="stylesheet"
      />
      <div
        className="min-h-screen font-[Rajdhani] bg-[#060b1b] text-[#c2f5ff] flex items-center justify-center relative overflow-hidden"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#000814] via-[#001d3d] to-[#000814]" />

        <div
          className="absolute top-1/3 left-1/2 w-[450px] h-[450px] rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 200, 255, 0.05), transparent 80%)",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 150, 200, 0.05), transparent 80%)",
            zIndex: 0,
          }}
        />

        <div className="absolute top-6 left-6 z-10">
          <h1 className="text-4xl font-extrabold text-[#00f0ff] tracking-wider uppercase drop-shadow-sm">
            Tradex<span className="text-[#99f6ff]">.</span>
          </h1>
          <p className="text-sm text-[#c2f5ff] italic mt-1 opacity-70">
            Trade smarter. Trade <span className="text-[#00e0ff]">Tradex</span>.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="z-10 bg-[#031625]/90 border border-[#00d4ff33] p-10 rounded-xl shadow-md backdrop-blur-md w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-[#00f0ff] tracking-widest uppercase border-b border-[#00f0ff33] pb-3">
            Create Account
          </h2>

          {error && (
            <div className="bg-[#0f1e2e] text-[#ff8484] p-2 text-sm rounded border border-red-500 mb-4">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm mb-1 text-[#c2f5ff]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#010c18] text-[#e5faff] border border-[#00f0ff44] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] placeholder:text-[#99dfee]"
              placeholder="your_username"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm mb-1 text-[#c2f5ff]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#010c18] text-[#e5faff] border border-[#00f0ff44] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] placeholder:text-[#99dfee]"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm mb-1 text-[#c2f5ff]">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#010c18] text-[#e5faff] border border-[#00f0ff44] focus:outline-none focus:ring-1 focus:ring-[#00f0ff] placeholder:text-[#99dfee]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00e5ff] to-[#009fd9] hover:from-[#009fd9] hover:to-[#00e5ff] transition-all duration-300 py-2 rounded-lg font-bold tracking-widest text-black shadow-lg"
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
              "Register"
            )}
          </button>

          <p className="text-center mt-4 text-sm text-[#c2f5ff]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#00e0ff] hover:underline font-medium"
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
