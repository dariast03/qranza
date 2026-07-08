import { createLogoUploadUrl } from "./procedures/create-logo-upload-url";
import { createOrganizationSetup } from "./procedures/create-organization-setup";
import { generateOrganizationSlug } from "./procedures/generate-organization-slug";
import { listCountries } from "./procedures/list-countries";
import { listIndustries } from "./procedures/list-industries";

export const organizationsRouter = {
	generateSlug: generateOrganizationSlug,
	createLogoUploadUrl,
	createOrganizationSetup,
	listIndustries,
	listCountries,
};
