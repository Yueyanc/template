import { RouterProvider } from '@tanstack/react-router'
import { router } from '@/router'

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
