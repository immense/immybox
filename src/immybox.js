import {addClass, removeClass, nodeOrParentMatchingSelector} from './utils';
import R from 'ramda';

const event_listeners = new Map();
const all_objects = new Map();
const plugin_name = 'immybox';

const removeActive = node => removeClass(node, 'active');
const addActive = node => addClass(node, 'active');
const removeActiveList = R.forEach(removeActive);

function moveActive(from_el, to_el) {
  removeActive(from_el);
  addActive(to_el);
}

const _dispatchEvent = typeof Event !== 'undefined' ? function(el, name) {
  el.dispatchEvent(new Event(name));
} : function() {};

const _defaults = {
  choices: [],
  maxResults: 50,
  showArrow: true,
  openOnClick: true,
  defaultSelectedValue: void 0,
  scroll_behavior: 'smooth',
  no_results_text: 'no matches',
  makeQueryResultsText(x, y) {
    return `showing ${x} of ${y}`;
  },
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

const defaults = Object.assign({}, _defaults);

function assignEvent(event_name, event_handler, node, listeners) {
  listeners.has(node) || listeners.set(node, new Map());
  listeners.get(node).set(event_name, event_handler);
  node.addEventListener(event_name, event_handler);
}

function getEventListenerMap(plugin) {
  let map = new Map();
  event_listeners.set(plugin, map);
  return map;
}

export class ImmyBox {
  constructor(element, options) {
    addClass(element, plugin_name);
    element.setAttribute('autocomplete', 'off');

    let listeners = getEventListenerMap(this);

    this.element = element;
    this.options = Object.assign({}, ImmyBox.defaults, options);
    this.choices = this.options.choices;
    if (typeof this.options.defaultSelectedValue !== 'undefined')
      this.choices = [
        this.choices.find(({value}) => {
          return value === this.options.defaultSelectedValue;
        }), ...(
          this.choices.filter(({value}) => {
            return value !== this.options.defaultSelectedValue;
          }))
      ].filter(choice => choice);
    this.indexed_choices = this.choices.map((choice, index) => ({index, choice}));
    this.selectedChoice = null;

    if (this.options.showArrow)
      addClass(this.element, `${plugin_name}_witharrow`);

    this.selectChoiceByValue(this.element.value);

    this.dropdownArea = document.createElement('div');
    addClass(this.dropdownArea, `${plugin_name}_dropdown`);
    this.dropdownAreaVisible = false;

    this.queryResultArea = document.createElement('div');
    addClass(this.queryResultArea, `${plugin_name}_results`);

    this.noResultsArea = document.createElement('p');
    addClass(this.noResultsArea, `${plugin_name}_noresults`);
    this.noResultsArea.textContent = this.options.no_results_text || defaults.no_results_text;

    if (this.options.makeQueryResultsText) {
      if (typeof this.options.makeQueryResultsText === 'function') {
        this.results_text_maker = this.options.makeQueryResultsText;
      } else {
        // user probably set options.makeQueryResultsText to true -- use the default query result text maker
        this.results_text_maker = defaults.makeQueryResultsText;
      }
      this.queryResultsTextArea = document.createElement('p');
      addClass(this.queryResultsTextArea, `${plugin_name}_results_text`);
    }

    this._val = this.element.value;
    this.oldQuery = this.element.value;

    if (this.options.openOnClick)
      assignEvent('click', this.openResults.bind(this), this.element, listeners);

    assignEvent('click', event => {
      let node = nodeOrParentMatchingSelector(event.target, `li.${plugin_name}_choice`);
      if (node) {
        let value = this.valueFromElement(node);
        this.selectChoiceByValue(value);
        this.hideResults();
        this._val = this.element.value;
        this.element.focus();
      }
    }, this.queryResultArea, listeners);

    assignEvent('mouseenter', event => {
      let node = nodeOrParentMatchingSelector(event.target, `li.${plugin_name}_choice`);
      if (node) {
        removeActiveList(this.queryResultArea.querySelectorAll(`li.${plugin_name}_choice.active`));
        addActive(node);
      }
    }, this.queryResultArea, listeners);

    assignEvent('keyup', this.doQuery.bind(this), this.element, listeners);
    assignEvent('change', this.doQuery.bind(this), this.element, listeners);
    assignEvent('search', this.doQuery.bind(this), this.element, listeners);
    assignEvent('keydown', this.doSelection.bind(this), this.element, listeners);

    all_objects.set(this.element, this);
  }

  get values() {
    return this.choices.map(choice => choice.value);
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
    if (this.dropdownAreaVisible) {
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
      switch (event.which) {
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
    event.cancelBubble = true;
    event.stopPropogation && event.stopPropogation();
    this.revertOtherInstances();
    if (this.selectedChoice) {
      this.insertFilteredChoiceElements(this.oldQuery);
    } else {
      this.insertFilteredChoiceElements('');
    }
  }

  // revert or set to null after losing focus
  revert() {
    if (this.dropdownAreaVisible) {
      this.display();
      this.hideResults();
    } else if (this.element.value === '') this.selectChoiceByValue(null);
  }

  // if visible, reposition the results area on window resize
  reposition() {
    this.dropdownAreaVisible && this.positionDropdownArea();
  }

  cleanNode(node) {
    while (node.lastChild) {
      node.removeChild(node.lastChild);
    }
  }

  insertFilteredChoiceElements(query) {
    let filteredChoices;
    if (query === '')
      filteredChoices = this.indexed_choices;
    else {
      let filter = this.options.filterFn(query);
      filteredChoices = this.indexed_choices.filter(({choice}, index) => filter(choice, index));
    }
    let truncatedChoices = filteredChoices.slice(0, this.options.maxResults);
    if (truncatedChoices.length) {
      if (this.defaultSelectedChoice) {
        if (filteredChoices.indexOf(this.defaultSelectedChoice) >= 0) {
          if (truncatedChoices.indexOf(this.defaultSelectedChoice) === -1) {
            truncatedChoices.unshift(this.defaultSelectedChoice);
            truncatedChoices.pop();
          } else {
            truncatedChoices = truncatedChoices.filter(c => c.choice.value !== this.defaultSelectedChoice.value);
            truncatedChoices.unshift(this.defaultSelectedChoice);
          }
        }
      }
      let formatter = this.options.formatChoice(query);
      let selected_one = false;
      let list = document.createElement('ul');
      let results = truncatedChoices.map(({choice, index}) => {
        let li = document.createElement('li');
        li.setAttribute('class', `${plugin_name}_choice`);
        li.setAttribute('data-immybox-value-index', index);
        li.innerHTML = formatter(choice);
        if (this.selectedChoice && (index === this.selectedChoice.index)) {
          selected_one = true;
          addActive(li);
        }
        list.appendChild(li);
        return li;
      });
      !selected_one && addActive(results[0]);

      this.cleanNode(this.dropdownArea);
      this.cleanNode(this.queryResultArea);
      this.queryResultArea.appendChild(list);
      this.dropdownArea.appendChild(this.queryResultArea);
      if (this.queryResultsTextArea) {
        this.queryResultsTextArea.textContent = this.results_text_maker(
          truncatedChoices.length,
          filteredChoices.length
        );
        this.dropdownArea.appendChild(this.queryResultsTextArea);
      }
    } else {
      this.cleanNode(this.dropdownArea);
      this.dropdownArea.appendChild(this.noResultsArea);
    }

    this._showResults();
  }

  scroll() {
    this.highlightedChoice && this.highlightedChoice.scrollIntoView({
      behavior: this.options.scroll_behavior
    });
  }

  positionDropdownArea() {
    let input_offset = this.element.getBoundingClientRect();
    let input_height = this.element.clientHeight;
    let input_width = this.element.clientWidth;
    let results_height = this.queryResultArea.clientHeight;
    let results_bottom = input_offset.top + input_height + results_height;
    let window_bottom = window.clientHeight + window.scrollTop;

    // set the dimmensions and position
    this.dropdownArea.style.width = `${input_width}px`;
    this.dropdownArea.style.left = `${input_offset.left}px`;

    if (results_bottom > window_bottom) {
      this.dropdownArea.style.top = `${input_offset.top - results_height}px`;
    } else {
      this.dropdownArea.style.top = `${input_offset.top + input_height}px`;
    }
  }

  set highlightedChoice(choice) {
    let highlightedChoice = this.highlightedChoice;
    if (highlightedChoice) {
      moveActive(highlightedChoice, choice);
    }
  }

  get highlightedChoice() {
    let choice = this.queryResultArea.querySelector(`li.${plugin_name}_choice.active`);
    return choice || null;
  }

  highlightNextChoice() {
    let highlighted_choice = this.highlightedChoice;
    if (highlighted_choice) {
      let next_choice = highlighted_choice.nextSibling;
      if (next_choice) {
        moveActive(highlighted_choice, next_choice);
      }
    } else {
      let choice = this.queryResultArea.querySelector(`li.${plugin_name}_choice`);
      if (choice) addActive(choice);
    }
  }

  highlightPreviousChoice() {
    let highlighted_choice = this.highlightedChoice;
    if (highlighted_choice) {
      let prev_choice = highlighted_choice.previousSibling;
      if (prev_choice) {
        moveActive(highlighted_choice, prev_choice);
      }
    } else {
      let choice = this.queryResultArea.querySelector(`li.${plugin_name}_choice:last-child`);
      if (choice) addActive(choice);
    }
  }

  selectHighlightedChoice() {
    let highlighted_choice = this.highlightedChoice;
    if (highlighted_choice) {
      this.selectChoiceByValue(this.valueFromElement(highlighted_choice));
      this.hideResults();
    } else this.revert();
  }

  // display the selected choice in the input box
  display() {
    this.element.value = this.selectedChoice && this.selectedChoice.choice.text || '';
    _dispatchEvent(this.element, 'input');
    this._val = this.element.value;
  }

  // select the first choice with matching value (matching is done via the threequals comparison)
  // Note: values should be unique
  selectChoiceByValue(val) {
    let old_val = this.value;
    if (typeof val === 'undefined') {
      this.selectedChoice = void 0;
    } else {
      this.selectedChoice = this.indexed_choices.find(({choice}) => choice.value === val);
    }
    let new_val = this.value;
    new_val !== old_val && this.element.dispatchEvent(new CustomEvent('update', {
      detail: new_val
    }));
    this.display();
  }

  revertOtherInstances() {
    all_objects.forEach(plugin => plugin !== this && plugin.revert());
  }

  valueFromElement(element) {
    let index = parseInt(element.getAttribute('data-immybox-value-index'));
    return !Number.isNaN(index) ? this.values[index] : void 0;
  }

  _showResults() {
    !this.dropdownAreaVisible && document.body.appendChild(this.dropdownArea);
    this.dropdownAreaVisible = true;
    this.scroll();
    this.positionDropdownArea();
  }

  // public methods

  showResults() {
    this.revertOtherInstances();
    if (this.selectedChoice) {
      this.insertFilteredChoiceElements(this.oldQuery);
    } else {
      this.insertFilteredChoiceElements('');
    }
  }

  open() {
    return this.showResults();
  }

  hideResults() {
    this.dropdownAreaVisible && document.body.removeChild(this.dropdownArea);
    this.dropdownAreaVisible = false;
  }

  close() {
    return this.hideResults();
  }

  // return array of choices
  getChoices() {
    return this.choices;
  }

  setChoices(newChoices) {
    this.choices = newChoices;
    const default_selected_value = this.options.defaultSelectedValue;
    if (typeof default_selected_value !== 'undefined') {
      this.choices = [
        this.choices.find(({value}) => value === default_selected_value),
        ...this.choices.filter(({value}) => value !== default_selected_value)
      ].filter(choice => choice);
    }
    this.indexed_choices = this.choices.map((choice, index) => ({choice, index}));
    this.selectedChoice && this.selectChoiceByValue(this.selectedChoice.choice.value);
    this.oldQuery = '';
    return this.choices;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  unsetValue() {
    if (typeof this.value !== 'undefined') {
      this.value = void 0;
    }
  }

  // get the value of the currently-selected choice
  get value() {
    return this.selectedChoice && this.selectedChoice.choice.value;
  }

  // set the value of the currently-selected choice
  set value(new_value) {
    if (this.value !== new_value) {
      this.selectChoiceByValue(new_value);
      this.oldQuery = '';
    }
    return this.value;
  }

  // destroy this instance of the plugin
  destroy() {
    // remove event listeners
    for (let [node, events] of event_listeners.get(this))
      for (let [event_name, handler] of events) {
        node.removeEventListener(event_name, handler);
      }

    removeClass(this.element, plugin_name);
    this.hideResults();
    all_objects.delete(this.element);
  }

  static set defaults(new_defaults) {
    Object.assign(defaults, new_defaults);
  }
  static get defaults() {
    return defaults;
  }
  static resetDefaults() {
    ImmyBox.defaults = _defaults;
  }
  static get pluginMethods() {
    return [
      'showResults',
      'open',
      'hideResults',
      'close',
      'getChoices',
      'setChoices',
      'getValue',
      'setValue',
      'destroy'
    ];
  }
  static pluginForElement(element) {
    return all_objects.get(element);
  }
  static repositionAll() {
    window.requestAnimationFrame(() => {
      all_objects.forEach(plugin => {
        plugin.dropdownAreaVisible && plugin.reposition();
      });
    });
  }
  static revertAll() {
    all_objects.forEach(plugin => plugin.revert());
  }
  static repositionWhenScrolling(container) {
    // use one global scoll listener to reposition any result areas that are open
    container.addEventListener('scroll', ImmyBox.repositionAll);
  }
  static get all_objects() {
    return all_objects;
  }
  static get plugin_name() {
    return plugin_name;
  }
}

// use one global click event listener to close/revert ones that are open
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', ImmyBox.revertAll);
  // use one global resize listener to reposition any result areas that are open
  window.addEventListener('resize', ImmyBox.repositionAll);
});
