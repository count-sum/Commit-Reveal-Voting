// @ts-check
const tseslint = require('@typescript-eslint/eslint-plugin');
const parser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');

module.exports = [
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: parser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
            'prettier': prettier,
        },
        rules: {
            // TypeScript-specific rules
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],

            // Prettier integration
            'prettier/prettier': [
                'error',
                {
                    singleQuote: true,
                    trailingComma: 'es5',
                    printWidth: 100,
                    tabWidth: 4,
                    semi: true,
                    arrowParens: 'avoid',
                },
            ],

            // General best practices
            'no-console': 'warn',
            'prefer-const': 'warn',
        },
    },
    {
        ignores: [
            'node_modules/',
            'dist/',
            'build/',
            'coverage/',
            '.next/',
            '**/*.js',  // Ignore JavaScript files if using TypeScript
            'eslint.config.js'
        ],
    },
];