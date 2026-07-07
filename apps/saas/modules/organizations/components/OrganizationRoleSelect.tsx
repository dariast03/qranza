import { useOrganizationMemberRoleOptions } from "@organizations/hooks/member-roles";
import type { OrganizationMemberRole } from "@repo/auth";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/ui/components/select";

export function OrganizationRoleSelect({
	value,
	onSelect,
	disabled,
}: {
	value?: OrganizationMemberRole;
	onSelect: (value: OrganizationMemberRole) => void;
	disabled?: boolean;
}) {
	const roleOptions = useOrganizationMemberRoleOptions();

	return (
		<Select
			value={value}
			items={roleOptions}
			onValueChange={(v) => {
				if (v === null) {
					return;
				}
				onSelect(v as OrganizationMemberRole);
			}}
			disabled={disabled}
		>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent className="min-w-72">
				{roleOptions.map((option) => (
					<SelectItem key={option.value} value={option.value} label={option.label}>
						<div className="gap-0.5 py-0.5 flex flex-col text-left">
							<span>{option.label}</span>
							<span className="text-xs leading-snug line-clamp-1 text-foreground/60">
								{option.description}
							</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
