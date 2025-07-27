import { useEffect, useState } from "react";

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T | null>(null);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      const value = item ? (JSON.parse(item) as T) : initialValue;
      setStoredValue(value);
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
    }
  }, [key]);

  useEffect(() => {
    if (storedValue !== null) {
      try {
        localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
