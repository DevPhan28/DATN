import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <h1>tuânnh</h1>
    </div>
  )
}
