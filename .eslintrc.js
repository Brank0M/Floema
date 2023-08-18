module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  globals: {
    $: "readonly",
  },
  extends: "standard",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    singleQuote: "true",
  },
};
