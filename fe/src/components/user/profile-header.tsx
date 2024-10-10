import { Avatar } from '@medusajs/ui'
import { IconBellAlert } from '../icon'

const ProfileHeader = () => {
    return (
        <div className="flex items-center gap-5">
            <button type="button">
                <IconBellAlert />
            </button>
            <button type="button" className="flex items-center gap-3 text-left">
                <Avatar
                    variant="squared"
                    src="https://avatars.githubusercontent.com/u/1065620=4"
                    fallback="M"
                />
                <div>
                    <p className="txt-compact-small-plus text-ui-code-bg-base">
                        Mathilda Bell
                    </p>
                    <p className="txt-compact-xsmall text-ui-code-icon">Admin</p>
                </div>
            </button>
        </div>
    )
}

export default ProfileHeader
