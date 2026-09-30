// Node 26 expose global `localStorage` experimental (chỉ hoạt động với flag
// --localstorage-file) và nó ghi đè localStorage của jsdom trong môi trường
// test → bare `localStorage` trong code FE bị undefined. Polyfill tối thiểu
// theo spec Web Storage để test chạy giống browser.
class MemoryStorage {
  private map = new Map<string, string>()

  get length(): number {
    return this.map.size
  }

  key(index: number): string | null {
    return Array.from(this.map.keys())[index] ?? null
  }

  getItem(key: string): string | null {
    return this.map.has(key) ? this.map.get(key)! : null
  }

  setItem(key: string, value: string): void {
    this.map.set(String(key), String(value))
  }

  removeItem(key: string): void {
    this.map.delete(key)
  }

  clear(): void {
    this.map.clear()
  }
}

Object.defineProperty(globalThis, 'localStorage', {
  value: new MemoryStorage(),
  configurable: true,
  writable: true,
})
