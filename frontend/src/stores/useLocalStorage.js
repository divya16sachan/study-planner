import { create } from 'zustand';
import { persist } from 'zustand/middleware'

export const useLocalStorage = create(
    persist(
        (set, get) => ({
            openedCollections: {},
            toggleCollection: (collectionId, isExpanded) => {
                set({
                    openedCollections: {
                        ...get().openedCollections,
                        [collectionId]: isExpanded
                    }
                });
            },
            collapseAll: () => {
                set({ openedCollections: {} });
            },
            expandAll: (collectionIds) => {
                const expandedState = collectionIds.reduce((acc, id) => (
                    acc[id] = true
                ), {})
                set({ openedCollections: expandedState });
            }

        }),
        {
            name: 'openedCollections', // localStorage key
            getStorage: () => localStorage, // specify localStorage
        }
    ),
);