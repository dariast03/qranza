import { get } from "./procedures/get";
import { remove } from "./procedures/delete";
import { listSlots } from "./procedures/list-slots";
import { upsertSlots } from "./procedures/upsert-slots";
import { listExceptions } from "./procedures/list-exceptions";
import { upsertExceptions } from "./procedures/upsert-exceptions";

export const schedulesRouter = {
	get,
	delete: remove,
	listSlots,
	upsertSlots,
	listExceptions,
	upsertExceptions,
};
