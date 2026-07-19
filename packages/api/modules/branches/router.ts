import { create } from "./procedures/create";
import { get } from "./procedures/get";
import { list } from "./procedures/list";
import { remove } from "./procedures/delete";
import { restore } from "./procedures/restore";
import { update } from "./procedures/update";

export const branchesRouter = {
	list,
	get,
	create,
	update,
	delete: remove,
	restore,
};
