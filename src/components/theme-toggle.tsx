"use client";

import * as React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/atoms/dropdown-menu";

interface ThemeToggleProps {
  disabled?: boolean;
}

export function ThemeToggle({ disabled = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [colorTheme, setColorTheme] = React.useState("default");

  React.useEffect(() => {
    const htmlElement = document.documentElement;
    const currentColorTheme =
      htmlElement.className.match(/theme-\w+/)?.[0] || "default";
    setColorTheme(
      currentColorTheme === "default"
        ? "default"
        : currentColorTheme.replace("theme-", "")
    );
  }, []);

  const applyTheme = (mode: string, color: string) => {
    setTheme(mode);
    const htmlElement = document.documentElement;

    // Remove existing theme classes
    htmlElement.classList.remove("theme-blue", "theme-green");

    // Apply color theme
    if (color !== "default") {
      htmlElement.classList.add(`theme-${color}`);
    }

    setColorTheme(color);
  };

  if (disabled) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => applyTheme("light", colorTheme)}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("dark", colorTheme)}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme("system", colorTheme)}>
          <Palette className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => applyTheme(theme || "system", "default")}
        >
          <div className="mr-2 h-4 w-4 rounded-full bg-zinc-900 dark:bg-zinc-100"></div>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => applyTheme(theme || "system", "blue")}>
          <div className="mr-2 h-4 w-4 rounded-full bg-blue-500"></div>
          Blue
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => applyTheme(theme || "system", "green")}
        >
          <div className="mr-2 h-4 w-4 rounded-full bg-green-600"></div>
          Green
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
