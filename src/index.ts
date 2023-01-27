import { NoCrossSubContextImport } from "./no-cross-sub-context-import";

module.exports = {
	rules: {
		"no-cross-subcontext-import": {
			create: NoCrossSubContextImport.create,
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
