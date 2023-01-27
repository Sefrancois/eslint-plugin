import { ImportDeclaration } from "estree";
import { Rule } from "eslint";

type SubContextConfiguration = { namedSubContext: string, forbiddenSubContextImport: Array<string> };

export class NoCrossSubContextImport {
	private static message = "Forbidden cross-subcontext import";

	public static create(context: Rule.RuleContext): Rule.RuleListener {
		return {
			ImportDeclaration: (node: ImportDeclaration & Rule.NodeParentExtension): void => {
				NoCrossSubContextImport.checkNoCrossSubContext(context, node);
			}
		}
	}

	public static checkNoCrossSubContext(context: Rule.RuleContext, node: ImportDeclaration & Rule.NodeParentExtension): void {
		const subContextsConfiguration = context.options[0];
		const currentFileSubcontext = this.getSubcontext(context.getPhysicalFilename(), subContextsConfiguration);
		const currentImportSubcontext = this.getSubcontext(<string>node.source.value, subContextsConfiguration);

		if(this.importIsFromAnotherContextThanFileOne(currentFileSubcontext, currentImportSubcontext, subContextsConfiguration)) {
			context.report({ node, message: this.message });
		}
	}

	private static getSubcontext(currentString: string, subContextsConfiguration: Array<SubContextConfiguration> = []): string {
		const subcontexts = subContextsConfiguration.map((subcontextConfiguration) => subcontextConfiguration.namedSubContext);
		for (const subcontext of subcontexts) {
			if (currentString.match(subcontext)) {
				return subcontext;
			}
		}
		return "";
	}

	private static importIsFromAnotherContextThanFileOne(
		currentFileSubcontext: string,
		currentImportSubcontext: string,
		subcontextsConfiguration: Array<SubContextConfiguration>,
	): boolean {
		const forbiddenSubContextImports = subcontextsConfiguration.find((subcontextConfiguration) => subcontextConfiguration.namedSubContext === currentFileSubcontext)?.forbiddenSubContextImport;

		if (!forbiddenSubContextImports) {
			return false;
		}

		return (forbiddenSubContextImports.includes(currentImportSubcontext) && currentImportSubcontext !== currentFileSubcontext);
	}
}
