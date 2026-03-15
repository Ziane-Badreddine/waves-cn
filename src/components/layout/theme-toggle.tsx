"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

import { useHotkey } from "@tanstack/react-hotkeys";
import { Button } from "../ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
   const isDark = theme === "dark";
   useHotkey("D", () => {
    setTheme(isDark ? "light" : "dark");
  });

  return (
    <Button
      variant={"ghost"}
      size="icon"
      onClick={() =>  setTheme(isDark ? "light" : "dark")}
      className="rounded-full cursor-pointer  relative overflow-hidden transition-transform hover:scale-105"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
