/*eslint no-console:0*/
import {ImmyBox, plugin_name, all_objects} from './immybox';
import {assert} from './utils';

// use one global click event listener to close/revert ones that are open
$('html').on('click', () => {
  all_objects.forEach(plugin => plugin.revert());
});

// use one global scoll/resize listener to reposition any result areas that are open
$(window).on('resize scroll', () => {
  all_objects.forEach(plugin => {
    plugin.queryResultAreaVisible && plugin.reposition();
  });
});
(function($) {
  $.fn.immybox = function(options, ...args) {
    let outputs = [];
    this.each((i, element) => {
      let plugin = all_objects.get(element);
      if (plugin) {
        // calling a method on a pre-immyboxed element
        assert(typeof options === 'string', `${plugin_name} already intitialized for this element`);
        assert(ImmyBox.pluginMethods.includes(options), `${plugin_name} has no method '${options}'`);
        outputs.push(plugin[options](...args));
      } else {
        new ImmyBox(element, options);
      }
    });
    return outputs.length ? (outputs.length === 1 ? outputs[0] : outputs) : this;
  };
})(jQuery);
