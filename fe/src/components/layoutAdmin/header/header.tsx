import { Input } from '@medusajs/ui';
import ProfileHeader from '../../user/profile-header';

type HeaderProps = {
  title: string;
  pathname: string;
};

const Header = ({ title, pathname }: HeaderProps) => {
  return (
    <div className="flex items-center justify-between border-b border-ui-border-base bg-ui-bg-base px-6 py-3">
      <p className="text-cool-gray-90 text-xl font-medium">{title}</p>
      <div className="flex items-center gap-5">
        {pathname === '/' && (
          <div className="w-[240px]">
            <Input
              placeholder="Tìm kiếm"
              id="search-input"
              className="rounded-md bg-ui-bg-field"
              size="small"
            />
          </div>
        )}

        <ProfileHeader />
      </div>
    </div>
  );
};

export default Header;
