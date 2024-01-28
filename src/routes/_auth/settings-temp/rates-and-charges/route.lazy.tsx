import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/settings-temp/rates-and-charges')({
  component: () => <div>Hello /_auth/settings-temp/rates-and-charges!</div>
})