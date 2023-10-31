import { ImportDeclaration } from 'estree';
import { Rule } from 'eslint';

export type DomainConfiguration = { domain: string; domainsToExclude: Array<string> };

export class NoCrossDomainImport {
  private static message = 'Forbidden cross-domain import';

  public static create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      ImportDeclaration: (node: ImportDeclaration & Rule.NodeParentExtension): void => {
        NoCrossDomainImport.checkNoCrossDomainImport(context, node);
      }
    };
  }

  public static checkNoCrossDomainImport(
    context: Rule.RuleContext,
    node: ImportDeclaration & Rule.NodeParentExtension
  ): void {
    const domainsConfiguration = context.options
      ? <Array<DomainConfiguration>>context.options[0]
      : [];
    const configuredDomainsNameToCheck = domainsConfiguration?.map(
      (domainConfiguration) => domainConfiguration.domain
    );
    const currentFileDomain = this.getDomain(
      context.physicalFilename,
      configuredDomainsNameToCheck
    );

    if (currentFileDomain) {
      const excludedDomainsForCurrentOne = this.getDomainsToExcludeForCurrentDomain(
        domainsConfiguration,
        currentFileDomain
      );

      if (this.getDomain(<string>node.source.value, excludedDomainsForCurrentOne)) {
        context.report({ node, message: this.message });
      }
    }
  }

  private static getDomain(currentString: string, domains: Array<string> = []): string | null {
    for (const domain of domains) {
      if (currentString.match(domain)) {
        return domain;
      }
    }
    return null;
  }

  private static getDomainsToExcludeForCurrentDomain(
    domainsConfiguration: Array<DomainConfiguration>,
    currentFileDomain: string
  ): Array<string> | undefined {
    return domainsConfiguration.find(
      (domainConfiguration) => domainConfiguration.domain === currentFileDomain
    )?.domainsToExclude;
  }
}
