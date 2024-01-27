import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/settings-temp/profile')({
  component: () => <div>Hello /_auth/settings-temp/profile!</div>
})