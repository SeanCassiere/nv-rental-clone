import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/(fleet)/fleet/$vehicleId/_details')({
  component: () => <div>Hello /_auth/(fleet)/fleet/$vehicleId/_details!</div>
})