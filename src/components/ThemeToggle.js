import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="ml-2 px-4 py-1 rounded-full text-sm bg-primary text-textLight hover:shadow-neon transition"
    >
      {darkMode ? "Light" : "Dark"} Mode
    </button>
  );
}
