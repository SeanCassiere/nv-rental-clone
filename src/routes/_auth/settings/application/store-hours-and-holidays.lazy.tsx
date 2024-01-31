import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/settings/application/store-hours-and-holidays')({
  component: () => <div>Hello /_auth/settings/application/store-hours-and-holidays!</div>
})