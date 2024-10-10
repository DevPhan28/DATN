import { Link } from '@tanstack/react-router'

const ItemSidebar = ({ href, id, name, icon }: MenuItem) => {
    return (
        <li className="list-none">
            <Link
                to={href}
                className="txt-compact-small-plus flex w-full items-center rounded-md border border-ui-bg-base px-2 py-1.5 text-ui-fg-subtle hover:bg-ui-bg-base-hover [&.active]:border-ui-border-base [&.active]:bg-ui-bg-base-pressed"
            >
                <div className="flex w-full items-center justify-between">
                    <div className="flex gap-2">
                        {icon}
                        {name}
                    </div>
                    <div>{id === 2 && <p className="text-ui-fg-muted">12</p>}</div>
                </div>
            </Link>
        </li>
    )
}

export default ItemSidebar
