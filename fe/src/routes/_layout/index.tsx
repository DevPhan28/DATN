import CardProduct from '@/components/cardProduct';
import Category from '@/components/Category';
import Collection from '@/components/Collection';
import FeaturedProducts from '@/components/featuredProducts';
import Hotlist from '@/components/Hotlist';
import Instagram from '@/components/instagram';
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
      <Hotlist />
      {/* <Category /> */}
      <CardProduct />
      <Collection />
      <FeaturedProducts />
      <Instagram />
    </>
  );
}
