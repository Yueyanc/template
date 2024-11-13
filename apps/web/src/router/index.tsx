import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { Index } from '@/pages/index'
import { Home } from '@/pages/Home'

const rootRoute = createRootRoute({
  component: () => <Index />,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: () => <Home />,
  path: '/',
})

const routeTree = rootRoute.addChildren([homeRoute])

export const router = createRouter({ routeTree })
