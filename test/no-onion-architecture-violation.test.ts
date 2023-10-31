import { beforeEach, describe, expect, it } from 'vitest';
import { Rule } from 'eslint';
import { ImportDeclaration } from 'estree';
import { NoOnionArchitectureViolation } from '../src/no-onion-architecture-violation';
import { mock } from 'vitest-mock-extended';

let ruleContext: Rule.RuleContext;
let node: ImportDeclaration & Rule.NodeParentExtension;
const message =
  'This import violates Onion Architecture principles. Read more about this architecture : ' +
  'https://medium.com/expedia-group-tech/onion-architecture-deed8a554423';

describe('NoOnionArchitectureViolationTest', () => {
  beforeEach(() => {
    ruleContext = mock<Rule.RuleContext>();
    node = mock<ImportDeclaration & Rule.NodeParentExtension>();
  });

  describe('When you try to import module from infrastructure layer', () => {
    beforeEach(() => {
      node.source.value = 'root/infrastructure/some.file.ts';
    });

    describe('and you are in module from infrastructure layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/infrastructure/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from application services layer', () => {
      it('report the bug', () => {
        // Given
        ruleContext.physicalFilename = `root/application-service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ node, message });
      });
    });

    describe('and you are in module from domain services layer', () => {
      it('report the bug', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ node, message });
      });
    });

    describe('and you are in module from domain model layer', () => {
      it('report the bug', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/model/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ node, message });
      });
    });
  });

  describe('When you try to import module from application service layer', () => {
    beforeEach(() => {
      node.source.value = 'root/application-service/some.file.ts';
    });

    describe('and you are in module from infrastructure layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/infrastructure/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from application services layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/application-service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from domain services layer', () => {
      it('report the bug', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ node, message });
      });
    });

    describe('and you are in module from domain model layer', () => {
      it('report the bug', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/model/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ node, message });
      });
    });
  });

  describe('When you try to import module from domain service layer', () => {
    beforeEach(() => {
      node.source.value = 'root/domain/service/some.file.ts';
    });

    describe('and you are in module from infrastructure layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/infrastructure/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from application services layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/application-service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from domain services layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from domain model layer', () => {
      it('report the bug', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/model/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ node, message });
      });
    });
  });

  describe('When you try to import module from domain model layer', () => {
    beforeEach(() => {
      node.source.value = 'root/domain/model/some.file.ts';
    });

    describe('and you are in module from infrastructure layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/infrastructure/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from application services layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/application-service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from domain services layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/service/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and you are in module from domain model layer', () => {
      it('does nothing', () => {
        // Given
        ruleContext.physicalFilename = `root/domain/model/path/to/some/file.ts`;

        // When
        NoOnionArchitectureViolation.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });
  });
});
