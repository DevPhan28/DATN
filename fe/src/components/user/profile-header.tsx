import { Avatar, DropdownMenu } from '@medusajs/ui';

const ProfileHeader = () => {
  return (
    <div className="hidden items-center gap-5 lg:flex">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <button type="button" className="flex items-center gap-3 text-left">
            <Avatar src="/admin.jpg" fallback="M" />
            <div>
              <p className="txt-compact-small-plus text-ui-code-bg-base">
                Admin
              </p>
              <p className="text-ui-code-icon txt-compact-xsmall"></p>
            </div>
          </button>
        </DropdownMenu.Trigger>
      </DropdownMenu>
    </div>
  );
};

export default ProfileHeader;
