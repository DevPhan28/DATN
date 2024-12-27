import { IconHome, CategoriesIcon, StoreIcon } from '@/components/icon.tsx';
import {
  ArrowRightOnRectangle,
  CogSixTooth,
  Key,
  Pencil,
  ReceiptPercent,
  Tag,
  Users,
} from '@medusajs/icons';
import ItemSidebar from './item-sidebar';

const menuItems: MenuItem[] = [
  {
    id: 1,
    icon: <IconHome />,
    name: 'Dashboard',
    href: '/dashboard',
  },
  // {
  //     id: 2,
  //     icon: <Star />,
  //     name: 'Brand',
  //     href: '/brand',
  // },
  // {
  //     id: 3,
  //     icon: <UserGroup />,
  //     name: 'Human Resources',
  //     href: '/human-resources',
  // },
  // {
  //     id: 4,
  //     icon: <User />,
  //     name: 'Sale records',
  //     href: '/sale-records',
  // },
  // {
  //     id: 5,
  //     icon: <DocumentText />,
  //     name: 'Sale reports',
  //     href: '/sale-reports',
  // },
];

const menuProducts: MenuItem[] = [
  {
    id: 1,
    name: 'Product List',
    icon: <Tag />,
    href: '/dashboard/products',
  },
  {
    id: 1,
    name: 'Product Category',
    icon: <CategoriesIcon />,
    href: '/dashboard/category',
  },
];

const menuOders: MenuItem[] = [
  {
    id: 1,
    name: 'Order List',
    icon: <StoreIcon />,
    href: '/dashboard/order',
  },
];
const menuCoupon: MenuItem[] = [
  {
    id: 1,
    name: 'Coupon List',
    icon: <ReceiptPercent />,
    href: '/dashboard/coupon',
  },
];
const menuBlog: MenuItem[] = [
  {
    id: 1,
    name: 'Blog List',
    icon: <Pencil />,
    href: '/dashboard/blog',
  },
];

// const menuUsers: MenuItem[] = [
//   {
//     id: 1,
//     name: 'Users ',
//     icon: <Users />,
//     href: '/dashboard/users',
//   },
// ];
const menuAccount: MenuItem[] = [
  {
    id: 1,
    name: 'User Account',
    icon: <Key />,
    href: '/dashboard/users',
  },
  {
    id: 1,
    name: 'Settings',
    icon: <CogSixTooth />,
    href: '/settings',
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
            Product
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
            Oders
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
        {/* <section className="space-y-1">
          <header className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Users List
          </header>
          <div>
            {menuUsers.map(item => (
              <ItemSidebar
                key={item.id}
                href={item.href}
                id={item.id}
                name={item.name}
                icon={item.icon}
              />
            ))}
          </div>
        </section> */}
        <section className="space-y-1">
          <header className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Coupon
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
        <div className="space-y-1">
          <div className="py-1.5 pl-2 text-xs font-medium text-ui-fg-muted">
            Account
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
