import { StubbedType } from "@salesforce/ts-sinon";
import { Rule } from "eslint";
import { ImportDeclaration } from "estree";
import { DomainConfiguration, NoCrossDomainImport } from "../src/no-cross-domain-import";
import { expect, sinon, stubInterface } from "./configuration";

let ruleContext: StubbedType<Rule.RuleContext>;
let node: StubbedType<ImportDeclaration & Rule.NodeParentExtension>;
const message = "Forbidden cross-domain import";
const rulesOptions: Array<Array<DomainConfiguration>> = [[
	{
		domain: "billing",
		domainsToExclude: ["marketing", "subscription"]
	}, {
		domain: "marketing",
		domainsToExclude: ["billing", "subscription"]
	}, {
		domain: "subscription",
		domainsToExclude: ["billing", "marketing"]
	}
]];

describe("NoCrossDomainImport", () => {
	context("When current file doesn't belong to identified domain", () => {
		it("does nothing", () => {
			// Given
			const notIdentifiedDomain = "some-unidentified-domain";
			ruleContext = stubInterface<Rule.RuleContext>(sinon);
			ruleContext.getPhysicalFilename.returns(`root/${notIdentifiedDomain}/path/to/some/file.ts`);
			ruleContext.options = rulesOptions;
			node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
			node.source.value = "import { Something } from \"root/directory/to/subscription/path/to/some/other/file.ts\"";

			// When
			NoCrossDomainImport.checkNoCrossDomainImport(ruleContext, node);

			// Then
			expect(ruleContext.report).to.not.have.been.called;
		});
	});

	describe("When current file belongs to some identified domain", () => {
		context("and that an import comes from another domain than ones specified", () => {
			it("does nothing", () => {
				// Given
				const notIdentifiedDomain = "some-unidentified-domain";
				ruleContext = stubInterface<Rule.RuleContext>(sinon);
				ruleContext.getPhysicalFilename.returns("root/directory/subscription/path/to/some/file.ts");
				ruleContext.options = rulesOptions;
				node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
				node.source.value = `import { Something } from "root/${notIdentifiedDomain}/path/to/some/other/file.ts"`;

				// When
				NoCrossDomainImport.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and that an import come from specified domain", () => {
			it("reports the bug", () => {
				// Given
				ruleContext = stubInterface<Rule.RuleContext>(sinon);
				ruleContext.getPhysicalFilename.returns("root/directory/subscription/path/to/some/file.ts");
				ruleContext.options = rulesOptions;
				node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
				node.source.value = `import { Something } from "root/directory/billing/path/to/some/file.ts"`;

				// When
				NoCrossDomainImport.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWithExactly({ node, message });
			});
		});
	});
});
