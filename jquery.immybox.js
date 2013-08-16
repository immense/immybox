(function() {
  var __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function($, window, document) {
    var ImmyBox, defaults, pluginName;
    pluginName = "immybox";
    defaults = {
      choices: [],
      blankIfNull: true,
      maxResults: 50,
      showArrow: true,
      openOnClick: true,
      filterFn: function(query) {
        return function(choice) {
          return choice.text.toLowerCase().indexOf(query.toLowerCase()) >= 0;
        };
      },
      formatChoice: function(choice, query) {
        var head, i, matchedText, tail, _ref;
        i = choice.text.toLowerCase().indexOf(query.toLowerCase());
        if (i >= 0) {
          matchedText = choice.text.slice(i, i + query.length);
          _ref = choice.text.split(matchedText), head = _ref[0], tail = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
          return "" + head + "<span class='highlight'>" + matchedText + "</span>" + (tail.join(matchedText));
        } else {
          return choice.text;
        }
      }
    };
    ImmyBox = (function() {
      function ImmyBox(element, options) {
        this.toggleResults = __bind(this.toggleResults, this);
        this.openResults = __bind(this.openResults, this);
        this.reposition = __bind(this.reposition, this);
        this.revert = __bind(this.revert, this);
        this.doSelection = __bind(this.doSelection, this);
        this.doQuery = __bind(this.doQuery, this);
        var self, _base;
        self = this;
        this.element = $(element);
        this.element.addClass(pluginName);
        this._defaults = defaults;
        this._name = pluginName;
        this.options = $.extend({}, defaults, options);
        this.choices = this.options.choices;
        this.selectedChoice = null;
        if (this.options.showArrow) {
          this.element.addClass("" + pluginName + "_witharrow");
          this.downArrow = $("<i class='" + pluginName + "_downarrow icon-chevron-down'></i>");
          this.element.after(this.downArrow);
          this.downArrow.on('click', this.toggleResults);
        }
        if (this.options.openOnClick) {
          this.element.on('click', this.openResults);
        }
        this.selectChoiceByValue(this.element.val());
        this.queryResultArea = $("<div class='" + pluginName + "_results'></div>");
        if (typeof (_base = this.queryResultArea).scrollLock === "function") {
          _base.scrollLock();
        }
        this._val = this.element.val();
        this.oldQuery = this._val;
        this.queryResultArea.on('click', "li." + pluginName + "_choice", function() {
          var value;
          value = $(this).data('value');
          self.selectChoiceByValue(value);
          self.hideResults();
          self._val = self.element.val();
          return self.element.focus();
        });
        this.queryResultArea.on('mouseenter', "li." + pluginName + "_choice", function() {
          self.queryResultArea.find("li." + pluginName + "_choice.active").removeClass('active');
          return $(this).addClass('active');
        });
        this.element.on('keyup change search', this.doQuery);
        this.element.on('keydown', this.doSelection);
        $('body').on('click', this.revert);
        $(window).on('resize scroll', this.reposition);
      }

      ImmyBox.prototype.doQuery = function() {
        var query;
        query = this.element.val();
        if (this._val !== query) {
          this._val = query;
          this.oldQuery = query;
          if (query === '') {
            return this.hideResults();
          } else {
            return this.insertFilteredChoiceElements(query);
          }
        }
      };

      ImmyBox.prototype.doSelection = function(e) {
        if (e.which === 27) {
          this.display();
          this.hideResults();
        }
        if (this.queryResultArea.is(':visible')) {
          switch (e.which) {
            case 9:
              return this.selectHighlightedChoice();
            case 13:
              e.preventDefault();
              return this.selectHighlightedChoice();
            case 38:
              e.preventDefault();
              this.highlightPreviousChoice();
              return this.scroll();
            case 40:
              e.preventDefault();
              this.highlightNextChoice();
              return this.scroll();
          }
        } else {
          switch (e.which) {
            case 40:
              e.preventDefault();
              if (this.selectedChoice != null) {
                return this.insertFilteredChoiceElements(this.oldQuery);
              } else {
                return this.insertFilteredChoiceElements('');
              }
              break;
            case 9:
              return this.revert();
          }
        }
      };

      ImmyBox.prototype.revert = function() {
        if (this.queryResultArea.is(':visible')) {
          this.display();
          return this.hideResults();
        } else if (this.element.val() === '') {
          return this.selectChoiceByValue(null);
        }
      };

      ImmyBox.prototype.reposition = function() {
        if (this.queryResultArea.is(':visible')) {
          return this.positionResultsArea();
        }
      };

      ImmyBox.prototype.openResults = function(e) {
        e.stopPropagation();
        this.revertOtherInstances();
        if (this.selectedChoice != null) {
          return this.insertFilteredChoiceElements(this.oldQuery);
        } else {
          return this.insertFilteredChoiceElements('');
        }
      };

      ImmyBox.prototype.toggleResults = function(e) {
        e.stopPropagation();
        this.revertOtherInstances();
        if (this.element.is(':enabled')) {
          if (this.queryResultArea.is(':visible')) {
            this.hideResults();
          } else {
            if (this.selectedChoice != null) {
              this.insertFilteredChoiceElements(this.oldQuery);
            } else {
              this.insertFilteredChoiceElements('');
            }
          }
          return this.element.focus();
        }
      };

      ImmyBox.prototype.insertFilteredChoiceElements = function(query) {
        var filteredChoices, format, info, list, results, selectedOne, truncatedChoices,
          _this = this;
        if (query === '') {
          filteredChoices = this.choices;
        } else {
          filteredChoices = this.choices.filter(this.options.filterFn(this.oldQuery));
        }
        truncatedChoices = filteredChoices.slice(0, this.options.maxResults);
        format = this.options.formatChoice;
        selectedOne = false;
        results = truncatedChoices.map(function(choice) {
          var li;
          li = $("<li class='" + pluginName + "_choice'></li>");
          li.attr('data-value', choice.value);
          li.html(format(choice, query));
          if (choice === _this.selectedChoice) {
            selectedOne = true;
            li.addClass('active');
          }
          return li;
        });
        if (results.length === 0) {
          info = $("<p class='" + pluginName + "_noresults'>no matches</p>");
          this.queryResultArea.empty().append(info);
        } else {
          if (!selectedOne) {
            results[0].addClass('active');
          }
          list = $('<ul></ul>').append(results);
          this.queryResultArea.empty().append(list);
        }
        return this.showResults();
      };

      ImmyBox.prototype.scroll = function() {
        var highlightedChoice, highlightedChoiceBottom, highlightedChoiceHeight, highlightedChoiceTop, resultsBottom, resultsHeight, resultsTop;
        resultsHeight = this.queryResultArea.height();
        resultsTop = this.queryResultArea.scrollTop();
        resultsBottom = resultsTop + resultsHeight;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice == null) {
          return true;
        }
        highlightedChoiceHeight = highlightedChoice.outerHeight();
        highlightedChoiceTop = highlightedChoice.position().top + resultsTop;
        highlightedChoiceBottom = highlightedChoiceTop + highlightedChoiceHeight;
        if (highlightedChoiceTop < resultsTop) {
          this.queryResultArea.scrollTop(highlightedChoiceTop);
        }
        if (highlightedChoiceBottom > resultsBottom) {
          return this.queryResultArea.scrollTop(highlightedChoiceBottom - resultsHeight);
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
          return this.queryResultArea.css({
            top: inputOffset.top - resultsHeight
          });
        } else {
          return this.queryResultArea.css({
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
        var highlightedChoice, nextChoice;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          nextChoice = highlightedChoice.next("li." + pluginName + "_choice");
          if (nextChoice.length === 1) {
            highlightedChoice.removeClass('active');
            return nextChoice.addClass('active');
          }
        }
      };

      ImmyBox.prototype.highlightPreviousChoice = function() {
        var highlightedChoice, previousChoice;
        highlightedChoice = this.getHighlightedChoice();
        if (highlightedChoice != null) {
          previousChoice = highlightedChoice.prev("li." + pluginName + "_choice");
          if (previousChoice.length === 1) {
            highlightedChoice.removeClass('active');
            return previousChoice.addClass('active');
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
          return this.hideResults();
        } else {
          return this.revert();
        }
      };

      ImmyBox.prototype.showResults = function() {
        $('body').append(this.queryResultArea);
        this.scroll();
        return this.positionResultsArea();
      };

      ImmyBox.prototype.hideResults = function() {
        return this.queryResultArea.detach();
      };

      ImmyBox.prototype.display = function() {
        if (this.selectedChoice != null) {
          this.selectedChoice.text;
          this.element.val(this.selectedChoice.text);
        } else if (this.options.blankIfNull) {
          this.element.val('');
        }
        return this._val = this.element.val();
      };

      ImmyBox.prototype.selectChoiceByValue = function(value) {
        var matches, newValue, oldValue;
        oldValue = this.getValue();
        if ((value != null) && value !== '') {
          matches = this.choices.filter(function(choice) {
            return choice.value == value;
          });
          if (matches[0] != null) {
            this.selectedChoice = matches[0];
          } else {
            this.selectedChoice = null;
          }
        } else {
          this.selectedChoice = null;
        }
        newValue = this.getValue();
        if (newValue !== oldValue) {
          this.element.trigger('update', [newValue]);
        }
        return this.display();
      };

      ImmyBox.prototype.revertOtherInstances = function() {
        var self;
        self = this;
        return $('.' + pluginName).each(function() {
          var otherPlugin;
          otherPlugin = $.data(this, "plugin_" + pluginName);
          if (otherPlugin !== self) {
            return otherPlugin.revert();
          }
        });
      };

      ImmyBox.prototype.publicMethods = ['getChoices', 'setChoices', 'getValue', 'setValue', 'destroy'];

      ImmyBox.prototype.getChoices = function() {
        return this.choices;
      };

      ImmyBox.prototype.setChoices = function(newChoices) {
        this.choices = newChoices;
        if (this.selectedChoice != null) {
          this.selectChoiceByValue(this.selectedChoice.value);
        }
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
        this.selectChoiceByValue(newValue);
        return this.getValue();
      };

      ImmyBox.prototype.destroy = function() {
        this.element.off('keyup change search', this.doQuery);
        this.element.off('keydown', this.doSelection);
        if (this.options.openOnClick) {
          this.element.off('click', this.openResults);
        }
        $('body').off('click', this.revert);
        $(window).off('resize scroll', this.reposition);
        this.element.removeClass(pluginName);
        if (this.options.showArrow) {
          this.element.removeClass("" + pluginName + "_witharrow");
          this.downArrow.remove();
        }
        this.queryResultArea.remove();
        return $.removeData(this.element[0], "plugin_" + pluginName);
      };

      return ImmyBox;

    })();
    return $.fn[pluginName] = function(options) {
      var args, outputs;
      args = Array.prototype.slice.call(arguments, 1);
      outputs = [];
      this.each(function() {
        var method, plugin;
        if ($.data(this, "plugin_" + pluginName)) {
          if ((options != null) && typeof options === 'string') {
            plugin = $.data(this, "plugin_" + pluginName);
            method = options;
            if (__indexOf.call(plugin.publicMethods, method) >= 0) {
              return outputs.push(plugin[method].apply(plugin, args));
            } else {
              throw new Error("" + pluginName + " has no method '" + method + "'");
            }
          }
        } else {
          return outputs.push($.data(this, "plugin_" + pluginName, new ImmyBox(this, options)));
        }
      });
      return outputs;
    };
  })(jQuery, window, document);

}).call(this);
