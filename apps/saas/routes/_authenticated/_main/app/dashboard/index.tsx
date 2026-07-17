import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_main/app/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/_main/app/dashboard/"!</div>
}
