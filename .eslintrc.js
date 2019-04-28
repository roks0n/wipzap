module.exports = {
  env: {
    es6: true,
    node: true,
    mocha: true,
  },
  extends: ['eslint:recommended', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
  plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
  parserOptions: {
    ecmaVersion: 2018,
  },
  globals: {
    process: true,
  },
  rules: {
    'global-require': 1,
    'prettier/prettier': [ // customizing prettier rules (unfortunately not many of them are customizable)
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
    eqeqeq: ['error', 'always'], // adding some custom ESLint rules
  },
};
