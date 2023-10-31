import { ImportDeclaration } from 'estree';
import { Rule } from 'eslint';

export class NoHexagonalArchitectureViolation {
  private static MESSAGE =
    'This import violates Hexagonal Architecture principles. ' +
    'Read more about this architecture : https://medium.com/idealo-tech-blog/hexagonal-ports-adapters-architecture-e3617bcf00a0';
  private static HEXAGON_LAYER = new RegExp(
    /hexagon|core|business(-logic)?|(primary-|secondary-|driver-|driven-)?port/
  );
  private static SERVER_SIDE_LAYER = new RegExp(
    /infra(structure)?|server-side|secondary-adapter|driven-side?/
  );
  private static USER_SIDE_LAYER = new RegExp(
    /application(-service)?|user-side|primary-adapter|driver-side?/
  );

  public static create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      ImportDeclaration: (node: ImportDeclaration & Rule.NodeParentExtension): void => {
        NoHexagonalArchitectureViolation.check(context, node);
      }
    };
  }

  public static check(
    context: Rule.RuleContext,
    node: ImportDeclaration & Rule.NodeParentExtension
  ): void {
    const currentImportPath = <string>node.source.value;
    const currentFilePath = context.physicalFilename;

    if (
      this.isImportFromLayer(currentImportPath, this.USER_SIDE_LAYER) &&
      this.isFileFromLayers(currentFilePath, this.HEXAGON_LAYER, this.SERVER_SIDE_LAYER)
    ) {
      context.report({ message: this.MESSAGE, node });
    } else if (
      this.isImportFromLayer(currentImportPath, this.SERVER_SIDE_LAYER) &&
      this.isFileFromLayers(currentFilePath, this.HEXAGON_LAYER, this.USER_SIDE_LAYER)
    ) {
      context.report({ message: this.MESSAGE, node });
    } else if (this.isImportFromLayer(currentImportPath, this.HEXAGON_LAYER)) {
      return;
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
