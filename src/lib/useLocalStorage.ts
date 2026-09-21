/**
 * useLocalStorage / useStorage Hook
 *
 * Custom hook for persisting editor state to IndexedDB with localStorage migration.
 * Handles serialization, deserialization, and auto-save functionality.
 */

import { useEffect, useCallback, useRef } from "react";
import { get, set, del } from "idb-keyval";
import type { Project } from "../types";

export interface PersistedEditorState {
  version: number;
  projects: Project[];
  activeProjectId: string;
  lastSaved: number;
}

const CURRENT_VERSION = 2;
const STORAGE_KEY = "app-screenshot-editor-state";
const AUTO_SAVE_DELAY = 1000;

/**
 * Loads persisted state asynchronously from IndexedDB.
 * Falls back to localStorage for seamless migration.
 */
export const loadPersistedStateAsync = async (): Promise<PersistedEditorState | null> => {
  try {
    let state = await get<PersistedEditorState>(STORAGE_KEY);

    // Migration fallback
    if (!state) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PersistedEditorState;
        if (parsed.version === CURRENT_VERSION && parsed.projects && Array.isArray(parsed.projects)) {
          state = parsed;
          // Save back to IDB
          await set(STORAGE_KEY, state);
          console.log("Successfully migrated state from localStorage to IndexedDB.");
        }
      }
    }

    if (!state) return null;

    if (state.version !== CURRENT_VERSION) {
      console.warn(`Editor state version mismatch: ${state.version} !== ${CURRENT_VERSION}. Resetting state.`);
      return null;
    }

    if (!state.projects || !Array.isArray(state.projects)) {
      return null;
    }

    return state;
  } catch (error) {
    console.error("Failed to load editor state from IndexedDB:", error);
    return null;
  }
};

/**
 * Saves state asynchronously to IndexedDB.
 */
export const savePersistedStateAsync = async (state: PersistedEditorState): Promise<void> => {
  try {
    await set(STORAGE_KEY, state);
  } catch (error) {
    console.error("Failed to save editor state to IndexedDB:", error);
  }
};

export const clearPersistedStateAsync = async (): Promise<void> => {
  try {
    await del(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear editor state:", error);
  }
};

interface UseEditorPersistenceOptions {
  projects: Project[];
  activeProjectId: string;
  isLoaded: boolean;
}

/**
 * useEditorPersistence - Auto-saves editor state to IndexedDB
 */
export const useEditorPersistence = ({
  projects,
  activeProjectId,
  isLoaded,
}: UseEditorPersistenceOptions): void => {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveState = useCallback(() => {
    const state: PersistedEditorState = {
      version: CURRENT_VERSION,
      projects,
      activeProjectId,
      lastSaved: Date.now(),
    };
    savePersistedStateAsync(state);
  }, [projects, activeProjectId]);

  useEffect(() => {
    // Only save if the data has been loaded from IDB first
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(saveState, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveState, isLoaded]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isLoaded) {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveState();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveState, isLoaded]);
};
