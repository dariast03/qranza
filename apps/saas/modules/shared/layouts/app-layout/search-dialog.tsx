import * as React from "react";

import { useNavigate } from "@tanstack/react-router";

import { Search } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@repo/ui/components/command";
import type {
	AppPath,
	NavMainItem,
	NavSubItem,
} from "@shared/navigation/sidebar/sidebar-items";
import { getSidebarItems } from "./sidebar-items";
import { useTranslations } from "@i18n/intl";

type SearchItem = {
	id: string;
	group: string;
	label: string;
	url: AppPath;
	icon?: NavMainItem["icon"];
	disabled?: boolean;
	newTab?: boolean;
};

function flattenSubItems(subItems: NavSubItem[], groupLabel: string): SearchItem[] {
	return subItems.flatMap((sub) => {
		if (sub.subItems) {
			return flattenSubItems(sub.subItems, groupLabel);
		}
		return [{
			id: sub.id,
			group: groupLabel,
			label: sub.title,
			url: sub.url,
			icon: undefined,
			disabled: sub.disabled,
			newTab: sub.newTab,
		}];
	});
}

function buildSearchItems(t: (key: string) => string): SearchItem[] {
	const sidebarGroups = getSidebarItems(t);
	return sidebarGroups.flatMap((group) =>
		group.items.flatMap((item) => {
			if (item.subItems) {
				return item.subItems.flatMap((sub) => {
					if (sub.subItems) {
						return flattenSubItems(sub.subItems, item.title);
					}
					return [{
						id: sub.id,
						group: item.title,
						label: sub.title,
						url: sub.url,
						icon: item.icon,
						disabled: sub.disabled,
						newTab: sub.newTab,
					}];
				});
			}
			return [{
				id: item.id,
				group: group.label ?? "Other",
				label: item.title,
				url: item.url,
				icon: item.icon,
				disabled: item.disabled,
				newTab: item.newTab,
			}];
		}),
	);
}

function getAvailableItems(items: SearchItem[]) {
	return items.filter(
		(item) => !item.disabled && !item.url.includes("coming-soon"),
	);
}

function groupBy(items: SearchItem[]) {
	const groups = [...new Set(items.map((item) => item.group))];
	return groups.map((group) => ({
		group,
		items: items.filter((item) => item.group === group),
	}));
}

export function SearchDialog() {
	const t = useTranslations();
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const navigate = useNavigate();

	const searchItems = React.useMemo(() => buildSearchItems(t), [t]);
	const recommendations = React.useMemo(() => getAvailableItems(searchItems), [searchItems]);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((prev) => !prev);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const handleOpenChange = (value: boolean) => {
		setOpen(value);
		if (!value) setQuery("");
	};

	const handleSelect = (item: SearchItem) => {
		if (item.disabled) return;
		handleOpenChange(false);
		if (item.newTab) {
			window.open(item.url, "_blank", "noopener,noreferrer");
		} else {
			void navigate({ to: item.url });
		}
	};

	const renderGroups = (items: SearchItem[]) =>
		groupBy(items).map(({ group, items: groupItems }, index) => (
			<React.Fragment key={group}>
				{index > 0 && <CommandSeparator />}
				<CommandGroup heading={group}>
					{groupItems.map((item) => (
						<CommandItem
							disabled={item.disabled}
							key={`${group}-${item.id}`}
							value={`${item.group} ${item.label}`}
							onSelect={() => handleSelect(item)}
						>
							<span className="flex min-w-0 items-center gap-2">
								{item.icon && <item.icon />}
								<span className="truncate">{item.label}</span>
							</span>
						</CommandItem>
					))}
				</CommandGroup>
			</React.Fragment>
		));

	return (
		<>
			<Button
				onClick={() => handleOpenChange(true)}
				variant="link"
				className="px-0! font-normal text-muted-foreground hover:no-underline"
			>
				<Search data-icon="inline-start" />
				{t("app.search.label")}
				<kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium text-[10px]">
					<span className="text-xs">⌘</span>J
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={handleOpenChange}>
				<Command>
					<CommandInput
						placeholder={t("app.search.placeholder")}
						value={query}
						onValueChange={setQuery}
					/>
					<CommandList>
						<CommandEmpty>{t("app.search.empty")}</CommandEmpty>
						{query
							? renderGroups(searchItems)
							: renderGroups(recommendations)}
					</CommandList>
				</Command>
			</CommandDialog>
		</>
	);
}
