import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
  variable: {
    card: {
      bg: { defaultColor: "240 10% 3.9%", property: "--card" },
      fg: { defaultColor: "0 0% 98%", property: "--card-foreground" },
    },
    popover: {
      bg: { defaultColor: "240 10% 3.9%", property: "--popover" },
      fg: { defaultColor: "0 0% 98%", property: "--popover-foreground" },
    },
    primary: {
      bg: { defaultColor: "0 0% 98%", property: "--primary" },
      fg: { defaultColor: "240 5.9% 10%", property: "--primary-foreground" },
    },
    secondary: {
      bg: { defaultColor: "240 3.7% 15.9%", property: "--secondary" },
      fg: { defaultColor: "0 0% 98%", property: "--secondary-foreground" },
    },
    muted: {
      bg: { defaultColor: "240 3.7% 15.9%", property: "--muted" },
      fg: { defaultColor: "240 5% 64.9%", property: "--muted-foreground" },
    },
    accent: {
      bg: { defaultColor: "240 3.7% 15.9%", property: "--accent" },
      fg: { defaultColor: "0 0% 98%", property: "--accent-foreground" },
    },
    destructive: {
      bg: { defaultColor: "0 62.8% 30.6%", property: "--destructive" },
      fg: { defaultColor: "0 0% 98%", property: "--destructive-foreground" },
    },
    background: {
      bg: {
        noLabel: true,
        defaultColor: "240 10% 3.9%",
        property: "--background",
      },
    },
    foreground: {
      bg: {
        noLabel: true,
        defaultColor: "240 10% 3.9%",
        property: "--background",
      },
    },
    border: {
      bg: {
        noLabel: true,
        defaultColor: "240 3.7% 15.9%",
        property: "--border",
      },
    },
    input: {
      bg: {
        noLabel: true,
        defaultColor: "240 3.7% 15.9%",
        property: "--input",
      },
    },
    ring: {
      bg: { noLabel: true, defaultColor: "240 4.9% 83.9%", property: "--ring" },
    },
  },

  updateVariable: ()=>{
    const root = document.documentElement;
    const state = get().variable;
    const updated = {};

    for(const key in state){
        const themeGroup = state[key];
        updated[key] = {};

        for(const type in themeGroup){
            const {property, noLabel} = themeGroup[type];
            const computedValue = getComputedStyle(root).getPropertyValue(property).trim();

            updated[key][type] = {
                ...themeGroup[type],
                defaultColor: computedValue
            }
        }
    }

    set({variable: updated})
  }
}));
