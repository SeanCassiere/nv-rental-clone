import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/settings-temp/application-configuration/locations')({
  component: () => <div>Hello /_auth/settings-temp/application-configuration/locations!</div>
})