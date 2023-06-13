## Примеры

Самый простой:

```ts
import { I18N, createPluralize } from "@ayub-begimkulov/i18n";

const i18n = new I18N({
  defaultLanguage: "en",
  languages: {
    en: {
      keyset: {
        test: "test",
      },
      pluralize: createPluralize("en"),
    },
    ru: {
      keyset: {
        test: "тест",
      },
      pluralize: createPluralize("ru"),
    },
  },
});

i18n.get("test"); // 'test'
i18n.setLang("ru");
i18n.get("test"); // 'тест'
```

Интерполяция:

```ts
import { I18N, createPluralize } from "@ayub-begimkulov/i18n";

const i18n = new I18N({
  defaultLanguage: "en",
  languages: {
    en: {
      keyset: {
        welcome_message: "Welcome, {{name}}",
      },
      pluralize: createPluralize("en"),
    },
    ru: {
      keyset: {
        welcome_message: "Добро пожаловать, {{name}}",
      },
      pluralize: createPluralize("ru"),
    },
  },
});

i18n.get("welcome_message", { name: "Ayub" }); // 'Welcome, Ayub'
i18n.setLang("ru");
i18n.get("welcome_message", { name: "Айюб" }); // 'Добро пожаловать, Айюб'
```

Плюральные формы:

```ts
import { I18N, createPluralize } from "@ayub-begimkulov/i18n";

const i18n = new I18N({
  defaultLanguage: "en",
  languages: {
    en: {
      keyset: {
        test: "test",
        plural: {
          one: "{{count}} item",
          other: "{{count}} items",
        },
      },
      pluralize: createPluralize("en"),
    },
    ru: {
      keyset: {
        test: "тест",
        plural: {
          one: "{{count}} элемент",
          few: "{{count}} элемента",
          many: "{{count}} элементов",
          other: "{{count}} элементов",
        },
      },
      pluralize: createPluralize("ru"),
    },
  },
});

i18n.getLang(); // 'en'

i18n.get("plural", { count: 0 }); // '0 items'
i18n.get("plural", { count: 1 }); // '1 item'
i18n.get("plural", { count: 5 }); // '5 items'

i18n.setLang("ru");

i18n.get("plural", { count: 0 }); // '0 элементов'
i18n.get("plural", { count: 1 }); // '1 элемент'
i18n.get("plural", { count: 2 }); // '2 'элемента'
i18n.get("plural", { count: 7 }); // '7 'элементов'

i18n.getLang(); // 'ru'
```

Асинхронная подгрузка ключей:

```ts
import { I18N, createPluralize } from "@ayub-begimkulov/i18n";

const keysets = {
  en: {
    test: "test",
    some_key: "some key",
    plural: {
      one: "{{count}} item",
      other: "{{count}} items",
    },
  },
  ru: {
    test: "тест",
    some_key: "какой-то ключ",
    plural: {
      one: "{{count}} элемент",
      few: "{{count}} элемента",
      many: "{{count}} элементов",
      other: "{{count}} элементов",
    },
  },
};

const loadKeyset = (lang) => () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(keysets[lang]);
    }, 1000);
  });
};

const i18n = new I18N({
  defaultLanguage: "en",
  languages: {
    en: {
      keyset: loadKeyset("en"),
      pluralize: createPluralize("en"),
    },
    ru: {
      keyset: loadKeyset("ru"),
      pluralize: createPluralize("ru"),
    },
  },
});

i18n.get("some_key"); // 'some_key'

setTimeout(() => {
  i18n.get("some_key"); // 'some key'
}, 1010);
```

Работа с React:

```tsx
import {
  I18N,
  I18NProvider,
  useI18n,
  useTranslate,
} from "@ayub-begimkulov/i18n";

const keysets = {
  en: {
    keyset: {
      test: "test",
      some_key: "some key",
      plural: {
        one: "{{count}} item",
        other: "{{count}} items",
      },
    },
  },
  ru: {
    keyset: {
      test: "тест",
      some_key: "какой-то ключ",
      plural: {
        one: "{{count}} элемент",
        few: "{{count}} элемента",
        many: "{{count}} элементов",
        other: "{{count}} элементов",
      },
    },
  },
};

const loadKeyset = (lang) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      keysets[lang];
    }, 1000);
  });
};

const i18n = new I18N({
  defaultLanguage: "en",
  languages: {
    en: {
      keyset: loadKeyset("en"),
      pluralize: createPluralize("en"),
    },
    ru: {
      keyset: loadKeyset("ru"),
      pluralize: createPluralize("ru"),
    },
  },
});

const App = () => {
  return (
    <I18NProvider i18n={i18n}>
      <Component />
    </I18NProvider>
  );
};

const Component = () => {
  const { lang, setLang } = useI18n();
  const t = useTranslate();

  return (
    <div>
      <LanguageSelect lang={lang} onChange={setLang} />

      {t("welcome_message")}
    </div>
  );
};
```

Интерполяция + React:

```tsx
import {
  I18N,
  createPluralize,
  useTranslate,
  TaggedText,
} from "@ayub-begimkulov/i18n";

const i18n = new I18N({
  defaultLanguage: "en",
  languages: {
    en: {
      keyset: {
        read_the_docs:
          "to get more info, read <1>the documentation</1> or contact our <2>support</2>",
      },
      pluralize: createPluralize("en"),
    },
    ru: {
      keyset: {
        read_the_docs:
          "Чтобы получит больше информации, ознакомтесь <1>с документацией</1> или свяжитесь с нашей <2>поддержкой</2>",
      },
      pluralize: createPluralize("ru"),
    },
  },
});

const App = () => {
  return (
    <I18NProvider i18n={i18n}>
      <Component />
    </I18NProvider>
  );
};

const Component = () => {
  const t = useTranslate();

  return (
    <div>
      <TaggedText
        text={t("read_the_docs")}
        tags={{
          1: (text) => <a href="/docs">{text}</a>,
          2: (text) => <a href="/support">{text}</a>,
        }}
      />
    </div>
  );
};
```

## Дальнейшие действия

- Пройти по каждому из элементов фукнционала и расписать то, что нам нужно тестировать
  - Смотрим на возможности каждого их модулей и оцениваем все корнер кейсы
- Написать тесты на каждый из кейсов
- Убедиться, что нету ошибок

- Тесты на типизацию (отдельное видео).
