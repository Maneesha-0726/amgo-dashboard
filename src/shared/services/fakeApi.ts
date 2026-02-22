export function fakeApi<T>(
  data: T,
  delay = 800,
  key?: string
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (key) {
        localStorage.setItem(key, JSON.stringify(data));
      }
      resolve(data);
    }, delay);
  });
}

export function getFromStorage<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}