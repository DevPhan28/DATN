import CardProduct from '@/components/cardProduct';
import Category from '@/components/Category';
import FeaturedProducts from '@/components/featuredProducts';
import Slider from '@/components/Slider';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <>
      {/* <Button onClick={() => navigate({ to: '/checkout' })}>Click</Button> */}

      <Slider />
      <FeaturedProducts />
      <Category />
      <CardProduct />
    </>
  );
}
