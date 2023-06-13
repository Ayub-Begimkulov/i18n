import { I18N } from "../i18n";
import { createPluralize } from "../plurals";

const keysets = {
  en: {
    test: "test",
    welcome: "Welcome, {{name}}",
    some_key: "some key",
    plural: {
      one: "{{count}} item",
      other: "{{count}} items",
    },
    plural_interpolation: {
      one: "{{count}} item {{name}}",
      other: "{{count}} items {{name}}",
    },
  },
  ru: {
    test: "тест",
    welcome: "Добро пожаловать, {{name}}",
    some_key: "Какой-то ключ",
    plural: {
      one: "{{count}} элемент",
      few: "{{count}} элемента",
      many: "{{count}} элементов",
      other: "{{count}} элементов",
    },
    plural_interpolation: {
      one: "{{count}} элемент {{name}}",
      few: "{{count}} элемента {{name}}",
      many: "{{count}} элементов {{name}}",
      other: "{{count}} элементов {{name}}",
    },
  },
} as const;

const createI18n = () => {
  const i18n = new I18N({
    defaultLang: "en",
    languages: {
      en: {
        keyset: keysets.en,
        pluralize: createPluralize("en"),
      },
      ru: {
        keyset: keysets.ru,
        pluralize: createPluralize("ru"),
      },
    },
  });
  return i18n;
};

const createI18nAsync = () => {
  const i18n = new I18N({
    defaultLang: "en",
    languages: {
      en: {
        keyset: () =>
          new Promise<typeof keysets.en>((resolve) =>
            setTimeout(resolve, 100, keysets.en)
          ),
        pluralize: createPluralize("en"),
      },
      ru: {
        keyset: () =>
          new Promise<typeof keysets.ru>((resolve) =>
            setTimeout(resolve, 100, keysets.ru)
          ),
        pluralize: createPluralize("ru"),
      },
    },
  });
  return i18n;
};

const waitForLoad = () => {
  return new Promise((resolve) => setTimeout(resolve, 105));
};

