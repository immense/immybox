(($, window, document) ->

  pluginName = "immybox"
  defaults =
    choices: []
    # blankIfNull: true
    maxResults: 50
    filterFn: (query) ->
      (choice) ->
        choice.text.indexOf(query) >= 0

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

      @_defaults = defaults
      @_name = pluginName

      @options = $.extend {}, defaults, options
      @choices = @options.choices
      @selectedChoice = null

      # init with the value that's in the text box
      @selectChoiceByValue @element.val()

      id = nextId()
      $('body').append "<ul id=#{id} class='#{pluginName}_results'></ul>"
      @queryResultArea = $ "##{id}"
      @queryResultArea.hide()

      @_val = @element.val() # to keep track of what WAS in the text box

      @queryResultArea.on 'mousedown', 'li.choice', ->
        value = $(@).data 'value'
        self.selectChoiceByValue value
        self.hideResults()
        @_val = self.element.val()

      @queryResultArea.on 'mouseenter', 'li.choice', ->
        highlightedChoice = self.queryResultArea.find('li.choice.active')
        highlightedChoice.removeClass 'active'
        $(@).addClass 'active'

      @element.on 'keyup change search', =>
        query = @element.val()
        if @_val isnt query # user has changed input value, do a search and display the search results
          @_val = query
          if query is ''
            @hideResults()
          else
            @showResults()
            filteredChoices = (@choices.filter @options.filterFn query)
            truncatedChoices = filteredChoices[0...@options.maxResults]
            difference = filteredChoices.length - truncatedChoices.length
            results = truncatedChoices.map (choice) -> "<li class='choice' data-value='#{esc choice.value}'>#{esc choice.text}</li>"
            if difference > 0
              results.push "<li class='moreinfo'>showing #{addCommas truncatedChoices.length} of #{addCommas filteredChoices.length}"
            else if results.length is 0
              results.push "<li class='noresults'>no matches</li>"
            @queryResultArea.html results.join "\n"
            @queryResultArea.find('li.choice:first').addClass 'active'

      @element.on 'keydown', (e) =>
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
            when 40 # down
              e.preventDefault() # prevent cursor from moving
              @highlightNextChoice()

      @element.on 'blur', =>
        if @queryResultArea.is(':visible')
          @display()
          @hideResults()
        else if @element.val() is ''
          @selectChoiceByValue null

      $(window).on 'resize', =>
        if @queryResultArea.is(':visible')
          @positionResultsArea()

    positionResultsArea: ->
      # TODO make this detect screen edge; go up if at bottom
      offset = @element.offset()
      height = @element.outerHeight()
      width = @element.outerWidth() - 2 # TODO make this more robust by detecting border widths and such
      @queryResultArea.css top: offset.top + height, left: offset.left, width: width

    highlightNextChoice: ->
      highlightedChoice = @queryResultArea.find('li.choice.active')
      if highlightedChoice.length is 1
        nextChoice = highlightedChoice.next('li.choice')
        if nextChoice.length is 1
          highlightedChoice.removeClass 'active'
          nextChoice.addClass 'active'

    highlightPreviousChoice: ->
      highlightedChoice = @queryResultArea.find('li.choice.active')
      if highlightedChoice.length is 1
        previousChoice = highlightedChoice.prev('li.choice')
        if previousChoice.length is 1
          highlightedChoice.removeClass 'active'
          previousChoice.addClass 'active'

    selectHighlightedChoice: ->
      highlightedChoice = @queryResultArea.find('li.choice.active')
      if highlightedChoice.length is 1
        value = highlightedChoice.data 'value'
        @selectChoiceByValue value
        @_val = @element.val()
        @hideResults()

    # show the results area
    showResults: ->
      @queryResultArea.show()
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
      if value? and value isnt ''
        matches = @choices.filter (choice) -> `choice.value == value`
        if matches[0]?
          @selectedChoice = matches[0]
        else
          @selectedChoice = matches[0]
      else
        @selectedChoice = null
      @display()

    # select the first choice with matching text
    # I don't think we should use this...
    # selectChoiceByText: (text) ->
    #   if text? and text isnt ''
    #     matches = @choices.filter (choice) -> `choice.text == text`
    #     if matches[0]?
    #       @selectedChoice = matches[0]
    #       @display()
    #     else
    #       @selectedChoice = matches[0]
    #       @display()

    # return array of choices
    getChoices: ->
      @choices

    # update the array of choices
    setChoices: (newChoices) ->
      @choices = newChoices
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

  $.fn[pluginName] = (options) ->
    args = Array.prototype.slice.call(arguments, 1)
    outputs = []
    @each ->
      if $.data(this, "plugin_" + pluginName)
        if options? and typeof options is 'string'
          plugin = $.data(this, "plugin_" + pluginName)
          method = options
          outputs.push plugin[method].apply plugin, args
      else
        outputs.push $.data this, "plugin_" + pluginName, new ImmyBox this, options

    return outputs

) jQuery, window, document