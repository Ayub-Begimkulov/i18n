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
npm i @galera/i18n
```

## Usage

```ts
import { I18N, pluralizeEn, pluralizeRu } from "@ayub-begimkulov/i18n";
import en from "./keys/en.json";
import ru from "./keys/ru.json";

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

And if you use it with react:

```ts
// i18n.ts
import {
  I18N,
  pluralizeEn,
  pluralizeRu,
  useTranslate as useTranslateBase,
  useI18n as useI18nBase,
} from "@ayub-begimkulov/i18n";
import en from "./keys/en.json";
import ru from "./keys/ru.json";

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

## License

MIT.
