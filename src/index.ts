import { NoCrossDomainImport } from "./no-cross-domain-import";

module.exports = {
	rules: {
		"no-cross-subcontext-import": {
			create: NoCrossDomainImport.create,
			meta: {
				docs: {
					description: "Avoid cross-subcontext import which can lead to strong coupling across the application",
					recommended: "error",
				},
				type: "problem",
			},
		},
	},
};
