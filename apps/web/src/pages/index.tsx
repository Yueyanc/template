import { Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import { IN_ELECTRON } from '@/utils/constants'
import { Titlebar } from '@/components/app/Titlebar'

export function Index() {
  return (
    <div>
      <Suspense fallback={<div>loadding...</div>}>
        <div className="w-screen h-screen">
          {IN_ELECTRON && (
            <div className="drag-region w-full absolute right-0 top-0 h-12 z-50">
              <Titlebar />
            </div>
          )}
          <Outlet />
        </div>
      </Suspense>
    </div>
  )
}
