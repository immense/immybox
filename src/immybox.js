import {addClass, removeClass, matchesSelector} from './utils';

const defaults = {
  choices: [],
  maxResults: 50,
  showArrow: true,
  openOnClick: true,
  defaultSelectedValue: undefined,
  filterFn(query) {
    let lower_query = query.toLowerCase();
    return choice => choice.text.toLowerCase().indexOf(lower_query) >= 0;
  },
  formatChoice(query) {
    if (query) {
      let reg = new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'gi');
      return choice => choice.text.replace(reg, '<span class="highlight">$&</span>');
    } else
      return choice => choice.text;
  }
};

const all_objects = [];

export const plugin_name = 'immybox';

export class ImmyBox {
  constructor(element, options) {
    addClass(element, plugin_name);
    element.setAttribute('autocomplete', 'off');

    this.element = element;
    this.options = Object.assign({}, Immybox.defaults, options);
    this.choices = this.options.choices.map((choice, index) => ({index, choice}));
    this.values  = this.choices.map(choice => choice.choice.value);
    this.selectedChoice = null;
    if (this.options.defaultSelectedValue != null)
      this.defaultSelectedChoice = this.choices.find(({choice}) => {
        return choice.value === this.options.defaultSelectedValue;
      }) || null;

    if (this.options.showArrow)
      addClass(this.element, `${plugin_name}_witharrow`);

    if (this.options.openOnClick)
      this.element.addEventListener('click', this.openResults, true);

    this.selectChoiceByValue(this.element.value);

    this.queryResultArea = document.createElement('div');
    this.queryResultArea.classList = `${plugin_name}_results`;
    this.queryResultAreaVisible = false;

    this._val = this.element.value;
    this.oldQuery = this.element.value;

    this.queryResultArea.addEventListener('click', event => {
      if (matchesSelector(event.target, `li.${plugin_name}_choice`)) {
        let value = this.valueFromElement(event.target);
        this.selectChoiceByValue(value);
        this.hideResults();
        this._val = this.element.value;
        this.element.focus();
      }
    });

    this.queryResultArea.addEventListener('mouseenter', event => {
      if (matchesSelector(event.target, `li.${plugin_name}_choice`)) {
        addClass(event.target, 'active');
        [...this.queryResultArea.querySelectorAll(`li.${plugin_name}_choice.active`)]
        .forEach(li => {
          if (li !== event.target) removeClass(li, 'active');
        });
      }
    });

    this.element.addEventListener('keyup', this.doQuery);
    this.element.addEventListener('change', this.doQuery);
    this.element.addEventListener('search', this.doQuery);
    this.element.addEventListener('keydown', this.doSelection);
  }

  // on 'keyup', 'change', 'search'
  // perform a query on the choices
  doQuery() {
    let query = this.element.value;
    if (this._val !== query) {
      this._val = query;
      this.oldQuery = query;
      if (query) {
        this.insertFilteredChoiceElements(query);
      } else {
        this.hideResults();
        this.selectChoiceByValue(null);
      }
    }
  }

  // on 'keydown'
  // select the highlighted choice
  doSelection(event) {
    if (event.which === 27) { // escape key
      this.display();
      this.hideResults();
    }
    if (this.queryResultsAreaVisible) {
      switch (event.which) {
        case 9: // tab
          this.selectHighlightedChoice();
          break;
        case 13: // enter
          event.preventDefault();
          this.selectHighlightedChoice();
          break;
        case 38: // up
          event.preventDefault();
          this.highlightPreviousChoice();
          this.scroll();
          break;
        case 40: // down
          event.preventDefault();
          this.highlightNextChoice();
          this.scroll();
          break;
      }
    } else {
      switch (e.which) {
        case 40: // down
          event.preventDefault();
          if (this.selectedChoice)
            this.insertFilteredChoiceElements(this.oldQuery);
          else
            this.insertFilteredChoiceElements('');
          break;
        case 9: // tab
          this.revert();
          break;
      }
    }
  }

  // on 'click'
  // show the results box
  openResults(event) {
    event.stopPropogation();
    this.revertOtherInstances();
    if (this.selectedChoice)
      this.insertFilteredChoiceElements(this.oldQuery);
    else
      this.insertFilteredChoiceElements('');
  }

  // revert or set to null after losing focus
  revert() {
    if (this.queryResultAreaVisible) {
      this.display();
      this.hideResults();
    } else if (this.element.value === "") this.selectChoiceByValue(null);
  }

  // if visible, reposition the results area on window resize
  reposition() {
    if (this.queryResultAreaVisible) this.positionResultsArea();
  }

