import { streamToEventIterator } from "@orpc/client";
import { convertToModelMessages, streamText, textModel, type UIMessage } from "@repo/ai";
import z from "zod";

import { protectedProcedure } from "../../../orpc/procedures";

/**
 * Accept only the minimal shape the UI sends: a role and a list of parts that
 * are either plain text or a generic object. This keeps arbitrary / untrusted
 * client payloads out of the prompt pipeline while staying forward compatible
 * with UI-only part types (e.g. attachments) the ai-sdk renderer introduces.
 */
const UIMessagePartSchema = z.union([
	z.object({
		type: z.literal("text"),
		text: z.string().max(8_000),
	}),
	z.object({ type: z.string() }).passthrough(),
]);

const UIMessageInputSchema = z.object({
	id: z.string().optional(),
	role: z.enum(["system", "user", "assistant"]),
	parts: z.array(UIMessagePartSchema),
});

export const streamMessage = protectedProcedure
	.route({
		method: "POST",
		path: "/ai/stream",
		tags: ["AI"],
		summary: "Stream AI response",
		description: "Stream an AI response without storing the chat",
	})
	.input(
		z.object({
			messages: z.array(UIMessageInputSchema).min(1).max(50),
		}),
	)
	.handler(async ({ input }) => {
		const { messages } = input;

		const response = streamText({
			model: textModel,
			messages: await convertToModelMessages(messages as unknown as UIMessage[]),
		});

		return streamToEventIterator(response.toUIMessageStream());
	});
