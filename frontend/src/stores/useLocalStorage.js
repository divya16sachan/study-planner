import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLocalStorage = create(
  persist(
    (set, get) => ({
      //Collections state
      openedCollections: {},
      toggleCollection: (collectionId, isExpanded) => {
        set({
          openedCollections: {
            ...get().openedCollections,
            [collectionId]: isExpanded,
          },
        });
      },
      collapseAll: () => {
        set({ openedCollections: {} });
      },
      expandAll: (collectionIds) => {
        const expandedState = collectionIds.reduce(
          (acc, id) => (acc[id] = true),
          {}
        );
        set({ openedCollections: expandedState });
      },

      // Theme state
      theme: "Zinc",
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        document.documentElement.setAttribute(
          "data-theme",
          newTheme.toLowerCase()
        );
      },
    }),
    {
      name: "local-storage-state", // localStorage key
      getStorage: () => localStorage, // specify localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.theme) {
          document.documentElement.setAttribute("data-theme", state.theme);
        }
      },
    }
  )
);
