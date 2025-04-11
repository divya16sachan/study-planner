export function hslToHex(hslString) {
  // Handle empty string case (like in border.fg)
  if (!hslString || hslString.trim() === "") return "";

  // Extract the numerical values from the string
  const values = hslString.split(/\s+/).map((val) => {
    if (val.includes("%")) {
      return parseFloat(val) / 100;
    }
    return parseFloat(val);
  });

  // If we didn't get exactly 3 values, return a fallback
  if (values.length !== 3 || values.some(isNaN)) {
    console.warn(`Invalid HSL value: ${hslString}`);
    return "#000000";
  }

  let [h, s, l] = values;

  // Normalize values
  h = (((h % 360) + 360) % 360) / 360; // Ensure hue is between 0-1
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));

  // HSL to RGB conversion
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB to HEX
  const toHex = (x) => {
    const hex = Math.round(Math.min(1, Math.max(0, x)) * 255)
      .toString(16)
      .padStart(2, "0");
    return hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToHSL(hex) {
  // Remove hash if present
  hex = hex.replace("#", "");

  // Parse r, g, b
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}