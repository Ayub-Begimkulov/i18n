// we might have translation as an object, if it's plural
type Translation = string | Record<string, string>;
type Keyset = Record<string, Translation>;

export type LanguageConfig = {
  keyset: Keyset | (() => Promise<Keyset>);
  pluralize: (count: number) => string;
};

interface I18NOptions<
  LanguagesMap extends Record<string, LanguageConfig>,
  InferParameterTypes extends boolean,
  Lang extends keyof LanguagesMap = keyof LanguagesMap
> {
  defaultLang: Lang;
  languages: LanguagesMap;
  inferParameterTypes?: InferParameterTypes;
}

type KeyType<KeysetsMap extends Record<string, LanguageConfig>> =
  keyof KeysetType<KeysetsMap>;

type KeysetType<KeysetsMap extends Record<string, LanguageConfig>> =
  UnwrapKeysetType<KeysetsMap[keyof KeysetsMap]["keyset"]>;

type UnwrapKeysetType<
  MaybeUnresolvedKeyset extends Keyset | (() => Promise<Keyset>)
> = MaybeUnresolvedKeyset extends () => Promise<infer ResolvedKeyset>
  ? ResolvedKeyset
  : MaybeUnresolvedKeyset;

type TranslationParameters<
  Translation extends string | Record<string, string>
> = Translation extends Record<string, string>
  ? TranslationParameters<Translation[keyof Translation]>
  : Translation extends string
  ? string extends Translation
    ? never
    : TranslationParametersKeys<Translation>
  : never;

type TranslationParametersKeys<
  Translation extends string,
  Params extends string = never
> = Translation extends `${string}{{${infer Param}}}${infer Rest}`
  ? TranslationParametersKeys<Rest, Params | TrimString<Param>>
  : Params;

type TrimString<String extends string> = String extends `${" "}${infer Rest}`
  ? TrimString<Rest>
  : String extends `${infer Rest}${" "}`
  ? TrimString<Rest>
  : String;

type GetRestParams<
  KeysetsMap extends Record<string, LanguageConfig>,
  Key extends KeyType<KeysetsMap>,
  InferParameterTypes extends boolean
> = KeysetType<KeysetsMap>[Key] extends object
  ? [
      options: InferParameterTypes extends true
        ? Record<
            TranslationParameters<KeysetType<KeysetsMap>[Key]>,
            string | number
          > & {
            count: number;
          }
        : { count: number; [key: string]: number | string }
    ]
  : InferParameterTypes extends true
  ? IsNever<TranslationParameters<KeysetType<KeysetsMap>[Key]>> extends false
    ? [
        options: Record<
          TranslationParameters<KeysetType<KeysetsMap>[Key]>,
          string | number
        >
      ]
    : [options?: Record<string, string | number>]
  : [options?: Record<string, string | number>];

type IsNever<T> = [T] extends [never] ? true : false;

export class I18N<
  KeysetsMap extends Record<string, LanguageConfig>,
  InferParameterTypes extends boolean = false
> {
  private lang: keyof KeysetsMap;
  private subscribers = new Set<(lang: keyof KeysetsMap) => void>();
  private keysets: KeysetsMap;

  constructor(options: I18NOptions<KeysetsMap, InferParameterTypes>) {
    this.keysets = options.languages;

    this.setLang(options.defaultLang);
    // call it just for the TS to not complain
    this.lang = options.defaultLang;
  }

  getLang() {
    return this.lang;
  }

  get<Key extends KeyType<KeysetsMap>>(
    key: Key,
    ...rest: GetRestParams<KeysetsMap, Key, InferParameterTypes>
  ): string {
    const { keyset, pluralize } = this.keysets[this.lang]!;

    if (typeof keyset === "function") {
      return String(key);
    }

    const translation: string | Record<string, string> | undefined =
      keyset[key];

    if (typeof translation === "undefined") {
      return String(key);
    }

    const params: Record<string, string | number> = rest[0] || {};

    if (typeof translation === "string") {
      return interpolateTranslation(translation, params);
    }

    const pluralKey = pluralize(params.count as number);

    const pluralizedTranslation = translation[pluralKey]!;

    return interpolateTranslation(pluralizedTranslation, params);
  }

  async setLang(newLang: keyof KeysetsMap) {
    try {
      if (newLang === this.lang) {
        return;
      }

      const { keyset } = this.keysets[newLang]!;

      if (typeof keyset === "function") {
        const resolvedKeyset = await keyset();

        this.keysets[newLang]!.keyset = resolvedKeyset;
      }

      this.lang = newLang;

      this.subscribers.forEach((cb) => cb(newLang));
    } catch (error) {
      console.error(
        `Error happened trying to update language. Can not resolve lazy loaded keyset for "${String(
          newLang
        )}" language. See the error below to get more details`
      );
      throw error;
    }
  }

  subscribe(
    cb: (fn: keyof KeysetsMap) => void,
    options?: { immediate: boolean }
  ) {
    this.subscribers.add(cb);

    if (options?.immediate) {
      cb(this.lang);
    }

    return () => {
      this.subscribers.delete(cb);
    };
  }
}

const mustacheParamRegex = /\{\{\s*([a-zA-Z10-9]+)\s*\}\}/g;

// not the most performant way, but it should be okay
function interpolateTranslation(
  translation: string,
  params: Record<string, string | number>
) {
  return translation.replace(mustacheParamRegex, (original, paramKey) => {
    if (paramKey in params) {
      return String(params[paramKey]);
    }

    return original;
  });
}
