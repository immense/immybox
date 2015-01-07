(($, window, document) ->

  pluginName = "immybox"
  defaults =
    choices: []
    maxResults: 50
    showArrow: true
    openOnClick: true
    defaultSelectedValue: undefined
    filterFn: (query) ->
      # default filter function does case insensitive "contains" matching
      (choice) -> choice.text.toLowerCase().indexOf(query.toLowerCase()) >= 0
    formatChoice: (query) ->
      # default choice formatter function wraps all instances of query in a
      # span.highlight
      if query? and query isnt ''
        reg = new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'gi')
        return (choice) ->
          choice.text.replace(reg, '<span class="highlight">$&</span>')
      else
        return (choice) -> choice.text

  objects = [] # keep references to all plugin instances

  # addCommas = (nStr) ->
  #   nStr += '';
  #   x = nStr.split '.'
  #   x1 = x[0]
  #   x2 = if x.length > 1 then '.' + x[1] else ''
  #   rgx = /(\d+)(\d{3})/
  #   while (rgx.test(x1))
  #     x1 = x1.replace rgx, '$1' + ',' + '$2'
  #   return x1 + x2

  class ImmyBox

    constructor: (element, options) ->
      self = @

      @element = $ element
      @element.addClass pluginName
      @element.attr 'autocomplete', 'off'

      @_defaults = defaults
      @_name = pluginName

      @options = $.extend {}, defaults, options
      @choices = @options.choices
      @selectedChoice = null
      @defaultSelectedChoice =
        if @options.defaultSelectedValue?
          @choices.filter((c) -> c.value is self.options.defaultSelectedValue)[0] or null
        else
          # return null / undefined
          @options.defaultSelectedValue

      if @options.showArrow
        @element.addClass "#{pluginName}_witharrow"

      if @options.openOnClick
        @element.on 'click', @openResults

      # init with the value that's in the text box
      @selectChoiceByValue @element.val()

      @queryResultArea = $ "<div class='#{pluginName}_results'></div>"
      @queryResultArea.scrollLock?()
      @queryResultAreaVisible = false

      @_val = @element.val() # to keep track of what WAS in the text box
      @oldQuery = @_val

      @queryResultArea.on 'click', "li.#{pluginName}_choice", ->
        value = $(@).data 'value'
        self.selectChoiceByValue value
        self.hideResults()
        self._val = self.element.val()
        self.element.focus()
        return

      @queryResultArea.on 'mouseenter', "li.#{pluginName}_choice", ->
        self.queryResultArea.find("li.#{pluginName}_choice.active").removeClass 'active'
        $(@).addClass 'active'
        return

      @element.on 'keyup change search', @doQuery
      @element.on 'keydown', @doSelection

    ###################
    # event listeners #
    ###################

    # @element.on 'keyup change search'
    # perform a query on the choices
    doQuery: =>
      query = @element.val()
      if @_val isnt query # user has changed input value, do a search and display the search results
        @_val = query
        @oldQuery = query
        if query is ''
          @hideResults()

          # If user has backspaced everything in the field, we can safely clear
          # clear the currently-selected value (since clicking out of the field
          # this point would call @revert() anyway)
          @selectChoiceByValue(null)
        else
          @insertFilteredChoiceElements query
      return

    # @element.on 'keydown'
    # select the highlighted choice
    doSelection: (e) =>
      if e.which is 27 # escape
        @display()
        @hideResults()
      if @queryResultAreaVisible
        switch e.which
          when 9 # tab
            @selectHighlightedChoice()
          when 13 # enter
            e.preventDefault() # prevent form from submitting (i think; test this!)
            @selectHighlightedChoice()
          when 38 # up
            e.preventDefault() # prevent cursor from moving
            @highlightPreviousChoice()
            @scroll()
          when 40 # down
            e.preventDefault() # prevent cursor from moving
            @highlightNextChoice()
            @scroll()
      else
        switch e.which
          when 40 # down
            e.preventDefault() # prevent cursor from moving
            if @selectedChoice?
              @insertFilteredChoiceElements @oldQuery
            else
              @insertFilteredChoiceElements ''
          when 9 # tab
            @revert()
      return

    # @element.on 'click'
    # show the results box on click
    openResults: (e) =>
      e.stopPropagation() # stop the event from bubbling up and the body click event catching it
      @revertOtherInstances() # because the event isn't bubbling, other instances won't revert
      if @selectedChoice?
        @insertFilteredChoiceElements @oldQuery
      else
        @insertFilteredChoiceElements ''
      return

    ###################
    # private methods #
    ###################

    # revert or set to null after losing focus
    revert: =>
      if @queryResultAreaVisible
        # revert to last set value
        @display()
        @hideResults()
      else if @element.val() is ''
        # set to null
        @selectChoiceByValue null
      return

    # if visible, re-position the results area on window resize
    reposition: =>
      if @queryResultAreaVisible
        @positionResultsArea()
      return

    insertFilteredChoiceElements: (query) ->
      if query is ''
        filteredChoices = @choices
      else
        filteredChoices = (@choices.filter @options.filterFn @oldQuery)
      truncatedChoices = filteredChoices[0...@options.maxResults]

      if defaultChoice = @defaultSelectedChoice
        if defaultChoice in filteredChoices
          if defaultChoice not in truncatedChoices
            # add defaultChoice to the beginning of the truncatedChoices so the user sees it first
            truncatedChoices.unshift(defaultChoice)
            truncatedChoices.pop()
          else
            unless truncatedChoices[0] is defaultChoice
              # move defaultChoice from where it is in the array to the first value
              truncatedChoices = truncatedChoices.filter((c) -> c.value isnt defaultChoice.value)
              truncatedChoices.unshift(defaultChoice)
      # difference = filteredChoices.length - truncatedChoices.length

      format = @options.formatChoice

      # for backwards-compatibility, only assume formatChoice returns a function
      # if it only takes in one param
      if format.length is 1
        format = format(query)

      selectedOne = false
      results = truncatedChoices.map (choice) =>
        li = $ "<li class='#{pluginName}_choice'></li>"
        li.attr 'data-value', choice.value
        li.html format choice, query
        if choice is @selectedChoice
          selectedOne = true
          li.addClass 'active'
        return li

      if results.length is 0
        info = $ "<p class='#{pluginName}_noresults'>no matches</p>"

        @queryResultArea
          .empty()
          .append(info)
      else
        if not selectedOne
          unless defaultChoice is null
            results[0].addClass 'active'

        list = $('<ul></ul>')
          .append(results)

        @queryResultArea
          .empty()
          .append(list)

      @showResults()
      return

    scroll: ->
      resultsHeight = @queryResultArea.height()
      resultsTop = @queryResultArea.scrollTop()
      resultsBottom = resultsTop + resultsHeight

      highlightedChoice = @getHighlightedChoice()
      return if not highlightedChoice?
      highlightedChoiceHeight = highlightedChoice.outerHeight()
      highlightedChoiceTop = highlightedChoice.position().top + resultsTop
      highlightedChoiceBottom = highlightedChoiceTop + highlightedChoiceHeight

      if highlightedChoiceTop < resultsTop
        @queryResultArea.scrollTop highlightedChoiceTop
      if highlightedChoiceBottom > resultsBottom
        @queryResultArea.scrollTop highlightedChoiceBottom - resultsHeight

      return

    positionResultsArea: ->

      # gather some info
      inputOffset = @element.offset()
      inputHeight = @element.outerHeight()
      inputWidth = @element.outerWidth()
      resultsHeight = @queryResultArea.outerHeight()
      resultsBottom = inputOffset.top + inputHeight + resultsHeight
      windowBottom = $(window).height() + $(window).scrollTop()

      # set the dimmensions and position
      @queryResultArea.outerWidth inputWidth
      @queryResultArea.css left: inputOffset.left

      if resultsBottom > windowBottom
        @queryResultArea.css top: inputOffset.top - resultsHeight
      else
        @queryResultArea.css top: inputOffset.top + inputHeight

      return

    getHighlightedChoice: ->
      choice = @queryResultArea.find("li.#{pluginName}_choice.active")
      if choice.length is 1
        return choice
      else
        return null

    highlightNextChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        nextChoice = highlightedChoice.next("li.#{pluginName}_choice")
        if nextChoice.length is 1
          highlightedChoice.removeClass 'active'
          nextChoice.addClass 'active'
      else
        choices = @queryResultArea.find("li.#{pluginName}_choice")
        if choices.length
          $(choices[0]).addClass('active')
      return

    highlightPreviousChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        previousChoice = highlightedChoice.prev("li.#{pluginName}_choice")
        if previousChoice.length is 1
          highlightedChoice.removeClass 'active'
          previousChoice.addClass 'active'
      else
        choices = @queryResultArea.find("li.#{pluginName}_choice")
        if choices.length
          $(choices[choices.length - 1]).addClass('active')
      return

    selectHighlightedChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        value = highlightedChoice.data 'value'
        @selectChoiceByValue value
        @_val = @element.val()
        @hideResults()
      else
        @revert()
      return

    # display the selected choice in the input box
    display: ->
      if @selectedChoice?
        @selectedChoice.text
        @element.val @selectedChoice.text
      else
        @element.val ''

      @_val = @element.val()
      return

    # select the first choice with matching value
    # Note: values should be unique
    selectChoiceByValue: (value) ->
      oldValue = @getValue()
      if value? and value isnt ''
        matches = @choices.filter (choice) -> return `choice.value == value` # use type coersive equals
        if matches[0]?
          @selectedChoice = matches[0]
        else
          @selectedChoice = null
      else
        @selectedChoice = null
      newValue = @getValue()
      if newValue isnt oldValue
        @element.trigger 'update', [newValue]
      @display()
      return

    revertOtherInstances: ->
      o.revert() for o in objects when o isnt @
      return

    ####################
    # "public" methods #
    ####################

    publicMethods: ['showResults', 'hideResults', 'getChoices', 'setChoices', 'getValue', 'setValue', 'destroy']

    # show the results area
    showResults: ->
      $('body').append @queryResultArea
      @queryResultAreaVisible = true
      @scroll()
      @positionResultsArea()
      return

    # hide the results area
    hideResults: ->
      @queryResultArea.detach()
      @queryResultAreaVisible = false
      return

    # return array of choices
    getChoices: ->
      return @choices

    # update the array of choices
    setChoices: (newChoices) ->
      @choices = newChoices
      if @selectedChoice?
        @selectChoiceByValue @selectedChoice.value
      @oldQuery = ''
      return newChoices

    # get the value of the currently selected choice
    getValue: ->
      if @selectedChoice?
        return @selectedChoice.value
      else
        return null

    # set the value
    setValue: (newValue) ->
      currentValue = @getValue()
      if currentValue isnt newValue
        @selectChoiceByValue newValue
        @oldQuery = ''
        return @getValue()
      else
        return currentValue

    # destroy this instance of the plugin
    destroy: ->
      #remove event listeners
      @element.off 'keyup change search', @doQuery
      @element.off 'keydown', @doSelection

      if @options.openOnClick
        @element.off 'click', @openResults

      @element.removeClass pluginName

      @queryResultArea.remove() # removes query result area and all related event listeners
      $.removeData @element[0], "plugin_#{pluginName}" # remove reference to plugin instance

      objects = objects.filter (o) => return o isnt @ # remove reference from objects array
      return

  # use one global click event listener to close/revert ones that are open
  $('html').on 'click', ->
    o.revert() for o in objects
    return

  # use one global scoll/resize listener to reposition any result areas that are open
  $(window).on 'resize scroll', ->
    o.reposition() for o in objects when o.queryResultAreaVisible
    return

  $.fn[pluginName] = (options) ->
    args = Array.prototype.slice.call(arguments, 1)
    outputs = []
    @each ->
      if $.data(@, "plugin_" + pluginName)
        if options? and typeof options is 'string'
          plugin = $.data(@, "plugin_" + pluginName)
          method = options
          if method in plugin.publicMethods
            outputs.push plugin[method].apply plugin, args
          else
            throw new Error "#{pluginName} has no method '#{method}'"
      else
        newObject = new ImmyBox @, options
        objects.push newObject
        outputs.push $.data @, "plugin_" + pluginName, newObject
      return

    return outputs

  return

) jQuery, window, document
