(function() {
  $(function() {
    ko.bindingHandlers.immybox_choices = {
      init: function(element, valueAccessor, allBindingsAccessor) {
        var choices, elem, options;
        choices = ko.utils.unwrapObservable(valueAccessor());
        options = (ko.utils.unwrapObservable(allBindingsAccessor().immybox_options)) || {};
        options.choices = choices;
        elem = $(element);
        elem.immybox(options);
        return ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          return $(element).immybox('destroy');
        });
      },
      update: function(element, valueAccessor) {
        var choices, elem;
        choices = ko.utils.unwrapObservable(valueAccessor());
        elem = $(element);
        return elem.immybox('setChoices', choices);
      }
    };
    return ko.bindingHandlers.immybox_value = {
      init: function(element, valueAccessor) {
        var elem, valueObservable;
        valueObservable = valueAccessor();
        elem = $(element);
        return elem.on('update', function(e, newValue) {
          return valueObservable(newValue);
        });
      },
      update: function(element, valueAccessor) {
        var elem, value;
        value = ko.utils.unwrapObservable(valueAccessor());
        elem = $(element);
        return elem.immybox('setValue', value);
      }
    };
  });

}).call(this);
