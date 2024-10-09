import { useEffect, useState } from 'react'
import viteLogo from '/vite.svg'
import { useService } from 'electron-bridge-ipc/electron-sandbox'
import { IFileSystemService } from '../../electron/src/interfaces/IFileSystemService'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const fileSystemService = useService<IFileSystemService>('fileSystem')
  useEffect(() => {
    fileSystemService.stat('C:\\Users').then((res) => {
      console.log(res)
    })
  }, [])
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="!text-red-700">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is
          {' '}
          {count}
        </button>
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
