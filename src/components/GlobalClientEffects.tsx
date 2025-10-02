
"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function GlobalClientEffects() {
  const { theme } = useTheme();

  // Efeitos globais do cliente
  useEffect(() => {
    // Configurações globais do tema
    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme || "system");
    }
  }, [theme]);

  return null;
}
