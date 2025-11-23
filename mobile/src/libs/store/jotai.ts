import * as SecureStore from "expo-secure-store";
import { atom } from "jotai";

export const atomWithSecureStore = <T>(key: string, initialValue: T) => {
  const getInitialValue = () => {
    const storedValue = SecureStore.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  };
  const baseAtom = atom(getInitialValue());
  const derivedAtom = atom(
    (get) => get(baseAtom),
    (_get, set, update) => {
      set(baseAtom, update);
      if (update === null) {
        void SecureStore.deleteItemAsync(key);
      } else {
        SecureStore.setItem(key, JSON.stringify(update));
      }
    },
  );
  return derivedAtom;
};
