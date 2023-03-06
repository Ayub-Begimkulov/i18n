import {
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import type { I18N } from "../i18n";
import { I18NContext } from "./context";

function useI18NContext() {
  const i18n = useContext(I18NContext);

  if (!i18n) {
    throw new Error("can not `useI18NContext` outside of the `I18NProvider`");
  }

  return i18n;
}

interface ReactI18N<I18NType extends I18N<any>> {
  readonly lang: ReturnType<I18NType["getLang"]>;
  get: I18NType["get"];
  /**
   * @deprecated use `lang` instead
   */
  getLang: I18NType["getLang"];
  setLang: I18NType["setLang"];
  subscribe: I18NType["subscribe"];
}

export function useI18N<I18NType extends I18N<any>>() {
  const i18n = useI18NContext() as I18NType;
  const [{ langState, updateCount }, setLangState] = useState(() => ({
    langState: i18n.getLang(),
    updateCount: 0,
  }));
  const usesLang = useRef(false);

  useEffect(() => {
    i18n.subscribe((lang) => {
      // only update the state if
      // the lang is used
      if (!usesLang.current) {
        return;
      }

      setLangState((state) => ({
        langState: lang,
        updateCount: state.updateCount + 1,
      }));
    });
  }, [i18n]);

  const get: typeof i18n.get = useCallback(
    (key, ...rest) => {
      usesLang.current = true;
      return i18n.get(key, ...rest);
    },
    // include the `updateCount` into the deps array
    // so that `get` function changes it's reference whenever
    // the languages changes or the translations are loaded
    [i18n, updateCount]
  );

  const getLang: typeof i18n.getLang = useCallback(
    () => {
      usesLang.current = true;
      return i18n.getLang();
    },
    // include the `langState` into the deps array
    // so that `get` function changes it's reference whenever
    // the languages changes
    [i18n, langState]
  );

  const setLang: typeof i18n.setLang = useCallback(
    (newLang) => i18n.setLang(newLang),
    [i18n]
  );

  const subscribe: typeof i18n.subscribe = useCallback(
    (cb, options) => i18n.subscribe(cb, options),
    [i18n]
  );

  const reactI18N = {
    get lang() {
      usesLang.current = true;
      return langState;
    },
    get,
    getLang,
    setLang,
    subscribe,
  } as ReactI18N<I18NType>;

  return reactI18N;
}

export function useTranslate<I18NType extends I18N<any>>() {
  const i18n = useI18NContext();
  const [updateCount, triggerUpdate] = useReducer((v) => v + 1, 0);

  useEffect(() => {
    return i18n.subscribe(() => {
      triggerUpdate();
    });
  }, []);

  const translate: I18NType["get"] = useCallback(
    (key, ...rest) => {
      return i18n.get(key, ...rest);
    },
    // include the `updateCount` into the deps array
    // so that translate changes it's reference whenever the language changes
    [updateCount]
  );

  return translate;
}
