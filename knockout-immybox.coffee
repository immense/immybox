$ ->
  ko.bindingHandlers.immybox_choices =
    init: (element, valueAccessor, allBindingsAccessor) ->
      choices = ko.utils.unwrapObservable valueAccessor()
      options = (ko.utils.unwrapObservable allBindingsAccessor().immybox_options) or {}
      options.choices = choices
      elem = $ element
      elem.immybox options
      ko.utils.domNodeDisposal.addDisposeCallback element, -> $(element).immybox 'destroy'

    update: (element, valueAccessor) ->
      choices = ko.utils.unwrapObservable valueAccessor()
      elem = $ element
      elem.immybox 'setChoices', choices

  ko.bindingHandlers.immybox_value =
    init: (element, valueAccessor) ->
      valueObservable = valueAccessor()
      elem = $ element
      elem.on 'update', (e, newValue) ->
        valueObservable newValue

    update: (element, valueAccessor) ->
      value = ko.utils.unwrapObservable valueAccessor()
      elem = $ element
      elem.immybox 'setValue', value
