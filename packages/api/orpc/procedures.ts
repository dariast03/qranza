import { ORPCError, os } from "@orpc/server";
import { auth } from "@repo/auth";
import { verifyOrganizationMembership } from "../modules/organizations/lib/membership";

export const publicProcedure = os.$context<{
	headers: Headers;
}>();

export const protectedProcedure = publicProcedure.use(async ({ context, next }) => {
	const session = await auth.api.getSession({
		headers: context.headers,
	});

	if (!session) {
		throw new ORPCError("UNAUTHORIZED");
	}

	return await next({
		context: {
			session: session.session,
			user: session.user,
		},
	});
});

export const organizationProcedure = protectedProcedure.use(async ({ context, next }) => {
	const orgId = context.session.activeOrganizationId;

	if (!orgId) {
		throw new ORPCError("BAD_REQUEST", {
			message: "No active organization. Please select an organization first.",
		});
	}

	const membership = await verifyOrganizationMembership(orgId, context.user.id);

	if (!membership) {
		throw new ORPCError("FORBIDDEN");
	}

	return await next({
		context: {
			organization: membership.organization,
			organizationRole: membership.role,
		},
	});
});

export const adminProcedure = protectedProcedure.use(async ({ context, next }) => {
	if (context.user.role !== "admin") {
		throw new ORPCError("FORBIDDEN");
	}

	return await next();
});
