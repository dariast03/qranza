import type { CSSProperties, PropsWithChildren } from "react";

import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { users } from "@shared/data/users";
import { cn } from "@repo/ui/lib";
import { getDashboardLayout } from "@server/server-actions";
import { LocaleSwitch } from "@shared/components/locale-switch";

import { AccountSwitcher } from "./account-switcher";
import { AppSidebar } from "./app-sidebar";
import { LayoutControls } from "./layout-controls";
import { SearchDialog } from "./search-dialog";
import { ThemeSwitcher } from "./theme-switcher";

type AppLayoutProps = {
	defaultOpen?: boolean;
	variant?: "sidebar" | "inset" | "floating";
	collapsible?: "offcanvas" | "icon" | "none";
} & PropsWithChildren;

export default function AppLayout({
	defaultOpen,
	variant,
	collapsible,
	children,
}: AppLayoutProps) {
	return (
		<SidebarProvider
			defaultOpen={defaultOpen}
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 68)",
				} as CSSProperties
			}
		>
			<AppSidebar variant={variant} collapsible={collapsible} />
			<SidebarInset
				className={cn(
					"[html[data-content-layout=centered]_&>*]:mx-auto",
					"[html[data-content-layout=centered]_&>*]:w-full",
					"[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
					"peer-data-[variant=inset]:border",
					"[--dashboard-header-height:--spacing(12)]",
					"min-w-0 overflow-x-clip",
				)}
			>
				<header
					className={cn(
						"flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
						// Handle sticky navbar style with conditional classes so blur, background, z-index, and rounded corners remain consistent across all SidebarVariant layouts.
						"[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
					)}
				>
					<div className="flex w-full items-center justify-between px-4 lg:px-6">
						<div className="flex items-center gap-1 lg:gap-2">
							<SidebarTrigger className="-ml-1" />
							<Separator
								orientation="vertical"
								className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
							/>
							<SearchDialog />
						</div>
						<div className="flex items-center gap-2">
							<LayoutControls />
							<ThemeSwitcher />
							<LocaleSwitch />
							<AccountSwitcher users={users} />
						</div>
					</div>
				</header>
				{/* Pages can set data-content-padding="false" to render full-bleed app layouts. */}
				<div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
