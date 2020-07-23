module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        jquery: true
    },
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'no-unused-vars': 'warn',
        'no-useless-constructor': 'off',
        'space-before-function-paren': 'off',
        'lines-between-class-members': 'off',
        'member-delimiter-style': 'off',
        '@typescript-eslint/camelcase': 'off'
    }
}
