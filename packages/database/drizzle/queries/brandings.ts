import { eq } from "drizzle-orm";
import { betterClient, db } from "../client";
import { branding } from "../schema";

export async function getBrandingsByOrganizationId(organizationId: string) {
	return betterClient.branding.findMany({
		where: { organizationId },
		orderBy: [{ name: "asc" }],
	});
}

export async function getBrandingById(id: string) {
	return betterClient.branding.findUnique({
		where: { id },
		include: {
			organization: true,
			branches: true,
		},
	});
}

export async function createBranding({
	organizationId,
	name,
	logoUrl,
	primaryColor,
}: {
	organizationId: string;
	name: string;
	logoUrl?: string | null;
	primaryColor?: string | null;
}) {
	const created = await betterClient.branding.create({
		data: {
			organizationId,
			name,
			logoUrl: logoUrl ?? null,
			primaryColor: primaryColor ?? null,
		},
	});

	return getBrandingById(created.id);
}

export async function updateBranding(
	id: string,
	data: {
		name?: string;
		logoUrl?: string | null;
		primaryColor?: string | null;
	},
) {
	await betterClient.branding.update({ where: { id }, data });
	return getBrandingById(id);
}

export async function deleteBranding(id: string, deletedBy?: string) {
	await betterClient.branding.delete({
		where: { id },
		...(deletedBy ? { deletedBy } : {}),
	});
}

export async function restoreBranding(id: string) {
	await db
		.update(branding)
		.set({ deletedAt: null, deletedById: null })
		.where(eq(branding.id, id));
	return getBrandingById(id);
}
