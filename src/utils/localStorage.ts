export const setLocalStorageItem = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocalStorageItem = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : data
}
