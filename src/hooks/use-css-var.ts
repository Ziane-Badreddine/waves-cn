import { useEffect, useState } from "react";

export function useCssVar(value: string): string {
  const [resolved, setResolved] = useState(value);

  useEffect(() => {
    // Only resolve if the value looks like a CSS variable
    const match = value.match(/^var\((--[^)]+)\)$/);
    if (!match) {
      setResolved(value);
      return;
    }
    const varName = match[1];
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    // shadcn stores values as bare HSL channels e.g. "222.2 47.4% 11.2%"
    // Canvas needs a full color string — wrap in hsl() if needed
    const isHslChannels = /^[\d.]+ [\d.]+% [\d.]+%$/.test(raw);
    setResolved(raw ? (isHslChannels ? `hsl(${raw})` : raw) : value);
  }, [value]);

  return resolved;
}
