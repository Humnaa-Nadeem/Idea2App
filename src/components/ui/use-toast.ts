import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

let memoryState: Toast[] = [];
let listeners: React.Dispatch<React.SetStateAction<Toast[]>>[] = [];

export const toast = ({ title, description, type = 'info' }: Omit<Toast, 'id'>) => {
  const id = uuidv4();
  const newToast = { id, title, description, type };
  memoryState = [...memoryState, newToast];
  listeners.forEach((listener) => listener(memoryState));

  setTimeout(() => {
    memoryState = memoryState.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(memoryState));
  }, 3000);
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(memoryState);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return { toasts, toast };
};
