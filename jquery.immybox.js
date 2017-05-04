(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($, window, document) {
    var ImmyBox, defaults, objects, pluginName;
    pluginName = "immybox";
    defaults = {
      choices: [],
      maxResults: 50,
      showArrow: true,
      openOnClick: true,
      defaultSelectedValue: void 0,
      filterFn: function(query) {
        return function(choice) {
          return choice.text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        };
      },
      formatChoice: function(query) {
        var reg;
        if ((query != null) && query !== '') {
          reg = new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'gi');
          return function(choice) {
            return choice.text.replace(reg, '<span class="highlight">$&</span>');
          };
        } else {
          return function(choice) {
            return choice.text;
          };
        }
      }
    };
    objects = [];
    ImmyBox = (function() {
      function ImmyBox(element, options) {
        this.reposition = bind(this.reposition, this);
        this.revert = bind(this.revert, this);
        this.openResults = bind(this.openResults, this);
        this.doSelection = bind(this.doSelection, this);
        this.doQuery = bind(this.doQuery, this);
        var base, self;
        self = this;
        this.element = $(element);
        this.element.addClass(pluginName);
        this.element.attr('autocomplete', 'off');
        this._defaults = defaults;
        this._name = pluginName;
        this._element = element;
        this.options = $.extend({}, defaults, options);
        this.choices = this.options.choices;
        this.selectedChoice = null;
        this.defaultSelectedChoice = this.options.defaultSelectedValue != null ? this.choices.filter(function(c) {
          return c.value === self.options.defaultSelectedValue;
        })[0] || null : this.options.defaultSelectedValue;
        if (this.options.showArrow) {
          this.element.addClass(pluginName + "_witharrow");
        }
        if (this.options.openOnClick) {
          this.element.on('click', this.openResults);
        }
        this.selectChoiceByValue(this.element.val());
        this.queryResultArea = $("<div class='" + pluginName + "_results'></div>");
        if (typeof (base = this.queryResultArea).scrollLock === "function") {
          base.scrollLock();
        }
        this.queryResultAreaVisible = false;
        this._val = this.element.val();
        this.oldQuery = this._val;
        this.queryResultArea.on('click', "li." + pluginName + "_choice", function() {
          var value;
          value = $(this).data('value');
          self.selectChoiceByValue(value);
          self.hideResults();
          self._val = self.element.val();
          self.element.focus();
        });
        this.queryResultArea.on('mouseenter', "li." + pluginName + "_choice", function() {
          self.queryResultArea.find("li." + pluginName + "_choice.active").removeClass('active');
          $(this).addClass('active');
        });
        this.element.on('keyup change search', this.doQuery);
        this.element.on('keydown', this.doSelection);
      }

      ImmyBox.prototype.doQuery = function() {
        var query;
        query = this.element.val();
        if (this._val !== query) {
          this._val = query;
          this.oldQuery = query;
          if (query === '') {
            this.hideResults();
            this.selectChoiceByValue(null);
          } else {
            this.insertFilteredChoiceElements(query);
          }
        }
      };

      ImmyBox.prototype.doSelection = function(e) {
        if (e.which === 27) {
          this.display();
          this.hideResults();
        }
        if (this.queryResultAreaVisible) {
          switch (e.which) {
            case 9:
              this.selectHighlightedChoice();
              break;
            case 13:
              e.preventDefault();
              this.selectHighlightedChoice();
              break;
            case 38:
              e.preventDefault();
              this.highlightPreviousChoice();
              this.scroll();
              break;
            case 40:
              e.preventDefault();
              this.highlightNextChoice();
              this.scroll();
          }
        } else {
          switch (e.which) {
            case 40:
              e.preventDefault();
              if (this.selectedChoice != null) {
                this.insertFilteredChoiceElements(this.oldQuery);
              } else {
                this.insertFilteredChoiceElements('');
              }
              break;
            case 9:
              this.revert();
          }
        }
      };

      ImmyBox.prototype.openResults = function(e) {
        e.stopPropagation();
        this.revertOtherInstances();
        if (this.selectedChoice != null) {
          this.insertFilteredChoiceElements(this.oldQuery);
        } else {
          this.insertFilteredChoiceElements('');
        }
      };

      ImmyBox.prototype.revert = function() {
        if (this.queryResultAreaVisible) {
          this.display();
          this.hideResults();
        } else if (this.element.val() === '') {
          this.selectChoiceByValue(null);
        }
      };

      ImmyBox.prototype.reposition = function() {
        if (this.queryResultAreaVisible) {
          this.positionResultsArea();
        }
      };

      ImmyBox.prototype.insertFilteredChoiceElements = function(query) {
        var defaultChoice, filteredChoices, format, info, list, results, selectedOne, truncatedChoices;
        if (query === '') {
          filteredChoices = this.choices;
        } else {
          filteredChoices = this.choices.filter(this.options.filterFn(this.oldQuery));
        }
        truncatedChoices = filteredChoices.slice(0, this.options.maxResults);
        if (defaultChoice = this.defaultSelectedChoice) {
          if (indexOf.call(filteredChoices, defaultChoice) >= 0) {
            if (indexOf.call(truncatedChoices, defaultChoice) < 0) {
              truncatedChoices.unshift(defaultChoice);
              truncatedChoices.pop();
            } else {
              if (truncatedChoices[0] !== defaultChoice) {
                truncatedChoices = truncatedChoices.filter(function(c) {
                  return c.value !== defaultChoice.value;
                });
                truncatedChoices.unshift(defaultChoice);
              }
            }
          }
        }
        format = this.options.formatChoice;
        if (format.length === 1) {
          format = format(query);
        }
        selectedOne = false;
        results = truncatedChoices.map((function(_this) {
          return function(choice) {
            var li;
            li = $("<li class='" + pluginName + "_choice'></li>");
            li.attr('data-value', choice.value);
            li.html(format(choice, query));
            if (choice === _this.selectedChoice) {
              selectedOne = true;
              li.addClass('active');
            }
            return li;
          };
        })(this));
        if (results.length === 0) {
          info = $("<p class='" + pluginName + "_noresults'>no matches</p>");
          this.queryResultArea.empty().append(info);
        } else {
          if (!selectedOne) {
            if (defaultChoice !== null) {
              results[0].addClass('active');
            }
          }
          list = $('<ul></ul>').append(results);
          this.queryResultArea.empty().append(list);
        }
        this.showResults();
      };

      ImmyBox.prototype.scroll = function() {
        var highlightedChoice, highlightedChoiceBottom, highlightedChoiceHeight, highlightedChoiceTop, resultsBottom, resultsHeight, resultsTop;
        resultsHeight = this.queryResultArea.height();
        resultsTop = this.queryResultArea.scrollTop();
        resultsBottom = resultsTop + resultsHeight;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice == null) {
          return;
        }
        highlightedChoiceHeight = highlightedChoice.outerHeight();
        highlightedChoiceTop = highlightedChoice.position().top + resultsTop;
        highlightedChoiceBottom = highlightedChoiceTop + highlightedChoiceHeight;
        if (highlightedChoiceTop < resultsTop) {
          this.queryResultArea.scrollTop(highlightedChoiceTop);
        }
        if (highlightedChoiceBottom > resultsBottom) {
          this.queryResultArea.scrollTop(highlightedChoiceBottom - resultsHeight);
        }
      };

      ImmyBox.prototype.positionResultsArea = function() {
        var inputHeight, inputOffset, inputWidth, resultsBottom, resultsHeight, windowBottom;
        inputOffset = this.element.offset();
        inputHeight = this.element.outerHeight();
        inputWidth = this.element.outerWidth();
        resultsHeight = this.queryResultArea.outerHeight();
        resultsBottom = inputOffset.top + inputHeight + resultsHeight;
        windowBottom = $(window).height() + $(window).scrollTop();
        this.queryResultArea.outerWidth(inputWidth);
        this.queryResultArea.css({
          left: inputOffset.left
        });
        if (resultsBottom > windowBottom) {
          this.queryResultArea.css({
            top: inputOffset.top - resultsHeight
          });
        } else {
          this.queryResultArea.css({
            top: inputOffset.top + inputHeight
          });
        }
      };

      ImmyBox.prototype.getHighlightedChoice = function() {
        var choice;
        choice = this.queryResultArea.find("li." + pluginName + "_choice.active");
        if (choice.length === 1) {
          return choice;
        } else {
          return null;
        }
      };

      ImmyBox.prototype.highlightNextChoice = function() {
        var choices, highlightedChoice, nextChoice;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          nextChoice = highlightedChoice.next("li." + pluginName + "_choice");
          if (nextChoice.length === 1) {
            highlightedChoice.removeClass('active');
            nextChoice.addClass('active');
          }
        } else {
          choices = this.queryResultArea.find("li." + pluginName + "_choice");
          if (choices.length) {
            $(choices[0]).addClass('active');
          }
        }
      };

      ImmyBox.prototype.highlightPreviousChoice = function() {
        var choices, highlightedChoice, previousChoice;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          previousChoice = highlightedChoice.prev("li." + pluginName + "_choice");
          if (previousChoice.length === 1) {
            highlightedChoice.removeClass('active');
            previousChoice.addClass('active');
          }
        } else {
          choices = this.queryResultArea.find("li." + pluginName + "_choice");
          if (choices.length) {
            $(choices[choices.length - 1]).addClass('active');
          }
        }
      };

      ImmyBox.prototype.selectHighlightedChoice = function() {
        var highlightedChoice, value;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          value = highlightedChoice.data('value');
          this.selectChoiceByValue(value);
          this._val = this.element.val();
          this.hideResults();
        } else {
          this.revert();
        }
      };

      ImmyBox.prototype.display = function() {
        if (this.selectedChoice != null) {
          this.selectedChoice.text;
          this.element.val(this.selectedChoice.text);
        } else {
          this.element.val('');
        }
        if (typeof Event !== 'undefined') {
          var Event = document.createEvent('Event');
          Event.initEvent('input', false, true);
          this._element.dispatchEvent(Event);
        }
        this._val = this.element.val();
      };

      ImmyBox.prototype.selectChoiceByValue = function(value_to_select) {
        var matches, old_value, value;
        old_value = this.getValue();
        if ((value_to_select != null) && value_to_select !== '') {
          matches = this.choices.filter(function(choice) {
            return choice.value == value_to_select;
          });
          if (matches[0] != null) {
            this.selectedChoice = matches[0];
          } else {
            this.selectedChoice = null;
          }
        } else {
          this.selectedChoice = null;
        }
        value = this.getValue();
        if (value !== old_value) {
          this.element.trigger('update', [value]);
        }
        this.display();
      };

      ImmyBox.prototype.revertOtherInstances = function() {
        var i, len, o;
        for (i = 0, len = objects.length; i < len; i++) {
          o = objects[i];
          if (o !== this) {
            o.revert();
          }
        }
      };

      ImmyBox.prototype.publicMethods = ['showResults', 'hideResults', 'getChoices', 'setChoices', 'getValue', 'setValue', 'destroy'];

      ImmyBox.prototype.showResults = function() {
        $('body').append(this.queryResultArea);
        this.queryResultAreaVisible = true;
        this.scroll();
        this.positionResultsArea();
      };

      ImmyBox.prototype.hideResults = function() {
        this.queryResultArea.detach();
        this.queryResultAreaVisible = false;
      };

      ImmyBox.prototype.getChoices = function() {
        return this.choices;
      };

      ImmyBox.prototype.setChoices = function(newChoices) {
        this.choices = newChoices;
        if (this.selectedChoice != null) {
          this.selectChoiceByValue(this.selectedChoice.value);
        }
        this.oldQuery = '';
        return newChoices;
      };

      ImmyBox.prototype.getValue = function() {
        if (this.selectedChoice != null) {
          return this.selectedChoice.value;
        } else {
          return null;
        }
      };

      ImmyBox.prototype.setValue = function(newValue) {
        var currentValue;
        currentValue = this.getValue();
        if (currentValue !== newValue) {
          this.selectChoiceByValue(newValue);
          this.oldQuery = '';
          return this.getValue();
        } else {
          return currentValue;
        }
      };

      ImmyBox.prototype.destroy = function() {
        this.element.off('keyup change search', this.doQuery);
        this.element.off('keydown', this.doSelection);
        if (this.options.openOnClick) {
          this.element.off('click', this.openResults);
        }
        this.element.removeClass(pluginName);
        this.queryResultArea.remove();
        $.removeData(this.element[0], "plugin_" + pluginName);
        objects = objects.filter((function(_this) {
          return function(o) {
            return o !== _this;
          };
        })(this));
      };

      return ImmyBox;

    })();
    $('html').on('click', function() {
      var i, len, o;
      for (i = 0, len = objects.length; i < len; i++) {
        o = objects[i];
        o.revert();
      }
    });
    $(window).on('resize scroll', function() {
      var i, len, o;
      for (i = 0, len = objects.length; i < len; i++) {
        o = objects[i];
        if (o.queryResultAreaVisible) {
          o.reposition();
        }
      }
    });
    $.fn[pluginName] = function(options) {
      var args, outputs;
      args = Array.prototype.slice.call(arguments, 1);
      outputs = [];
      this.each(function() {
        var method, newObject, plugin;
        if ($.data(this, "plugin_" + pluginName)) {
          if ((options != null) && typeof options === 'string') {
            plugin = $.data(this, "plugin_" + pluginName);
            method = options;
            if (indexOf.call(plugin.publicMethods, method) >= 0) {
              outputs.push(plugin[method].apply(plugin, args));
            } else {
              throw new Error(pluginName + " has no method '" + method + "'");
            }
          }
        } else {
          newObject = new ImmyBox(this, options);
          objects.push(newObject);
          outputs.push($.data(this, "plugin_" + pluginName, newObject));
        }
      });
      return outputs;
    };
  })(jQuery, window, document);

}).call(this);
