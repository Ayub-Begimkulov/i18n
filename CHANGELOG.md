## Version 0.2.1

- removed `inferParameterTypes` because of the issues with TypeScript

## Version 0.2.0

- Added new flag in I18N options called `inferParameterTypes` which could automatically infer mustache parameters.

## Version 0.1.1

- Added a `createPluralize` function instead of the separate `pluralizeEn` / `pluralizeRu` functions.
- Deprecated `pluralizeEn` and `pluralizeRu` functions.
- Improved documentation.

## Version 0.0.5

- `useI18n` hook now returns an object instead of the `I18N` instance. The returned values are now bound and will update it's reference whenever the language changes. Also `getLang` was deprecated in favor of the `lang`.

## Version 0.0.4

- Initial release.
