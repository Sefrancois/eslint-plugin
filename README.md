# ✨ @sefr/eslint-plugin

- [What does it do ?](#-what-does-it-do)
- [Compatibility](#-compatibility)
- [Dependencies](#-dependencies)
- [Installation](#-installation)
- [How to use rules](#-how-to-use-rules)
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
 Admit current domain name is "my-first-domain"
 */
import { doSomething } from "src/path/to/my-first-domain/do-something.ts";

const toto: string = doSomething(true);
```

Why is the above code valid ? Because the only import is from the same domain than the file.

❌ ESLint will report an error for the following code :

```typescript
/*
 Admit current file path is "/path/to/my-first-domain/file-name.ts"
 Admit current domain name is "my-first-domain"
 */
import { doSomething } from "src/path/to/my-second-domain/do-something.ts";

const toto: string = doSomething(true);
```

Why is the above code invalid ? Because the only import is from an other domain than the file.

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

### @sefr/no-onion-architecture-violation

Rule to check if Onion architecture principles are respected. This rule doesn't need any additionnal configuration.

```json
{
  // ...
  "plugins": ["@sefr"],
  "rules": {
    "@sefr/no-onion-architecture-violation": "error"
  }
}
```

If you plan to use that rule, you must follow the following folders conventions :

#### Example :

Considering the following code organization :

```
src
├─── application-service
│    ├── some-service.ts
│    └── some-other-service.ts
├─── domain
│    ├── service
│    │   ├── some-domain-service.ts
│    │   └── some-other-domain-service.ts
│    └── model
│        ├── some-model.ts
│        └── some-other-model.ts
└─── infrastructure
     ├── some-http-client.ts
     └── some-data-access-object.ts
```

You can also set `domain-service` and `domain-model` at the same level as following :

```
src
├─── application-service
│    ├── some-service.ts
│    └── some-other-service.ts
├─── domain-service
│    ├── some-domain-service.ts
│    └── some-other-domain-service.ts  
├─── domain-model
│    ├── some-model.ts
│    └── some-other-model.ts
└─── infrastructure
     ├── some-http-client.ts
     └── some-data-access-object.ts
```

The root folder doesn't matter anyway.

✅ ESLint will not report an error for the following code :

```typescript
/*
 Admit current file path is "src/application-service/some-service.ts"
 */
import { doSomething } from "../domain/service/some-domaine-service.ts";

const toto: string = doSomething(true);
```

## 📎 Credits

+ Developed with the awesome [TypeScript](https://www.typescriptlang.org/)
+ Tested with [Mocha](https://mochajs.org/), [Chai](https://www.chaijs.com/) and [Sinon](https://sinonjs.org/)

## 📜 License

This software is available under the MIT License. See the [LICENSE](LICENSE.md) file for more informations.

⬆️ [Go back to top](#-sefreslint-plugin)
