import { ImportDeclaration } from "estree";
import { Rule } from "eslint";

export type DomainConfiguration = { domain: string, domainsToExclude: Array<string> };

export class NoCrossDomainImport {
	private static message = "Forbidden cross-domain import";

	public static create(context: Rule.RuleContext): Rule.RuleListener {
		return {
			ImportDeclaration: (node: ImportDeclaration & Rule.NodeParentExtension): void => {
				NoCrossDomainImport.checkNoCrossDomainImport(context, node);
			}
		}
	}

	public static checkNoCrossDomainImport(context: Rule.RuleContext, node: ImportDeclaration & Rule.NodeParentExtension): void {
		const domainsConfiguration = context.options[0];
		const currentFileDomain = this.getDomain(context.getPhysicalFilename(), domainsConfiguration);
		const currentImportDomain = this.getDomain(<string>node.source.value, domainsConfiguration);

		if(this.importIsFromAnotherDomainThanFileOne(currentFileDomain, currentImportDomain, domainsConfiguration)) {
			context.report({ node, message: this.message });
		}
	}

	private static getDomain(currentString: string, domainsConfiguration: Array<DomainConfiguration> = []): string {
		const domains = domainsConfiguration.map((subcontextConfiguration) => subcontextConfiguration.domain);
		for (const domain of domains) {
			if (currentString.match(domain)) {
				return domain;
			}
		}
		return "";
	}

	private static importIsFromAnotherDomainThanFileOne(
		currentFileDomain: string,
		currentImportDomain: string,
		domainsConfiguration: Array<DomainConfiguration>,
	): boolean {
		const domainImportsToExclude = this.getDomainsToExcludeForCurrentDomain(domainsConfiguration, currentFileDomain)?.domainsToExclude;

		if (!domainImportsToExclude) {
			return false;
		}

		return (domainImportsToExclude.includes(currentImportDomain) && currentImportDomain !== currentFileDomain);
	}

	private static getDomainsToExcludeForCurrentDomain(domainsConfiguration: Array<DomainConfiguration>, currentFileDomain: string) {
		return domainsConfiguration.find((domainConfiguration) => domainConfiguration.domain === currentFileDomain);
	}
}
