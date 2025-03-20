import React from 'react';

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null],
) {
  return React.useReducer(
    (_state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action],
    initialValue
  )as UseStateHook<T>;
}

export async function setStorageItemAsync(key: string, value: unknown | null) {
    try {
        if (value === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (e) {
        console.error('Local storage is unavailable:', e);
    }
}

export function useStorageState<T>(key: string): UseStateHook<T> {
  // Public
  const [state, setState] = useAsyncState<T>();
  console.log({sessionFromuseAsyncState: state})

  // Get
  React.useEffect(() => {
    try {
        const rawValue = localStorage.getItem(key);
        if (typeof localStorage !== 'undefined' && rawValue) {
            const valueJson = JSON.parse(rawValue); 
            setState(valueJson);
        } else {
            setState(null);
        }
    } catch (e) {
        console.error('Local storage is unavailable:', e);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Set
  const setValue = React.useCallback(
    (value: T | null) => {
      setState(value);
      setStorageItemAsync(key, value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key]
  );

  return [state, setValue];
}
