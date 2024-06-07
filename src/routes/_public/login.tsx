import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="grid h-dvh w-dvw grid-cols-2">
      <section>Hello /_public/login!</section>
      <section>Marketing content</section>
    </main>
  );
}
