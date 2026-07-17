import { Link } from "@tanstack/react-router";

import {
	Command,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { config } from "@config";
import { rootUser } from "@shared/data/users";
import { getSidebarItems } from "./sidebar-items";
import { usePreferencesStore } from "@shared/stores/preferences/preferences-provider";
import { useTranslations } from "@i18n/intl";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarSupportCard } from "./sidebar-support-card";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const t = useTranslations();
	const { sidebarVariant, sidebarCollapsible, isSynced } =
		usePreferencesStore(
			useShallow((s) => ({
				sidebarVariant: s.values.sidebar_variant,
				sidebarCollapsible: s.values.sidebar_collapsible,
				isSynced: s.isSynced,
			})),
		);

	const variant = isSynced ? sidebarVariant : props.variant;
	const collapsible = isSynced ? sidebarCollapsible : props.collapsible;
	const sidebarItems = getSidebarItems(t);

	return (
		<Sidebar {...props} variant={variant} collapsible={collapsible}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<Link to="/app" />}
						>
							<Command />
							<span className="font-semibold text-base">
								{config.appName}
							</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={sidebarItems} />
			</SidebarContent>
			<SidebarFooter>
				<SidebarSupportCard />
				<NavUser user={rootUser} />
			</SidebarFooter>
		</Sidebar>
	);
}
