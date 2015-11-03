[![Build Status](https://travis-ci.org/bitpay/copay-website.svg)](https://travis-ci.org/bitpay/copay-website) [![Dependency Status](https://david-dm.org/bitpay/copay-website.svg)](https://david-dm.org/bitpay/copay-website) [![devDependency Status](https://david-dm.org/bitpay/copay-website/dev-status.svg)](https://david-dm.org/bitpay/copay-website#info=devDependencies) [![Stories in Ready](https://badge.waffle.io/bitpay/copay-website.png?label=ready&title=Ready)](https://waffle.io/bitpay/copay-website)

# Run

```sh
$ npm install
$ npm start
```

# Developing

```sh
$ npm install -g gulp
$ npm install
$ gulp serve
```

## Production Build

```sh
$ gulp
```

Build and optimize the site, ready for deployment. This includes linting as well as image, script, stylesheet and HTML optimization and minification.

## Serve Production Build

```sh
$ gulp serve:dist
```

Serve the optimized and minified version of the site for local testing.

## Deploy to gh-pages

```sh
$ gulp deploy
```

This builds for production, then deploys the dist folder to gh-pages.

## Compress all images

```sh
$ gulp images
```

This command pipes all files in `src/images` through `imagemin`.

## Brand Assets
All Copay brand assets can be found in [copay-brand](https://github.com/bitpay/copay-brand).

## Translations
Translatable strings are extracted and added to the native locale file (`locales/en.json`) using [s18n](https://github.com/bitjson/s18n). A warning will be generated if a string is missing in any other locale file.

### Simulate Translations

```sh
npm run simulate-translations
```

Simulates translation by [mapping](https://github.com/bitjson/s18n#map) the `s18n` accents dictionary to the current `en.json`. This produces an `accents` locale, which can be previewed at the `/accents` route (e.g. [localhost:3000/accents/](http://localhost:3000/accents/))
