import { ORPCError, call } from "@orpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/auth", () => ({
	auth: {
		api: {
			getSession: vi.fn(),
		},
	},
}));

vi.mock("@repo/logs", () => ({
	logger: {
		error: vi.fn(),
	},
}));

vi.mock("@repo/database", () => ({
	getOrganizationById: vi.fn(),
}));

vi.mock("@repo/payments", () => ({
	createCheckoutLink: vi.fn(),
	findPriceByPlanId: vi.fn(),
	getCustomerIdFromEntity: vi.fn(),
	getProviderPriceIdByPlanId: vi.fn(),
}));

vi.mock("../../organizations/lib/membership", () => ({
	verifyOrganizationMembership: vi.fn(),
}));

import { auth } from "@repo/auth";
import { getOrganizationById } from "@repo/database";
import {
	createCheckoutLink as createCheckoutLinkFn,
	findPriceByPlanId,
	getCustomerIdFromEntity,
	getProviderPriceIdByPlanId,
} from "@repo/payments";

import { verifyOrganizationMembership } from "../../organizations/lib/membership";
import { createCheckoutLink } from "./create-checkout-link";

const context = { context: { headers: new Headers() } };

function mockSession() {
	vi.mocked(auth.api.getSession).mockResolvedValue({
		user: { id: "user-1", email: "user@example.com", name: "User" },
		session: { id: "session-1", userId: "user-1" },
	} as never);
}

function mockPrice() {
	vi.mocked(findPriceByPlanId).mockReturnValue({
		type: "subscription",
		interval: "month",
		price: 2900,
		seatBased: true,
	} as never);
	vi.mocked(getProviderPriceIdByPlanId).mockReturnValue("price-pro-monthly");
	vi.mocked(getCustomerIdFromEntity).mockResolvedValue("cus_123");
	vi.mocked(createCheckoutLinkFn).mockResolvedValue("https://checkout.example.com");
}

describe("createCheckoutLink", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockSession();
		mockPrice();
	});

	it("rejects organization checkout creation for non-members", async () => {
		vi.mocked(verifyOrganizationMembership).mockResolvedValueOnce(null);

		await expect(
			call(
				createCheckoutLink,
				{
					planId: "pro",
					type: "subscription",
					interval: "month",
					organizationId: "org-1",
				},
				context,
			),
		).rejects.toThrow(ORPCError);
		await expect(
			call(
				createCheckoutLink,
				{
					planId: "pro",
					type: "subscription",
					interval: "month",
					organizationId: "org-1",
				},
				context,
			),
		).rejects.toMatchObject({ code: "FORBIDDEN" });
		expect(createCheckoutLinkFn).not.toHaveBeenCalled();
	});

	it("creates organization checkout links only after membership is verified", async () => {
		vi.mocked(verifyOrganizationMembership).mockResolvedValue({
			role: "member",
			organization: {
				id: "org-1",
			},
		} as never);
		vi.mocked(getOrganizationById).mockResolvedValue({
			id: "org-1",
			members: [{ id: "member-1" }, { id: "member-2" }],
		} as never);

		const result = await call(
			createCheckoutLink,
			{
				planId: "pro",
				type: "subscription",
				interval: "month",
				organizationId: "org-1",
			},
			context,
		);

		expect(verifyOrganizationMembership).toHaveBeenCalledWith("org-1", "user-1");
		expect(getCustomerIdFromEntity).toHaveBeenCalledWith({ organizationId: "org-1" });
		expect(createCheckoutLinkFn).toHaveBeenCalledWith(
			expect.objectContaining({
				email: "user@example.com",
				organizationId: "org-1",
				priceId: "price-pro-monthly",
				seats: 2,
			}),
		);
		expect(result).toEqual({ checkoutLink: "https://checkout.example.com" });
	});
});