describe("I18N", () => {
  describe("get", () => {
    it("should get a translation by key", () => {
      const i18n = createI18n();

      expect(i18n.get("test")).toBe("test");

      i18n.setLang("ru");

      expect(i18n.get("test")).toBe("тест");
    });

    it("should return key if translation doesn't exist", () => {
      const i18n = createI18n();

      // @ts-expect-error
      expect(i18n.get("asdfadfasdfadsf")).toBe("asdfadfasdfadsf");

      i18n.setLang("ru");

      // @ts-expect-error
      expect(i18n.get("asdfadfasdfadsf")).toBe("asdfadfasdfadsf");
    });

    it("should interpolate parameters into the key", () => {
      const i18n = createI18n();

      expect(i18n.get("welcome", { name: "Ayub" })).toBe("Welcome, Ayub");

      i18n.setLang("ru");

      expect(i18n.get("welcome", { name: "Ayub" })).toBe(
        "Добро пожаловать, Ayub"
      );
    });

    it("should leave mustaches if the parameter is not passed", () => {
      const i18n = createI18n();

      expect(i18n.get("welcome")).toBe("Welcome, {{name}}");

      i18n.setLang("ru");

      expect(i18n.get("welcome")).toBe("Добро пожаловать, {{name}}");
    });

    it("should select a correct plural", () => {
      const i18n = createI18n();

      expect(i18n.get("plural", { count: 0 })).toBe("0 items");
      expect(i18n.get("plural", { count: 1 })).toBe("1 item");
      expect(i18n.get("plural", { count: 11 })).toBe("11 items");

      i18n.setLang("ru");

      expect(i18n.get("plural", { count: 0 })).toBe("0 элементов");
      expect(i18n.get("plural", { count: 1 })).toBe("1 элемент");
      expect(i18n.get("plural", { count: 2 })).toBe("2 элемента");
      expect(i18n.get("plural", { count: 11 })).toBe("11 элементов");
    });

    it("interpolate parameters with plurals", () => {
      const i18n = createI18n();

      expect(i18n.get("plural_interpolation", { name: "Ayub", count: 0 })).toBe(
        "0 items Ayub"
      );
      expect(i18n.get("plural_interpolation", { name: "Ayub", count: 1 })).toBe(
        "1 item Ayub"
      );
      expect(
        i18n.get("plural_interpolation", { name: "Ayub", count: 11 })
      ).toBe("11 items Ayub");

      i18n.setLang("ru");

      expect(i18n.get("plural_interpolation", { name: "Айюб", count: 0 })).toBe(
        "0 элементов Айюб"
      );
      expect(i18n.get("plural_interpolation", { name: "Айюб", count: 1 })).toBe(
        "1 элемент Айюб"
      );
      expect(i18n.get("plural_interpolation", { name: "Айюб", count: 2 })).toBe(
        "2 элемента Айюб"
      );
      expect(
        i18n.get("plural_interpolation", { name: "Айюб", count: 11 })
      ).toBe("11 элементов Айюб");
    });

    it("should return key until the keyset is resolved", async () => {
      const i18n = createI18nAsync();

      expect(i18n.get("some_key")).toBe("some_key");

      await waitForLoad();

      expect(i18n.get("some_key")).toBe("some key");

      i18n.setLang("ru");

      expect(i18n.get("some_key")).toBe("some key");
      expect(i18n.getLang()).toBe("en");

      await waitForLoad();

      expect(i18n.get("some_key")).toBe("Какой-то ключ");
      expect(i18n.getLang()).toBe("ru");
    });
  });

  describe("getLang + setLang", () => {
    it("should return a current lang", () => {
      const i18n = createI18n();

      expect(i18n.getLang()).toBe("en");

      i18n.setLang("ru");

      expect(i18n.getLang()).toBe("ru");
    });

    it("should not update language till keyset is resolved", async () => {
      const i18n = createI18nAsync();

      expect(i18n.getLang()).toBe("en");

      await waitForLoad();

      expect(i18n.getLang()).toBe("en");

      i18n.setLang("ru");

      expect(i18n.getLang()).toBe("en");

      await waitForLoad();

      expect(i18n.getLang()).toBe("ru");

      i18n.setLang("en");
      expect(i18n.getLang()).toBe("en");
    });

    it("should throw an error if keyset couldn't be resolved", async () => {
      const error = new Error("test error");

      const i18n = new I18N({
        defaultLang: "ru",
        languages: {
          en: {
            keyset: () => {
              return new Promise<{ test: "test" }>((_res, rej) => {
                setTimeout(() => {
                  rej(error);
                }, 100);
              });
            },
            pluralize: createPluralize("en"),
          },
          ru: {
            keyset: keysets.ru,
            pluralize: createPluralize("ru"),
          },
        },
      });

      expect(i18n.get("test")).toBe("тест");

      const catchHandler = jest.fn();
      i18n.setLang("en").catch(catchHandler);

      expect(catchHandler).not.toBeCalled();

      await waitForLoad();

      expect(catchHandler).toBeCalledTimes(1);
      expect(catchHandler).toBeCalledWith(error);
    });
  });

  describe("i18n.subscribe", () => {
    it("should subscribe to language changes", () => {
      const i18n = createI18n();

      const subscriber = jest.fn();

      i18n.subscribe(subscriber);

      i18n.setLang("ru");

      expect(subscriber).toBeCalledTimes(1);
      expect(subscriber).toBeCalledWith("ru");
    });

    it("should subscribe to language changes immediate", () => {
      const i18n = createI18n();

      const subscriber = jest.fn();

      i18n.subscribe(subscriber, { immediate: true });

      expect(subscriber).toBeCalledTimes(1);
      expect(subscriber).toBeCalledWith("en");

      i18n.setLang("ru");

      expect(subscriber).toBeCalledTimes(2);
      expect(subscriber).toBeCalledWith("ru");
    });

    it("should subscribe to language changes with async keys", async () => {
      const i18n = createI18nAsync();

      const subscriber = jest.fn();

      i18n.subscribe(subscriber);

      await waitForLoad();

      expect(subscriber).toBeCalledTimes(1);
      expect(subscriber).toBeCalledWith("en");

      i18n.setLang("ru");

      await waitForLoad();

      expect(subscriber).toBeCalledTimes(2);
      expect(subscriber).toBeCalledWith("ru");
    });
  });
});
