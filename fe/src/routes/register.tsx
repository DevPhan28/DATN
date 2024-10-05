import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
  return (
    <div>
      <h1>Tuânnh</h1>
    </div>
  )

}
