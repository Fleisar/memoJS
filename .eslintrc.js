module.exports = {
    env: {
        commonjs: true,
        es2020: true
    },
    extends: [
        'airbnb-typescript/base',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint'
    ],
    overrides: [
        {
            files: ['*.test.ts'],
            env: {
                jest: true,
            },
        },
    ],
};
