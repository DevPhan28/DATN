import { Button } from '@medusajs/ui';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <>
      <Button onClick={() => navigate({ to: '/checkout' })}>Click</Button>
      <h1>tuan</h1>
    </>
  );
}
