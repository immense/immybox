import {Immybox, plugin_name}  from './immybox';
import {assert} from './utils';

const all_objects = [];
const plugin_id   = `plugin_${plugin_name}`;

$.fn.immybox = function(options, ...args) {
  let outputs = [];
  this.each((i, element) => {
    let plugin = $.data(element, plugin_id);
    if (plugin) {
      // calling a method on a pre-immyboxed element
      assert(typeof options === 'string', `${plugin_name} already intitialized for this element`);
      assert(plugin.pluginMethods.includes(method), `${plugin_name} has no method '${options}'`);
      outputs.push(plugin[options](...args));
    } else {
      plugin = new Immybox(element, options);
      all_objects.push(plugin);
      $.data(element, plugin_id, plugin);
    }
  });
  return outputs.length ? (outputs.length === 1 ? outputs[0] : outputs) : this;
};
