import { describe, expect, it } from 'vitest';
import { Rule } from 'eslint';
import { ImportDeclaration } from 'estree';
import { DomainConfiguration, NoCrossDomainImport } from '../src/no-cross-domain-import';
import { mock } from 'vitest-mock-extended';

let ruleContext: Rule.RuleContext;
let node: ImportDeclaration & Rule.NodeParentExtension;
const message = 'Forbidden cross-domain import';
const rulesOptions: Array<Array<DomainConfiguration>> = [
  [
    {
      domain: 'billing',
      domainsToExclude: ['marketing', 'subscription']
    },
    {
      domain: 'marketing',
      domainsToExclude: ['billing', 'subscription']
    },
    {
      domain: 'subscription',
      domainsToExclude: ['billing', 'marketing']
    }
  ]
];

describe('NoCrossDomainImport', () => {
  describe("When current file doesn't belong to identified domain", () => {
    it('does nothing', () => {
      // Given
      const notIdentifiedDomain = 'some-unidentified-domain';
      ruleContext = mock<Rule.RuleContext>();
      ruleContext.physicalFilename = `root/${notIdentifiedDomain}/path/to/some/file.ts`;
      ruleContext.options = rulesOptions;
      node = mock<ImportDeclaration & Rule.NodeParentExtension>();
      node.source.value =
        'import { Something } from "root/directory/to/subscription/path/to/some/other/file.ts"';

      // When
      NoCrossDomainImport.checkNoCrossDomainImport(ruleContext, node);

      // Then
      expect(ruleContext.report).toHaveBeenCalledTimes(0);
    });
  });

  describe('When current file belongs to some identified domain', () => {
    describe('and that an import comes from another domain than ones specified', () => {
      it('does nothing', () => {
        // Given
        const notIdentifiedDomain = 'some-unidentified-domain';
        ruleContext = mock<Rule.RuleContext>();
        ruleContext.physicalFilename = 'root/directory/subscription/path/to/some/file.ts';
        ruleContext.options = rulesOptions;
        node = mock<ImportDeclaration & Rule.NodeParentExtension>();
        node.source.value = `import { Something } from "root/${notIdentifiedDomain}/path/to/some/other/file.ts"`;

        // When
        NoCrossDomainImport.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledTimes(0);
      });
    });

    describe('and that an import come from specified domain', () => {
      it('reports the bug', () => {
        // Given
        ruleContext = mock<Rule.RuleContext>();
        ruleContext.physicalFilename = 'root/directory/subscription/path/to/some/file.ts';
        ruleContext.options = rulesOptions;
        node = mock<ImportDeclaration & Rule.NodeParentExtension>();
        node.source.value = `import { Something } from "root/directory/billing/path/to/some/file.ts"`;

        // When
        NoCrossDomainImport.checkNoCrossDomainImport(ruleContext, node);

        // Then
        expect(ruleContext.report).toHaveBeenCalledWith({ node, message });
      });
    });
  });

  describe('When no configuration is provided', () => {
    it('does nothing', () => {
      // Given
      const notIdentifiedDomain = 'some-unidentified-domain';
      ruleContext = mock<Rule.RuleContext>();
      ruleContext.physicalFilename = `root/${notIdentifiedDomain}/path/to/some/file.ts`;
      // @ts-ignore
      ruleContext.options = undefined;
      node = mock<ImportDeclaration & Rule.NodeParentExtension>();
      node.source.value =
        'import { Something } from "root/directory/to/subscription/path/to/some/other/file.ts"';

      // When
      NoCrossDomainImport.checkNoCrossDomainImport(ruleContext, node);

      // Then
      expect(ruleContext.report).toHaveBeenCalledTimes(0);
    });
  });
});
