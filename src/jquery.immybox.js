/*eslint no-console:0*/
import {ImmyBox} from './immybox';
import {assert} from './utils';
(function($) {
  $.fn.immybox = function(options, ...args) {
    let outputs = [];
    this.each((i, element) => {
      let plugin = Immybox.all_objects.get(element);
      if (plugin) {
        // calling a method on a pre-immyboxed element
        assert(typeof options === 'string', `${Immybox.plugin_name} already intitialized for this element`);
        assert(ImmyBox.pluginMethods.includes(options), `${Immybox.plugin_name} has no method '${options}'`);
        outputs.push(plugin[options](...args));
      } else {
        new ImmyBox(element, options);
      }
    });
    return outputs.length ? (outputs.length === 1 ? outputs[0] : outputs) : this;
  };
})(jQuery);
