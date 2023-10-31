import { ImportDeclaration } from 'estree';
import { Rule } from 'eslint';

export class NoOnionArchitectureViolation {
  private static MESSAGE =
    'This import violates Onion Architecture principles. Read more about this architecture : ' +
    'https://medium.com/expedia-group-tech/onion-architecture-deed8a554423';

  private static INFRASTRUCTURE_LAYER = new RegExp(/infras?|infrastructures?/);
  private static APPLICATION_SERVICE_LAYER = new RegExp(
    /(applications?-services?)|(applications?)/
  );
  private static DOMAIN_SERVICE_LAYER = new RegExp(/domains?\/services?|domains?-services?/);
  private static DOMAIN_MODEL_LAYER = new RegExp(/domains?\/models?|domains?-models?/);

  public static create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      ImportDeclaration: (node: ImportDeclaration & Rule.NodeParentExtension): void => {
        NoOnionArchitectureViolation.checkNoCrossDomainImport(context, node);
      }
    };
  }

  public static checkNoCrossDomainImport(
    context: Rule.RuleContext,
    node: ImportDeclaration & Rule.NodeParentExtension
  ): void {
    const currentFilePath = context.physicalFilename;
    const currentImportPath = <string>node.source.value;

    if (
      this.isImportFromLayer(currentImportPath, this.INFRASTRUCTURE_LAYER) &&
      this.isFileFromLayers(
        currentFilePath,
        this.APPLICATION_SERVICE_LAYER,
        this.DOMAIN_SERVICE_LAYER,
        this.DOMAIN_MODEL_LAYER
      )
    ) {
      context.report({ node, message: this.MESSAGE });
    } else if (
      this.isImportFromLayer(currentImportPath, this.APPLICATION_SERVICE_LAYER) &&
      this.isFileFromLayers(currentFilePath, this.DOMAIN_SERVICE_LAYER, this.DOMAIN_MODEL_LAYER)
    ) {
      context.report({ node, message: this.MESSAGE });
    } else if (
      this.isImportFromLayer(currentImportPath, this.DOMAIN_SERVICE_LAYER) &&
      this.isFileFromLayers(currentFilePath, this.DOMAIN_MODEL_LAYER)
    ) {
      context.report({ node, message: this.MESSAGE });
    }
  }

  private static isImportFromLayer(currentImportPath: string, layer: RegExp): boolean {
    return currentImportPath.match(layer) !== null;
  }

  private static isFileFromLayers(currentFilePath: string, ...layers: Array<RegExp>): boolean {
    for (const layer of layers) {
      if (currentFilePath.match(layer)) {
        return true;
      }
    }
    return false;
  }
}
