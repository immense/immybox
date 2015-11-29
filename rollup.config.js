import babel from 'rollup-plugin-babel';
import npm from 'rollup-plugin-npm';

export default {
  entry: 'src/immybox.js',
  dest: 'build/immybox.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ImmyBox',
  globals: { },
  plugins: [
    babel()
  ],
  sourcemap: 'build/immybox.js.map'
};
