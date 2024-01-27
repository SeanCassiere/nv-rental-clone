import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_auth/settings-temp/application-configuration/permissions-and-roles')({
  component: () => <div>Hello /_auth/settings-temp/application-configuration/permissions-and-roles!</div>
})