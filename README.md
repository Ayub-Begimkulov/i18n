# @ayub-begimkulov/i18n

Small and type-safe package to create multi-language interfaces.

Features

- Base i18n functionality (interpolation, rich text, pluralization).
- Full TS support. They types are inferred, no need to write anything by hand.
- React hooks and components.
- Ability to load translations asynchronously (from the server or by lazy loading).
- Ability to work with plurals format that is comfortable for you.

## Installation

```shell
npm i @ayub-begimkulov/i18n
```

## Usage

### Basic example

```ts
import { I18N, createPluralize } from "@ayub-begimkulov/i18n";
import en from "./keys/en.json";
import ru from "./keys/ru.json";

const pluralizeEn = createPluralize("en");
const pluralizeRu = createPluralize("ru");

const i18n = new I18N({
  defaultLang: "en",
  languages: {
    en: {
      keyset: en,
      pluralize: pluralizeEn,
    },
    ru: {
      keyset: ru,
      pluralize: pluralizeRu,
    },
  },
});

i18n.get("greeting"); // Hello
```

### Using with React

```ts
// i18n.ts
import {
  I18N,
  createPluralize,
  useTranslate as useTranslateBase,
  useI18n as useI18nBase,
} from "@ayub-begimkulov/i18n";
import en from "./keys/en.json";
import ru from "./keys/ru.json";

const pluralizeEn = createPluralize("en");
const pluralizeRu = createPluralize("ru");

const i18n = new I18N({
  defaultLang: "en",
  languages: {
    en: {
      keyset: en,
      pluralize: pluralizeEn,
    },
    ru: {
      keyset: ru,
      pluralize: pluralizeRu,
    },
  },
});

export const useTranslate = useTranslateBase<typeof i18n>;
export const useI18n = useI18nBase<typeof i18n>;

// index.tsx
import { I18NProvider } from "@ayub-begimkulov/i18n";
import { i18n } from "./i18n";

// ...

root.render(
  <I18NProvider i18n={i18n}>
    <App />
  </I18NProvider>
);

// component.ts
import { useTranslate } from "./i18n";

const Component = () => {
  const translate = useTranslate();

  return <div>{translate("some_key")}</div>;
};
```

<!-- ## Motivation

I decided to create this library after quite some time of working with a few multi language projects. As you may know, there are a lot of solutions, but most of them didn't match my needs.

Why use this project over the other ones:

-  -->

## Recipes

TODO

## Reference

### `I18N`

Class that is responsible for loading/storing translations and updating language. All the react functionality leverages `I18N` API to update components whenever needed.

Example:

```ts
import { I18N, createPluralize } from "@ayub-begimkulov/i18n";
import en from "./keys/en.json";
import ru from "./keys/ru.json";

const pluralizeEn = createPluralize("en");
const pluralizeRu = createPluralize("ru");

const i18n = new I18N({
  defaultLang: "en",
  languages: {
    en: {
      keyset: en,
      pluralize: pluralizeEn,
    },
    ru: {
      keyset: ru,
      pluralize: pluralizeRu,
    },
  },
});

i18n.get("greeting"); // 'Hello'
```

### `createPluralize`

Creates a pluralize function for a given locale that will return a plural format for a specific number of items. Leverages [`Intl.PluralRules`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) under the hood.

Example:

```ts
import { createPluralize } from "@ayub-begimkulov/i18n";

const pluralizeEn = createPluralize("en");

pluralizeEn(1); // 'one'
pluralizeEn(0); // 'other'
```

### `I18NProvider`

A wrapper around React context provider. Used to share `I18N` instance across the components. Mostly used inside of the library hooks (`useI18n`/`useTranslate`).

Example:

```tsx
import { I18NProvider } from '@ayub-begimkulov/i18n';
import { App } from './App';
import { i18n } form './i18n';

root.render(
  <I18NProvider i18n={i18n}>
    <App />
  </I18NProvider>
)
```

### `useI18n`

TODO

### `useTranslate`

TODO

### `TaggedText`

TODO

## License

MIT.
