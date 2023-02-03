import { NoCrossDomainImport } from "./no-cross-domain-import";
import { NoHexagonalArchitectureViolation } from "./no-hexagonal-architecture-violation";
import { NoOnionArchitectureViolation } from "./no-onion-architecture-violation";

module.exports = {
	rules: {
		"no-onion-architecture-violation": {
			create: NoOnionArchitectureViolation.create,
			meta: {
				docs: {
					description: "Avoid major Onion architecture violation",
					recommended: false,
				},
				type: "problem",
			},
		},
		"no-hexagonal-architecture-violation": {
			create: NoHexagonalArchitectureViolation.create,
			meta: {
				docs: {
					description: "Avoid major Hexagonal architecture violation",
					recommended: false,
				},
				type: "problem",
			},
		},
		"no-cross-domain-import": {
			create: NoCrossDomainImport.create,
			meta: {
				docs: {
					description: "Avoid cross-domain import which can lead to strong coupling across the application",
					recommended: true,
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
