import { Outlet } from '@tanstack/react-router'

export function Home() {
  return (
    <div className="w-screen h-screen">
      <Outlet />
    </div>
  )
}
