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
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          $(element).immybox('destroy');
        });
      },
      update: function(element, valueAccessor, allBindings) {
        var choices, elem, observable;
        choices = ko.utils.unwrapObservable(valueAccessor());
        elem = $(element);
        elem.immybox('setChoices', choices);
        if (allBindings.has('immybox_value')) {
          observable = allBindings.get('immybox_value');
          observable.valueHasMutated();
        }
      }
    };
    return ko.bindingHandlers.immybox_value = {
      init: function(element, valueAccessor) {
        var elem, valueObservable;
        valueObservable = valueAccessor();
        elem = $(element);
        elem.on('update', function(e, newValue) {
          valueObservable(newValue);
        });
      },
      update: function(element, valueAccessor) {
        var elem, value;
        value = ko.utils.unwrapObservable(valueAccessor());
        elem = $(element);
        elem.immybox('setValue', value);
      }
    };
  });

}).call(this);
