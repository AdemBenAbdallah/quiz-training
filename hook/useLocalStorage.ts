import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY!;

// Helpers
export function encryptData<T>(data: T): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

function decryptData<T>(ciphertext: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? (JSON.parse(decrypted) as T) : null;
  } catch (e) {
    console.warn("Decryption failed:", e);
    return null;
  }
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T | null>(null);

  // Load on mount
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      const value = item ? decryptData<T>(item) : initialValue;
      setStoredValue(value);
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      setStoredValue(initialValue);
    }
  }, [key]);

  // Save whenever value changes
  useEffect(() => {
    if (storedValue !== null) {
      try {
        localStorage.setItem(key, encryptData(storedValue));
      } catch (error) {
        console.warn(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}

export default useLocalStorage;
