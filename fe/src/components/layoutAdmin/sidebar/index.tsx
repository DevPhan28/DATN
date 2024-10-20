import { IconHome } from '@/components/icon.tsx';
import { ArrowRightOnRectangle, CogSixTooth, Key, Tag } from '@medusajs/icons';
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
    icon: <Tag />,
    href: '/product-category',
  },
];

const menuAccount: MenuItem[] = [
  {
    id: 1,
    name: 'User Account',
    icon: <Key />,
    href: '/user-account',
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
      <img src="/blueberry-logo.png" alt="logo" width={224} height={53} />
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
      <div className="absolute bottom-6 w-fit">
        <button
          type="button"
          className="flex w-full items-center rounded-md px-2 py-1.5 font-medium text-ui-fg-subtle hover:bg-ui-bg-base-hover"
        >
          <div className="flex items-center gap-2">
            <ArrowRightOnRectangle />
            Log out
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
