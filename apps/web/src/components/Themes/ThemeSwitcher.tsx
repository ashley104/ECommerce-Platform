"use client";

import { Button } from "@repo/ui/button";
import { useTheme } from "./ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      className="hover:bg-gray-300 border border-gray-200 text-gray-800 font-bold py-2 px-3 rounded"
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
