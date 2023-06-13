import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { I18N } from "../../i18n";
import { createPluralize } from "../../plurals";
import { useTranslate } from "../hooks";
import { I18NProvider } from "../components";

describe("useTranslate", () => {
  it("should return a correct translation", () => {
    const i18n = new I18N({
      defaultLang: "en",
      languages: {
        en: {
          keyset: {
            test: "test",
          },
          pluralize: createPluralize("en"),
        },
      },
    });

    function TestComponent() {
      const translate = useTranslate<typeof i18n>();
      return <div data-testid="translation">{translate("test")}</div>;
    }

    const { getByTestId } = render(
      <I18NProvider i18n={i18n}>
        <TestComponent />
      </I18NProvider>
    );

    expect(getByTestId("translation")).toHaveTextContent("test");
  });

  it("should return a correct translation", () => {
    const i18n = new I18N({
      defaultLang: "en",
      languages: {
        en: {
          keyset: {
            test: "test {{name}}",
          },
          pluralize: createPluralize("en"),
        },
      },
    });

    function TestComponent() {
      const translate = useTranslate<typeof i18n>();
      return (
        <div data-testid="translation">
          {translate("test", { name: "asdf" })}
        </div>
      );
    }

    const { getByTestId } = render(
      <I18NProvider i18n={i18n}>
        <TestComponent />
      </I18NProvider>
    );

    expect(getByTestId("translation")).toHaveTextContent("test asdf");
  });

  it("should return a correct translation", () => {
    const i18n = new I18N({
      defaultLang: "en",
      languages: {
        en: {
          keyset: {
            test: "test {{name}}",
          },
          pluralize: createPluralize("en"),
        },
      },
    });

    function TestComponent() {
      const translate = useTranslate<typeof i18n>();
      return (
        <div data-testid="translation">
          {translate("test", { name: "asdf" })}
        </div>
      );
    }

    const { getByTestId } = render(
      <I18NProvider i18n={i18n}>
        <TestComponent />
      </I18NProvider>
    );

    expect(getByTestId("translation")).toHaveTextContent("test asdf");
  });
});
