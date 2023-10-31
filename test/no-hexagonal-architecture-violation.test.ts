import { beforeEach, describe, expect, it } from 'vitest';
import { NoHexagonalArchitectureViolation } from '../src/no-hexagonal-architecture-violation';
import { Rule } from 'eslint';
import { ImportDeclaration } from 'estree';
import { mock } from 'vitest-mock-extended';

const message =
  'This import violates Hexagonal Architecture principles. ' +
  'Read more about this architecture : https://medium.com/idealo-tech-blog/hexagonal-ports-adapters-architecture-e3617bcf00a0';
let ruleContext: Rule.RuleContext;
let node: ImportDeclaration & Rule.NodeParentExtension;

describe('NoHexagonalArchitectureViolation', () => {
  beforeEach(() => {
    ruleContext = mock<Rule.RuleContext>();
    node = mock<ImportDeclaration & Rule.NodeParentExtension>();
  });

  describe('When current file belongs to the hexagon', () => {
    describe('and we try to import a module from the user-side', () => {
      it('reports the bug', () => {
        // Given
        ruleContext.physicalFilename = 'root/path/to/core/current-file.ts';
        node.source.value = 'root/path/to/user-side/some-module';

        // When
        NoHexagonalArchitectureViolation.check(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
      });
    });

    describe('and we try to import a module from the server-side', () => {
      it('reports the bug', () => {
        // Given
        ruleContext.physicalFilename = 'root/path/to/core/current-file.ts';
        node.source.value = 'root/path/to/server-side/some-module';

        // When
        NoHexagonalArchitectureViolation.check(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
      });
    });
  });

  describe('When current file belongs to the user-side', () => {
    beforeEach(() => {
      ruleContext.physicalFilename = 'root/path/to/user-side/current-file.ts';
    });

    describe('and we try to import a module from the hexagon', () => {
      describe("and the hexagon is called 'hexagon' as a folder", () => {
        it('does nothing', () => {
          // Given
          node.source.value = 'root/path/to/hexagon/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledTimes(0);
        });
      });

      describe("and the hexagon is called 'core' as a folder", () => {
        it('does nothing', () => {
          // Given
          node.source.value = 'root/path/to/core/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('and we try to import a module from the server-side', () => {
      describe("and the server-side is called 'server-side' as a folder", () => {
        it('reports the bug', () => {
          // Given
          node.source.value = 'root/path/to/server-side/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
        });
      });

      describe("and the server-side is called 'infrastructure' as a folder", () => {
        it('reports the bug', () => {
          // Given
          node.source.value = 'root/path/to/infrastructure/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
        });
      });

      describe("and the server-side is called 'driven-side' as a folder", () => {
        it('reports the bug', () => {
          // Given
          node.source.value = 'root/path/to/driven-side/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
        });
      });
    });
  });

  describe('When current file belongs to the server-side', () => {
    beforeEach(() => {
      ruleContext.physicalFilename = 'root/path/to/server-side/current-file.ts';
    });

    describe('and we try to import a module from the hexagon', () => {
      describe("and the hexagon is called 'hexagon' as a folder", () => {
        it('does nothing', () => {
          // Given
          node.source.value = 'root/path/to/hexagon/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledTimes(0);
        });
      });

      describe("and the hexagon is called 'core' as a folder", () => {
        it('does nothing', () => {
          // Given
          node.source.value = 'root/path/to/core/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledTimes(0);
        });
      });
    });

    describe('and we try to import a module from the user-side', () => {
      describe("and the user-side is called 'user-side' as a folder", () => {
        it('reports the bug', () => {
          // Given
          node.source.value = 'root/path/to/user-side/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
        });
      });

      describe("and the user-side is called 'application' as a folder", () => {
        it('reports the bug', () => {
          // Given
          node.source.value = 'root/path/to/application/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
        });
      });

      describe("and the user-side is called 'driver-side' as a folder", () => {
        it('reports the bug', () => {
          // Given
          node.source.value = 'root/path/to/driver-side/some-module';

          // When
          NoHexagonalArchitectureViolation.check(ruleContext, node);

          // Then
          expect(ruleContext.report).toHaveBeenCalledWith({ message, node });
        });
      });
    });
  });
});
