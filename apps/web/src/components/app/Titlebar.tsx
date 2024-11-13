import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
} from 'react-icons/vsc'
import { useAtom } from 'jotai'
import { Event } from 'electron-bridge-ipc'
import { useAsyncEffect } from 'ahooks'
import { Button } from '../ui/button'
import { isMaximizedAtom, servicesAtom } from '@/stores/service'

export function Titlebar() {
  const [isMaximized, setIsMaximized] = useAtom(isMaximizedAtom)
  // @ts-ignore
  const [{ WindowService }] = useAtom(servicesAtom)
  async function handleMaximizeClick() {
    if (!isMaximized) {
      await WindowService?.maximize(window.ELECTRON_CONFIG.WINDOW_ID)
    }
    else {
      await WindowService?.unmaximize(window.ELECTRON_CONFIG.WINDOW_ID)
    }
  }

  async function handleMinimizeClick() {
    await WindowService?.minimize(window.ELECTRON_CONFIG.WINDOW_ID)
  }
  async function handleCloseClick() {
    await WindowService?.close(window.ELECTRON_CONFIG.WINDOW_ID)
  }

  useAsyncEffect(async () => {
    const isMaximized = await WindowService.isMaximized(
      window.ELECTRON_CONFIG.WINDOW_ID,
    )
    setIsMaximized(isMaximized)
    const onMaximizeEvent = Event.filter(
      WindowService.onMaximize,
      id => id === window.ELECTRON_CONFIG.WINDOW_ID,
    )
    const onUnmaximizeEvent = Event.filter(
      WindowService.onUnmaximize,
      id => id === window.ELECTRON_CONFIG.WINDOW_ID,
    )
    onUnmaximizeEvent(() => {
      setIsMaximized(false)
    })
    onMaximizeEvent(() => {
      setIsMaximized(true)
    })
  }, [])

  return (
    <div className="drag-region flex items-center justify-end">
      <Button
        id="minimize_btn"
        onClick={handleMinimizeClick}
        variant="ghost"
        className="no-drag-region"
      >
        <VscChromeMinimize />
      </Button>
      <Button
        id="maximize_btn"
        onClick={handleMaximizeClick}
        variant="ghost"
        className="no-drag-region"
      >
        {isMaximized ? <VscChromeRestore /> : <VscChromeMaximize />}
      </Button>
      <Button
        id="close_btn"
        onClick={handleCloseClick}
        variant="ghost"
        className="no-drag-region hover:bg-red-500 rounded-none rounded-tr-sm"
      >
        <VscChromeClose />
      </Button>
    </div>
  )
}
