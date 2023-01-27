# @sefr/eslint-plugin ✨

- [What does it do ?](#what-does-it-do--)
- [Compatibility](#compatibility-)
- [Dependencies](#dependencies-)
- [Installation](#installation-)
- [How to use rules](#how-to-use-rules-)
- [Incorrect usages](#incorrect-usages-)
- [Credits](#credits-)
- [License](#license-)

## What does it do ? 💡

Provide a set of rules that you can use within [ESLint](https://eslint.org/).

## Compatibility 🔧

| TypeScript | EcmaScript |
|------------|------------|
| \>= 2.8.0  | \>= ES2015 |

## Dependencies 🎱

This package is dependencies-free.

## Installation 💾

Nothing more than :

```shell
npm i -S @sefr/eslint-plugin
```

## How to use rules 📚

### @sefr/no-cross-sub-context-import

Rule to check if an import is made from another subcontext than the one of the current file. This rule will check if 
import path in a related subcontext is matching one of the forbidden subcontext's names you can provide to the rule
that way :

```json
{
  // ...
  "plugins": [
    "@1j1s"
  ],
  "rules": {
    "@sefr/no-cross-subcontext-import": [
      "error",
      [
        {
          "namedSubContext": "my-first-sub-context",
          "forbiddenSubContextImport": ["my-second-sub-context"]
        }
      ]
    ]
  }
}
```

What does this above description mean ?

- Rule is defined as an array ;
- First argument is the rule criticality level for `ESLint`. In the above example, rule criticality level is `"error"` ;
- Second argument is an array of object containing two properties :
  - `"namedSubContext"` is the name of the subcontext you want to check cross-import from ;
  - `"forbiddenSubContextImport"` is an array of names of the subcontexts you want to forbid an import for the subcontext.

✅ Valid code example with the above rule :

```typescript
/*
 Admit current file path is "/path/to/my-first-sub-context/file-name.ts"
 Admit current subcontext name is "my-first-sub-context"
 */
import { doSomething } from "src/path/to/my-first-sub-context/do-something.ts";

const toto: string = doSomething(true);
```

Why is the above code valid ? Because the only import is from the same subcontext than the file.

❌ Invalid code example :

```typescript
/*
 Admit current file path is "/path/to/my-first-sub-context/file-name.ts"
 Admit current subcontext name is "my-first-sub-context"
 */
import { doSomething } from "src/path/to/my-second-sub-context/do-something.ts";

const toto: string = doSomething(true);
```

Why is the above code invalid ? Because the only import is from an other subcontext than the file.

## Incorrect usages ❌

❌ Invalid rule definition :

```json
{
  // ...
  "plugins": [
    "@1j1s"
  ],
  "rules": {
    "@sefr/no-cross-subcontext-import": "error"
  }
}
```

To be honest, it'll work. But as you didn't define any subcontext, it won't report any code style error within ESLint.

## Credits 📎

+ Developed with the awesome [TypeScript](https://www.typescriptlang.org/)

## License 📜

This software is available under the MIT License. See the [LICENSE](LICENSE.md) file for more informations.

⬆️ [Go back to top](#sefrnullable-)
