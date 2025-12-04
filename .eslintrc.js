module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
  },
  overrides: [
    {
      // if the file is at repo root; otherwise use '**/component-models.json'
      files: ['component-models.json'],
      rules: {
        'xwalk/max-cells': 'off',
      },
    },

    // (optional) only if you also want to relax the custom resource type rule
    // {
    //   files: ['component-definition.json'],
    //   rules: { 'xwalk/no-custom-resource-types': 'off' },
    // },
  ],
};
