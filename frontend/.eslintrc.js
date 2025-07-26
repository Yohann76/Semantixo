module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // Vue 3 Composition API globals
    'vue/script-setup-uses-vars': 'error',
    'vue/no-undef-components': 'off' // Désactivé car Vue Router est global
  },
  globals: {
    // Vue 3 Composition API macros
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
    // Vue Router components
    'router-view': 'readonly',
    'router-link': 'readonly'
  }
} 