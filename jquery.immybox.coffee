(($, window, document) ->

  pluginName = "immybox"
  defaults =
    choices: []
    blankIfNull: true
    maxResults: 50
    filterFn: (query) ->
      # default filer function does case insensitive "contains" matching
      (choice) ->
        choice.text.toLowerCase().indexOf(query.toLowerCase()) >= 0

  _id = 1
  nextId = -> "#{pluginName}_#{_id++}"

  addCommas = (nStr) ->
    nStr += '';
    x = nStr.split '.'
    x1 = x[0]
    x2 = if x.length > 1 then '.' + x[1] else ''
    rgx = /(\d+)(\d{3})/
    while (rgx.test(x1))
      x1 = x1.replace rgx, '$1' + ',' + '$2'
    return x1 + x2

  # TODO get a proper escape function
  esc = (x) -> x

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

      # init with the value that's in the text box
      @selectChoiceByValue @element.val()

      id = nextId()
      $('body').append "<div id=#{id} class='#{pluginName}_results'></div>"
      @queryResultArea = $ "##{id}"
      @hideResults()

      @_val = @element.val() # to keep track of what WAS in the text box
      @oldQuery = @_val

      @queryResultArea.on 'mousedown', 'li.choice', ->
        value = $(@).data 'value'
        self.selectChoiceByValue value
        self.hideResults()
        @_val = self.element.val()
        setTimeout -> # wait for mouseup event a focus to be lost
          self.element.focus()
        , 100

      @queryResultArea.on 'mouseenter', 'li.choice', ->
        highlightedChoice = self.queryResultArea.find('li.choice.active')
        highlightedChoice.removeClass 'active'
        $(@).addClass 'active'

      @element.on 'keyup change search', @doQuery
      @element.on 'keydown', @doSelection
      @element.on 'blur', @revert
      $(window).on 'resize', @reposition

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
      if e.which is 27
        @display()
        @hideResults()
      if @queryResultArea.is(':visible')
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
          when 40
            if @selectedChoice?
              @insertFilteredChoiceElements @oldQuery
            else
              @insertFilteredChoiceElements ''

    # @element.on 'blur'
    # revert or set to null after losing focus
    revert: =>
      if @queryResultArea.is(':visible')
        # revert to last set value
        @display()
        @hideResults()
      else if @element.val() is ''
        # set to null
        @selectChoiceByValue null

    # $(window).on 'resize'
    # if visible, re-position the results area on window resize
    reposition: =>
      if @queryResultArea.is(':visible')
        @positionResultsArea()

    ###################
    # private methods #
    ###################

    insertFilteredChoiceElements: (query) ->
      if query is ''
        filteredChoices = @choices
      else
        filteredChoices = (@choices.filter @options.filterFn @oldQuery)
      truncatedChoices = filteredChoices[0...@options.maxResults]
      difference = filteredChoices.length - truncatedChoices.length
      results = truncatedChoices.map (choice) -> "<li class='choice' data-value='#{esc choice.value}'>#{esc choice.text}</li>"
      # info = if difference > 0
      #   "<p class='moreinfo'>showing #{addCommas truncatedChoices.length} of #{addCommas filteredChoices.length}</p>"
      info = if results.length is 0
        "<p class='noresults'>no matches</p>"
      else
        ''
      @queryResultArea.html "<ul>#{results.join '\n'}</ul>#{info}"
      @queryResultArea.find('li.choice:first').addClass 'active'
      @showResults()

    scroll: ->
      resultsHeight = @queryResultArea.height()
      resultsTop = @queryResultArea.scrollTop()
      highlightedChoice = @getHighlightedChoice()
      highlightedChoiceTop = highlightedChoice.position().top
      highlightedChoiceHeight = highlightedChoice.height()

      if highlightedChoiceTop + highlightedChoiceHeight <= 0
        @queryResultArea.scrollTop resultsTop - highlightedChoiceHeight
      else if (highlightedChoiceTop + highlightedChoiceHeight) > resultsHeight
        @queryResultArea.scrollTop highlightedChoiceTop + highlightedChoiceHeight - resultsHeight + resultsTop

    positionResultsArea: ->

      # gather some info
      inputOffset = @element.offset()
      inputHeight = @element.outerHeight()
      inputWidth = @element.outerWidth()
      resultsHeight = @queryResultArea.outerHeight()
      windowHeight = $(window).height()

      # set the dimmensions and position
      @queryResultArea.outerWidth inputWidth
      @queryResultArea.css left: inputOffset.left

      if inputOffset.top + inputHeight + resultsHeight > windowHeight
        @queryResultArea.css top: inputOffset.top - resultsHeight
      else
        @queryResultArea.css top: inputOffset.top + inputHeight

    getHighlightedChoice: ->
      choice = @queryResultArea.find('li.choice.active')
      if choice.length is 1
        choice
      else
        null

    highlightNextChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        nextChoice = highlightedChoice.next('li.choice')
        if nextChoice.length is 1
          highlightedChoice.removeClass 'active'
          nextChoice.addClass 'active'

    highlightPreviousChoice: ->
      highlightedChoice = @getHighlightedChoice()
      if highlightedChoice?
        previousChoice = highlightedChoice.prev('li.choice')
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

    # show the results area
    showResults: ->
      @queryResultArea.show()
      @queryResultArea.scrollTop 0
      @positionResultsArea()

    # hide the results area
    hideResults: ->
      @queryResultArea.hide()

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

    ####################
    # "public" methods #
    ####################

    publicMethods: ['getChoices', 'setChoices', 'getValue', 'setValue', 'destroy']

    # return array of choices
    getChoices: ->
      @choices

    # update the array of choices
    setChoices: (newChoices) ->
      @choices = newChoices
      if @selectedChoice?
        @selectChoiceByValue @selectedChoice.value
      newChoices

    # get the value of the currently selected choice
    getValue: ->
      if @selectedChoice?
        @selectedChoice.value
      else
        null

    # set the value
    setValue: (newValue) ->
      @selectChoiceByValue newValue
      @getValue()

    # destroy this instance of the plugin
    destroy: ->
      #remove event listeners
      @element.off 'keyup change search', @doQuery
      @element.off 'keydown', @doSelection
      @element.off 'blur', @revert
      $(window).off 'resize', @reposition

      @element.removeClass pluginName

      @queryResultArea.remove() # removes query result area and all related event listeners
      $.removeData @element[0], "plugin_#{pluginName}" # remove reference to plugin instance

  $.fn[pluginName] = (options) ->
    args = Array.prototype.slice.call(arguments, 1)
    outputs = []
    @each ->
      if $.data(this, "plugin_" + pluginName)
        if options? and typeof options is 'string'
          plugin = $.data(this, "plugin_" + pluginName)
          method = options
          if method in plugin.publicMethods
            outputs.push plugin[method].apply plugin, args
          else
            throw new Error "#{pluginName} has no method '#{method}'"
      else
        outputs.push $.data this, "plugin_" + pluginName, new ImmyBox this, options

    return outputs

) jQuery, window, document