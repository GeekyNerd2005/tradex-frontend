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
      const res = await axios.post("http://localhost:5001/api/auth/login", {
        username,
        password,
      });
      console.log("Login Response:", res.data);
      localStorage.setItem("username", username);
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
        href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen font-[Rajdhani] bg-[#0B0F2F] text-[#E0E6F1] flex items-center justify-center relative overflow-hidden"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0B0F2F] via-[#11245E] to-[#0B0F2F]" />

        <div
          className="absolute top-1/3 left-1/2 w-[450px] h-[450px] rounded-full blur-[160px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,255,255,0.07), transparent 80%)",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(0,140,255,0.04), transparent 80%)",
          }}
        />

        <div className="absolute top-6 left-6 z-10">
          <h1 className="text-4xl font-bold text-cyan-400 tracking-widest uppercase drop-shadow">
            Tradex<span className="text-cyan-300">.</span>
          </h1>
          <p className="text-sm text-cyan-200 italic mt-1 opacity-75">
            Trade smarter. Trade <span className="text-cyan-300">Tradex</span>.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="z-10 bg-[#11193F]/80 border border-[#2AF5FF33] p-10 rounded-2xl shadow-[0_0_30px_#2AF5FF22] backdrop-blur-md w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold text-center mb-8 text-[#00FFFF] tracking-wide uppercase border-b border-[#2AF5FF33] pb-3">
            Member Login
          </h2>

          {error && (
            <div className="bg-[#1d2a45] text-red-400 p-2 text-sm rounded border border-red-500 mb-4">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm mb-1 text-cyan-200">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#0F1B36] text-cyan-100 border border-[#2AF5FF22] focus:outline-none focus:ring-2 focus:ring-[#2AF5FF] placeholder:text-cyan-400"
              placeholder="your_username"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm mb-1 text-cyan-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded bg-[#0F1B36] text-cyan-100 border border-[#2AF5FF22] focus:outline-none focus:ring-2 focus:ring-[#2AF5FF] placeholder:text-cyan-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00FFFF] to-[#2AF5FF] hover:from-[#2AF5FF] hover:to-[#00FFFF] transition-all duration-300 py-2 rounded-lg font-bold tracking-wide text-[#0B0F2F] shadow-md hover:shadow-[0_0_10px_#2AF5FF88]"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-[#0B0F2F] mx-auto"
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

          <p className="text-center mt-4 text-sm text-cyan-200">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-cyan-300 hover:underline font-medium"
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </>
  );
}
