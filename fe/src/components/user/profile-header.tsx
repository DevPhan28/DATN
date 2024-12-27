import { Avatar, DropdownMenu } from '@medusajs/ui';
import { ArrowRightOnRectangle, User } from '@medusajs/icons';
import { Link } from '@tanstack/react-router';

const ProfileHeader = () => {
  return (
    <div className="hidden items-center gap-5 lg:flex">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="flex items-center gap-3 text-left">
            <Avatar src="/anh.jpg" fallback="M" />
            <div>
              <p className="txt-compact-small-plus text-ui-code-bg-base">
                Admin
              </p>
              <p className="text-ui-code-icon txt-compact-xsmall"></p>
            </div>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>
            <Link to="/dashboard" className="flex">
              <User className="mr-2" />
              Account Information
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <ArrowRightOnRectangle className="mr-2" />
            Logout
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

export default ProfileHeader;
