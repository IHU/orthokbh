"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Script from "next/script";

interface ThemeProviderProps
  extends React.ComponentProps<typeof NextThemesProvider> {
  manualTheme?: {
    mode?: "light" | "dark" | "system";
    colorTheme?: "default" | "blue" | "green";
  };
  disableToggle?: boolean;
}

export function ThemeProvider({
  children,
  manualTheme,
  disableToggle = false,
  ...props
}: ThemeProviderProps) {
  const themeProps =
    disableToggle && manualTheme
      ? { ...props, forcedTheme: manualTheme.mode || "system" }
      : props;

  return (
    <>
      {disableToggle &&
        manualTheme?.colorTheme &&
        manualTheme.colorTheme !== "default" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function() {
                try {
                  var colorTheme = '${manualTheme.colorTheme}';
                  document.documentElement.classList.remove('theme-blue', 'theme-green');
                  if (colorTheme !== 'default') {
                    document.documentElement.classList.add('theme-' + colorTheme);
                  }
                } catch (e) {}
              })();
            `,
            }}
          />
        )}
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </>
  );
}
