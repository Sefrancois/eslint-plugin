import { expect, sinon, StubbedType, stubInterface } from "./configuration";
import { Rule } from "eslint";
import { ImportDeclaration } from "estree";
import { NoOnionArchitectureViolation } from "../src/no-onion-architecture-violation";

let ruleContext: StubbedType<Rule.RuleContext>;
let node: StubbedType<ImportDeclaration & Rule.NodeParentExtension>;
const message = "This import violates Onion Architecture principles. Read more about this architecture : " +
	"https://medium.com/expedia-group-tech/onion-architecture-deed8a554423";

describe("NoOnionArchitectureViolationTest", () => {
	beforeEach(() => {
		ruleContext = stubInterface<Rule.RuleContext>(sinon);
		node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
	});

	context("When you try to import module from infrastructure layer", () => {
		beforeEach(() => {
			node.source.value = "root/infrastructure/some.file.ts";
		});

		context("and you are in module from infrastructure layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/infrastructure/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from application services layer", () => {
			it("report the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/application-service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ node, message });
			});
		});

		context("and you are in module from domain services layer", () => {
			it("report the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ node, message });
			});
		});

		context("and you are in module from domain model layer", () => {
			it("report the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/model/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ node, message });
			});
		});
	});

	context("When you try to import module from application service layer", () => {
		beforeEach(() => {
			node.source.value = "root/application-service/some.file.ts";
		});

		context("and you are in module from infrastructure layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/infrastructure/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from application services layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/application-service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from domain services layer", () => {
			it("report the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ node, message });
			});
		});

		context("and you are in module from domain model layer", () => {
			it("report the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/model/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ node, message });
			});
		});
	});

	context("When you try to import module from domain service layer", () => {
		beforeEach(() => {
			node.source.value = "root/domain/service/some.file.ts";
		});

		context("and you are in module from infrastructure layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/infrastructure/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from application services layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/application-service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from domain services layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from domain model layer", () => {
			it("report the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/model/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ node, message });
			});
		});
	});

	context("When you try to import module from domain model layer", () => {
		beforeEach(() => {
			node.source.value = "root/domain/model/some.file.ts";
		});

		context("and you are in module from infrastructure layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/infrastructure/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from application services layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/application-service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from domain services layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/service/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});

		context("and you are in module from domain model layer", () => {
			it("does nothing", () => {
				// Given
				ruleContext.getPhysicalFilename.returns(`root/domain/model/path/to/some/file.ts`);

				// When
				NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

				// Then
				expect(ruleContext.report).to.not.have.been.called;
			});
		});
	});
});
