# ✨ @sefr/eslint-plugin

- [What does it do ?](#-what-does-it-do)
- [Compatibility](#-compatibility)
- [Dependencies](#-dependencies)
- [Installation](#-installation)
- [How to use rules](#-how-to-use-rules)
- [Incorrect usages](#-incorrect-usages)
- [Credits](#-credits)
- [License](#-license)

## 💡 What does it do ?

Provide a set of rules that you can use within [ESLint](https://eslint.org/).

## 🔧 Compatibility

| TypeScript | EcmaScript |
|------------|------------|
| \>= 2.8.0  | \>= ES2015 |

## 🎱 Dependencies

This package is dependencies-free.

## 💾 Installation

Nothing more than :

```shell
npm i -S @sefr/eslint-plugin
```

## 📚 How to use rules

### @sefr/no-cross-domain-import

Rule to check if an import is made from another domain than the one of the current file. This rule will check if 
import path in a related domain is matching one of the excluded domain's names you can provide to the rule
that way :

```json
{
  // ...
  "plugins": [
    "@sefr"
  ],
  "rules": {
    "@sefr/no-cross-domain-import": [
      "error",
      [
        {
          "domain": "my-first-domain",
          "domainsToExclude": ["my-second-domain"]
        },
        {
          "domain": "my-second-domain",
          "domainsToExclude": ["my-first-domain"]
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
  - `"domain"` is the name of the domain you want to check cross-import from ;
  - `"domainsToExclude"` is an array of names of the domains you want to forbid an import from.

✅ ESLint will not report an error for the following code :

```typescript
/*
 Admit current file path is "/path/to/my-first-domain/file-name.ts"
 Admit current subcontext name is "my-first-domain"
 */
import { doSomething } from "src/path/to/my-first-domain/do-something.ts";

const toto: string = doSomething(true);
```

Why is the above code valid ? Because the only import is from the same domain than the file.

❌ ESLint will report an error for the following code :

```typescript
/*
 Admit current file path is "/path/to/my-first-domain/file-name.ts"
 Admit current subcontext name is "my-first-domain"
 */
import { doSomething } from "src/path/to/my-second-domain/do-something.ts";

const toto: string = doSomething(true);
```

Why is the above code invalid ? Because the only import is from an other domain than the file.

## ❌ Incorrect usages

❌ Invalid rule definition :

```json
{
  // ...
  "plugins": [
    "@sefr"
  ],
  "rules": {
    "@sefr/no-cross-domain-import": "error"
  }
}
```

To be honest, it'll work. But as you didn't define any domain, it won't report any code style error within ESLint.

## 📎 Credits

+ Developed with the awesome [TypeScript](https://www.typescriptlang.org/)
+ Tested with [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [Sinon](https://sinonjs.org/)

## 📜 License

This software is available under the MIT License. See the [LICENSE](LICENSE.md) file for more informations.

⬆️ [Go back to top](#-sefreslint-plugin)
