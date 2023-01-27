import { NoCrossDomainImport } from "./no-cross-domain-import";

module.exports = {
	rules: {
		"no-cross-domain-import": {
			create: NoCrossDomainImport.create,
			meta: {
				docs: {
					description: "Avoid cross-domain import which can lead to strong coupling across the application",
					recommended: "error",
				},
				type: "problem",
				schema: [
					{
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"domain": "string",
								"domainsToExclude": "array",
								"items": {
									"type": "string"
								}
							}
						}
					}
				]
			},
		},
	},
};
