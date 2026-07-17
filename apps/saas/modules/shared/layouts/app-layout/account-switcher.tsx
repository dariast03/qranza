import { useState } from "react";

import { BadgeCheck, Bell, Check, CreditCard, LogOut } from "lucide-react";

import { useTranslations } from "@i18n/intl";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@repo/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { getInitials } from "@shared/lib/utils";
import { cn } from "@repo/ui";

export function AccountSwitcher({
	users,
}: {
	readonly users: ReadonlyArray<{
		readonly id: string;
		readonly name: string;
		readonly email: string;
		readonly avatar: string;
		readonly role: string;
	}>;
}) {
	const t = useTranslations();
	const [activeUser, setActiveUser] = useState(users[0]);

	if (!activeUser) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				nativeButton={false}
				render={<Avatar className="size-9 rounded-lg" />}
			>
				<AvatarImage
					src={activeUser.avatar || undefined}
					alt={activeUser.name}
				/>
				<AvatarFallback>{getInitials(activeUser.name)}</AvatarFallback>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="min-w-56 space-y-1 rounded-lg"
				side="bottom"
				align="end"
				sideOffset={4}
			>
				{users.map((user) => (
					<DropdownMenuItem
						key={user.email}
						className={cn(
							"p-0",
							user.id === activeUser.id && "bg-accent/50",
						)}
						aria-current={
							user.id === activeUser.id ? "true" : undefined
						}
						onClick={() => setActiveUser(user)}
					>
						<div className="flex w-full items-center gap-2 px-1 py-1.5">
							<Avatar className="size-9 rounded-lg">
								<AvatarImage
									src={user.avatar || undefined}
									alt={user.name}
								/>
								<AvatarFallback>
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
							<div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{user.name}
								</span>
								<span className="truncate text-xs capitalize">
									{user.role}
								</span>
							</div>
							<span
								className={cn(
									"mr-1 flex size-5 items-center justify-center rounded-full text-primary opacity-0",
									user.id === activeUser.id && "opacity-100",
								)}
							>
								<Check aria-hidden="true" />
							</span>
						</div>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<BadgeCheck />
						{t("app.navUser.account")}
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CreditCard />
						{t("app.navUser.billing")}
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Bell />
						{t("app.navUser.notifications")}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<LogOut />
					{t("app.navUser.logOut")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
