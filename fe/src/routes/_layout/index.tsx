import CardProduct from '@/components/cardProduct';
import Category from '@/components/Category';
import FeaturedProducts from '@/components/featuredProducts';
import Slides from '@/components/slides';
import { createFileRoute, useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_layout/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <>
      <Slides />
      <Category />
      <CardProduct />
      <FeaturedProducts />
    </>
  );
}
