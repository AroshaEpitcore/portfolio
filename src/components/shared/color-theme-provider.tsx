"use client";

import { useEffect } from "react";

// Color stops for smooth transition
const colorStops = [
  250, // Purple
  280, // Violet
  320, // Pink/Magenta
  350, // Rose
  200, // Cyan
  170, // Teal
  220, // Blue
  250, // Back to Purple
];

export function ColorThemeProvider() {
  useEffect(() => {
    let animationFrame: number;
    let startTime: number | null = null;
    const duration = 20000; // 20 seconds for full cycle

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = (elapsed % duration) / duration;

      // Calculate which color stops we're between
      const totalStops = colorStops.length - 1;
      const exactIndex = progress * totalStops;
      const currentIndex = Math.floor(exactIndex);
      const nextIndex = Math.min(currentIndex + 1, totalStops);
      const localProgress = exactIndex - currentIndex;

      // Interpolate between color stops
      const currentHue = colorStops[currentIndex];
      const nextHue = colorStops[nextIndex];

      // Handle hue wrapping for smooth transitions
      let hue: number;
      if (Math.abs(nextHue - currentHue) > 180) {
        // Wrap around
        if (nextHue > currentHue) {
          hue = currentHue + (nextHue - 360 - currentHue) * localProgress;
          if (hue < 0) hue += 360;
        } else {
          hue = currentHue + (nextHue + 360 - currentHue) * localProgress;
          if (hue >= 360) hue -= 360;
        }
      } else {
        hue = currentHue + (nextHue - currentHue) * localProgress;
      }

      // Update CSS variable
      document.documentElement.style.setProperty("--hue", String(Math.round(hue)));

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return null;
}
