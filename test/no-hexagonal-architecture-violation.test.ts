import { expect, sinon, StubbedType, stubInterface } from "@sefr/test";
import { NoHexagonalArchitectureViolation } from "../src/no-hexagonal-architecture-violation";
import { Rule } from "eslint";
import { ImportDeclaration } from "estree";

const message = "This import violates Hexagonal Architecture principles. " +
	"Read more about this architecture : https://medium.com/idealo-tech-blog/hexagonal-ports-adapters-architecture-e3617bcf00a0";
let ruleContext: StubbedType<Rule.RuleContext>;
let node: StubbedType<ImportDeclaration & Rule.NodeParentExtension>;

describe("NoHexagonalArchitectureViolation", () => {
	beforeEach(() => {
		ruleContext = stubInterface<Rule.RuleContext>(sinon);
		node = stubInterface<ImportDeclaration & Rule.NodeParentExtension>(sinon);
	});

	context("When current file belongs to the hexagon", () => {
		context("and we try to import a module from the user-side", () => {
			it("reports the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns("root/path/to/core/current-file.ts");
				node.source.value = "root/path/to/user-side/some-module";

				// When
				NoHexagonalArchitectureViolation.check(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
			});
		});

		context("and we try to import a module from the server-side", () => {
			it("reports the bug", () => {
				// Given
				ruleContext.getPhysicalFilename.returns("root/path/to/core/current-file.ts");
				node.source.value = "root/path/to/server-side/some-module";

				// When
				NoHexagonalArchitectureViolation.check(ruleContext, node);

				// Then
				expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
			});
		});
	});

	context("When current file belongs to the user-side", () => {
		beforeEach(() => {
			ruleContext.getPhysicalFilename.returns("root/path/to/user-side/current-file.ts");
		});

		context("and we try to import a module from the hexagon", () => {
			context("and the hexagon is called 'hexagon' as a folder", () => {
				it("does nothing", () => {
					// Given
					node.source.value = "root/path/to/hexagon/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});

			context("and the hexagon is called 'core' as a folder", () => {
				it("does nothing", () => {
					// Given
					node.source.value = "root/path/to/core/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});
		});

		context("and we try to import a module from the server-side", () => {
			context("and the server-side is called 'server-side' as a folder", () => {
				it("reports the bug", () => {
					// Given
					node.source.value = "root/path/to/server-side/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
				});
			});

			context("and the server-side is called 'infrastructure' as a folder", () => {
				it("reports the bug", () => {
					// Given
					node.source.value = "root/path/to/infrastructure/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
				});
			});

			context("and the server-side is called 'driven-side' as a folder", () => {
				it("reports the bug", () => {
					// Given
					node.source.value = "root/path/to/driven-side/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
				});
			});
		});
	});

	context("When current file belongs to the server-side", () => {
		beforeEach(() => {
			ruleContext.getPhysicalFilename.returns("root/path/to/server-side/current-file.ts");
		});

		context("and we try to import a module from the hexagon", () => {
			context("and the hexagon is called 'hexagon' as a folder", () => {
				it("does nothing", () => {
					// Given
					node.source.value = "root/path/to/hexagon/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});

			context("and the hexagon is called 'core' as a folder", () => {
				it("does nothing", () => {
					// Given
					node.source.value = "root/path/to/core/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.not.have.been.called;
				});
			});
		});

		context("and we try to import a module from the user-side", () => {
			context("and the user-side is called 'user-side' as a folder", () => {
				it("reports the bug", () => {
					// Given
					node.source.value = "root/path/to/user-side/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
				});
			});

			context("and the user-side is called 'application' as a folder", () => {
				it("reports the bug", () => {
					// Given
					node.source.value = "root/path/to/application/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
				});
			});

			context("and the user-side is called 'driver-side' as a folder", () => {
				it("reports the bug", () => {
					// Given
					node.source.value = "root/path/to/driver-side/some-module";

					// When
					NoHexagonalArchitectureViolation.check(ruleContext, node);

					// Then
					expect(ruleContext.report).to.have.been.calledOnceWith({ message, node });
				});
			});
		});
	});
});
