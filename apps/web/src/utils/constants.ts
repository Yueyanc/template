declare const globalThis: {
  window: Window & {
    ELECTRON_CONST: {
      IN_ELECTRON: boolean
    }
  }
}
export const IN_ELECTRON = !!globalThis.window.ELECTRON_CONST?.IN_ELECTRON
