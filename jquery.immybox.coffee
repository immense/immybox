(($, window, document) ->

  pluginName = "immybox"
  defaults =
    choices: []
    blankIfNull: true
    maxResults: 50
    showArrow: true
    openOnClick: true
    filterFn: (query) ->
      # default filter function does case insensitive "contains" matching
      (choice) ->
        choice.text.toLowerCase().indexOf(query.toLowerCase()) >= 0
    formatChoice: (choice, query) ->
      i = choice.text.toLowerCase().indexOf query.toLowerCase()
      if i >= 0 # should always be since we only attempt to highlight things that passed the filterFn
        matchedText = choice.text[i...i+query.length]
        [head, tail...] = choice.text.split(matchedText)
        "#{head}<span class='highlight'>#{matchedText}</span>#{tail.join matchedText}"
      else
        choice.text

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

      @_defaults = defaults
      @_name = pluginName

      @options = $.extend {}, defaults, options
      @choices = @options.choices
      @selectedChoice = null

      if @options.showArrow
        @element.addClass "#{pluginName}_witharrow"
        @downArrow = $ "<i class='#{pluginName}_downarrow icon-chevron-down'></i>"
        @element.after @downArrow
        @downArrow.on 'click', @toggleResults

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

      @queryResultArea.on 'mouseenter', "li.#{pluginName}_choice", ->
        self.queryResultArea.find("li.#{pluginName}_choice.active").removeClass 'active'
        $(@).addClass 'active'

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
        else
          @insertFilteredChoiceElements query

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

    # @element.on 'click'
    # show the results box on click
    openResults: (e) =>
      e.stopPropagation() # stop the event from bubbling up and the body click event catching it
      @revertOtherInstances() # because the event isn't bubbling, other instances won't revert
      if @selectedChoice?
        @insertFilteredChoiceElements @oldQuery
      else
        @insertFilteredChoiceElements ''

    # @downArrow.on 'click'
    # toggle the results box on click
    toggleResults: (e) =>
      e.stopPropagation() # stop the event from bubbling up and the body click event catching it
      @revertOtherInstances() # because the event isn't bubbling, other instances won't revert
      if @element.is ':enabled'
        if @queryResultAreaVisible
          @hideResults()
        else
          if @selectedChoice?
            @insertFilteredChoiceElements @oldQuery
          else
            @insertFilteredChoiceElements ''

        @element.focus()

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

    # if visible, re-position the results area on window resize
    reposition: =>
      console.log 'reposition'
      if @queryResultAreaVisible
        @positionResultsArea()

    insertFilteredChoiceElements: (query) ->
      if query is ''
        filteredChoices = @choices
      else
        filteredChoices = (@choices.filter @options.filterFn @oldQuery)
      truncatedChoices = filteredChoices[0...@options.maxResults]
      # difference = filteredChoices.length - truncatedChoices.length

      format = @options.formatChoice

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
          results[0].addClass 'active'

        list = $('<ul></ul>')
          .append(results)

        @queryResultArea
          .empty()
          .append(list)

      @showResults()

    scroll: ->
      resultsHeight = @queryResultArea.height()
      resultsTop = @queryResultArea.scrollTop()
      resultsBottom = resultsTop + resultsHeight

      highlightedChoice = @getHighlightedChoice()
      return true if not highlightedChoice?
      highlightedChoiceHeight = highlightedChoice.outerHeight()
      highlightedChoiceTop = highlightedChoice.position().top + resultsTop
      highlightedChoiceBottom = highlightedChoiceTop + highlightedChoiceHeight

      if highlightedChoiceTop < resultsTop
        @queryResultArea.scrollTop highlightedChoiceTop
      if highlightedChoiceBottom > resultsBottom
        @queryResultArea.scrollTop highlightedChoiceBottom - resultsHeight

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

    getHighlightedChoice: ->
      choice = @queryResultArea.find("li.#{pluginName}_choice.active")
      if choice.length is 1
        choice
      else
        null

    highlightNextChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        nextChoice = highlightedChoice.next("li.#{pluginName}_choice")
        if nextChoice.length is 1
          highlightedChoice.removeClass 'active'
          nextChoice.addClass 'active'

    highlightPreviousChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        previousChoice = highlightedChoice.prev("li.#{pluginName}_choice")
        if previousChoice.length is 1
          highlightedChoice.removeClass 'active'
          previousChoice.addClass 'active'

    selectHighlightedChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        value = highlightedChoice.data 'value'
        @selectChoiceByValue value
        @_val = @element.val()
        @hideResults()
      else
        @revert()

    # display the selected choice in the input box
    display: ->
      if @selectedChoice?
        @selectedChoice.text
        @element.val @selectedChoice.text
      else if @options.blankIfNull
        @element.val ''

      @_val = @element.val()

    # select the first choice with matching value
    # Note: values should be unique
    selectChoiceByValue: (value) ->
      oldValue = @getValue()
      if value? and value isnt ''
        matches = @choices.filter (choice) -> `choice.value == value` # use type coersive equals
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

    revertOtherInstances: ->
      o.revert() for o in objects when o isnt @

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

    # hide the results area
    hideResults: ->
      @queryResultArea.detach()
      @queryResultAreaVisible = false

    # return array of choices
    getChoices: ->
      @choices

    # update the array of choices
    setChoices: (newChoices) ->
      @choices = newChoices
      if @selectedChoice?
        @selectChoiceByValue @selectedChoice.value
      @oldQuery = ''
      newChoices

    # get the value of the currently selected choice
    getValue: ->
      if @selectedChoice?
        @selectedChoice.value
      else
        null

    # set the value
    setValue: (newValue) ->
      currentValue = @getValue()
      if currentValue isnt newValue
        @selectChoiceByValue newValue
        @oldQuery = ''
        @getValue()
      else
        currentValue

    # destroy this instance of the plugin
    destroy: ->
      #remove event listeners
      @element.off 'keyup change search', @doQuery
      @element.off 'keydown', @doSelection

      if @options.openOnClick
        @element.off 'click', @openResults

      @element.removeClass pluginName

      if @options.showArrow
        @element.removeClass "#{pluginName}_witharrow"
        @downArrow.remove() # removes down arrow element and all related event listeners

      @queryResultArea.remove() # removes query result area and all related event listeners
      $.removeData @element[0], "plugin_#{pluginName}" # remove reference to plugin instance

      objects = objects.filter (o) => o isnt @ # remove reference from objects array

  # use one global click event listener to close/revert ones that are open
  $('body').on 'click', -> o.revert() for o in objects

  # use one global scoll/resize listener to reposition any result areas that are open
  $(window).on 'resize scroll', -> o.reposition() for o in objects when o.queryResultAreaVisible

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

    return outputs

) jQuery, window, document