  insertFilteredChoiceElements(query) {
    let filteredChoices;
    if (query === '')
      filteredChoices = this.choices;
    else {
      let filter = this.options.filterFn(query);
      filteredChoices = this.choices.filter(({choice}, index) => filter(choice, index));
    }

    let truncatedChoices = filteredChoices.slice(0, this.options.maxResults);
    if (defaultChoice = this.defaultSelectedChoice) {
      if (filteredChoices.indexOf(defaultChoice) >= 0) {
        if (truncatedChoices.indexOf(defaultChoice) === -1) {
          truncatedChoices.unshift(defaultChoice);
          truncatedChoices.pop();
        } else {
          truncatedChoices = truncatedChoices.filter(c => c.value !== defaultChoice.value);
          truncatedChoices.unshift(defaultChoice);
        }
      }
    }
    let formater = this.options.formatChoice(query);
    let selectedOne = false;
    let list = document.createElement('ul');
    let results = truncatedChoices.map(({choice, index}) => {
      let li = document.createElement('li');
      li.setAttribute('class', `${plugin_name}_choice`);
      li.setAttribute('data-immybox-value-index', index);
      li.textContent = formatter(choice);
      if (this.selectedChoice && (index === this.selectedChoice.index)) {
        selected_one = true;
        addClass(li, 'active');
      }
      ul.appendChild(li);
    });
    if (results.length) {
      !selected_one && defaultChoice != null && addClass(results[0], 'active');
    } else {
      list = document.createElement('p');
      list.setAttribute('class', `${plugin_name}_noresults`);
      list.textContent = "no matches";
    }
    this.queryResultArea = this.queryResultArea.cloneNode(false); // clone the result area, discarding all of its child nodes
    this.queryResultArea.appendChild(list);
    this.showResults();
  }

  scroll() {
    let highlightedChoice = @getHighlightedChoice();
    if (!highlightedChoice) return;

    let results_height = this.queryResultArea.clientHeight;
    let results_top = this.queryResultArea.scrollTop;
    let results_bottom = results_height + results_top;

    let highlighted_choice_height = highlightedChoice.clientHeight;
    let highlighted_choice_top = highlightedChoice.clientTop + results_top;
    let highlighted_choice_bottom = highlighted_choice_top + highlighted_choice_height;

    if (highlighted_choice_top < results_top)
      this.queryResultArea.scrollTop = highlighted_choice_top;
    if (highlighted_choice_bottom > resultsBottom)
      this.queryResultArea.scrollTop = highlighted_choice_bottom - results_height;
  }

  positionResultsArea() {
    let input_offset = this.element.getBoundingClientRect();
    let input_height = this.element.clientHeight;
    let input_width = this.element.clientWidth;
    let results_height = @queryResultArea.clientHeight;
    let results_bottom = input_offset.top + input_height + results_height;
    let window_bottom = window.clientHeight + window.scrollTop;

    // set the dimmensions and position
    this.queryResultArea.style.width = input_width;
    this.queryResultArea.style.left = input_offset.left;

    if (results_bottom > window_bottom)
      this.queryResultArea.style.top = input_offset.top - results_height;
    else
      this.queryResultArea.style.top = input_offset.top + input_height;
  }

  getHighlightedChoice() {
    let choice = this.queryResultArea.querySelector(`li.${plugin_name}_choice.active`);
    return choice || null;
  }

  highlightNextChoice() {
    let highlighted_choice = this.getHighlightedChoice();
    if (highlighted_choice) {
      let next_choice = highlighted_choice.nextSibling;
      if (next_choice) {
        removeClass(highlighted_choice, 'active');
        addClass(next_choice, 'active');
      }
    } else {
      let choices = this.queryResultArea.querySelector(`li.${plugin_name}_choice`);
      if (choice) addClass(choice, 'active');
    }
  }

  highlightPreviousChoice() {
    let highlighted_choice = this.getHighlightedChoice();
    if (highlighted_choice) {
      let prev_choice = highlighted_choice.previousSibling;
      if (prev_choice) {
        removeClass(highlighted_choice, 'active');
        addClass(prev_choice, 'active');
      }
    } else {
      let choices = this.queryResultArea.querySelector(`li.${plugin_name}_choice:last-child`);
      if (choice) addClass(choice, 'active');
    }
  }

  selectHighlightedChoice() {
    let highlighted_choice = this.getHighlightedChoice();
    if (highlighted_choice) {
      let value = highlighted_choice.getAttribute('')
    } else this.revert();
  }

  valueFromElement(plugin, element) {
    let index = parseInt(element.getAttribute('data-immybox-value-index'));
    return !Number.isNaN(index) ? this.values[index] : undefined;
  }

  static set defaults(new_defaults) {
    Object.assign(defaults, new_defaults);
  }
  static get defaults() {
    return defaults;
  }
}

  ###################
  # private methods #
  ###################

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

    if typeof Event isnt 'undefined'
      @_element.dispatchEvent new Event('input')

    @_val = @element.val()
    return

  # select the first choice with matching value
  # Note: values should be unique
  selectChoiceByValue: (value_to_select) ->
    old_value = @getValue()
    if value_to_select? and value_to_select isnt ''
      matches = @choices.filter (choice) -> return `choice.value == value_to_select` # use type coersive equals
      if matches[0]?
        @selectedChoice = matches[0]
      else
        @selectedChoice = null
    else
      @selectedChoice = null
    value = @getValue()
    if value isnt old_value
      @element.trigger 'update', [value]
      # @_element.dispatchEvent new CustomEvent('update', {
      #   detail: value
      # })

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
