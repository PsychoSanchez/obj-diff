import typescript from 'rollup-plugin-typescript';
import {terser} from 'rollup-plugin-terser';

export default {
  input: './src/index.ts',
  plugins: [
    typescript(),
    terser({
      output: {
        comments: () => false
      }
    })
  ],
  output: {
    // dir: './dist/',
    file: './dist/diff.min.js',
    format: 'umd',
    name: 'ObjDiff'
  }
};
