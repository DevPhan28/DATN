import { CategoriesIcon, IconHome, StoreIcon } from '@/components/icon.tsx';
import { ArrowDownLeft, Pencil, ReceiptPercent, Tag } from '@medusajs/icons';
import ItemSidebar from './item-sidebar';

const menuItems: MenuItem[] = [
  {
    id: 1,
    icon: <IconHome />,
    name: 'Bảng điều khiển',
    href: '/dashboard',
  },
];

const menuProducts: MenuItem[] = [
  {
    id: 1,
    name: 'Danh sách sản phẩm',
    icon: <Tag />,
    href: '/dashboard/products',
  },
  {
    id: 1,
    name: 'Danh mục sản phẩm',
    icon: <CategoriesIcon />,
    href: '/dashboard/category',
  },
];

const menuOders: MenuItem[] = [
  {
    id: 1,
    name: 'Danh sách đơn hàng',
    icon: <StoreIcon />,
    href: '/dashboard/order',
  },
];
const menuCoupon: MenuItem[] = [
  {
    id: 1,
    name: 'Danh sách mã giảm giá',
    icon: <ReceiptPercent />,
    href: '/dashboard/coupon',
  },
];
const menuBlog: MenuItem[] = [
  {
    id: 1,
    name: 'Danh sách blog',
    icon: <Pencil />,
    href: '/dashboard/blog',
  },
];
const menuMessenger: MenuItem[] = [
  {
    id: 1,
    name: 'Trò chuyện',
    icon: <Pencil />,
    href: '/dashboard/messenger',
  },
];
const menuAccount: MenuItem[] = [
  {
    id: 1,
    name: 'Website',
    icon: <ArrowDownLeft />,
    href: '/',
  },
];

const Sidebar = () => {
  return (
    <aside className="border-cool-gray-20 relative max-h-screen min-w-fit space-y-4 overflow-hidden border-r bg-ui-bg-base px-4 py-6">
      <img src="/fasion zone.png" alt="logo" width={150} height={53} />
      <nav className="space-y-4">
        <ul>
          {menuItems.map(item => (
            <ItemSidebar
              key={item.id}
              href={item.href}
              id={item.id}
              name={item.name}
              icon={item.icon}
            />
          ))}
        </ul>
        <section className="space-y-1">
          <header className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Sản phẩm
          </header>
          <div>
            {menuProducts.map(item => (
              <ItemSidebar
                key={item.id}
                href={item.href}
                id={item.id}
                name={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </section>
        <section className="space-y-1">
          <header className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Đơn hàng
          </header>
          <div>
            {menuOders.map(item => (
              <ItemSidebar
                key={item.id}
                href={item.href}
                id={item.id}
                name={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </section>
        <section className="space-y-1">
          <header className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Mã giảm giá
          </header>
          <div>
            {menuCoupon.map(item => (
              <ItemSidebar
                key={item.id}
                href={item.href}
                id={item.id}
                name={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </section>
        <section className="space-y-1">
          <header className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Blog
          </header>
          <div>
            {menuBlog.map(item => (
              <ItemSidebar
                key={item.id}
                href={item.href}
                id={item.id}
                name={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </section>
        <section className="space-y-1">
          <header className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Blog
          </header>
          <div>
            {menuMessenger.map(item => (
              <ItemSidebar
                key={item.id}
                href={item.href}
                id={item.id}
                name={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </section>
        <div className="space-y-1">
          <div className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Khác
          </div>
          <div>
            {menuAccount.map(item => (
              <ItemSidebar
                key={item.id}
                href={item.href}
                id={item.id}
                name={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
