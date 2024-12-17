import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    dts: true,
    clean: true,
    keepNames: true,
    bundle: true,
    minify: true,
    target: 'es2022',
    globalName: 'KodikWrapper',
    format: ['cjs', 'esm', 'iife'],
    outExtension({ format, pkgType }) {
      console.log(pkgType, format);
      return {
        js: `.${format === 'iife' ? 'global' : format}.prod.js`,
      }
    },
  },
  {
    entry: ['src/index.ts'],
    dts: true,
    keepNames: true,
    bundle: true,
    target: 'es2022',
    globalName: 'KodikWrapper',
    format: ['cjs', 'esm', 'iife'],
    outExtension({ format, pkgType }) {
      console.log(pkgType, format);
      return {
        js: `.${format === 'iife' ? 'global' : format}.js`,
      }
    },
  }
]);
