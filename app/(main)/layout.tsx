"use client";
import { useEffect, useState } from "react";
import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/layout/header";

// export const metadata: Metadata = {
//   title: "Home",
//   description: "",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <html lang="en" className={theme}>
      <body>
        <Header themeToggler={toggleTheme} theme={theme} />

        {children}
      </body>
    </html>
  );
}
