// Once the DOM has been parsed and created, set up our plugins
document.addEventListener('DOMContentLoaded', () => {
  // Tell ImmyBox that is should reposition any open plugins when the
  // .mdl-layout element is scrolled
  ImmyBox.repositionWhenScrolling(document.getElementById('scrollable'));

  const _statesChoices = [
    {text: 'Alabama', value: 'AL'},
    {text: 'Alaska', value: 'AK'},
    {text: 'Arizona', value: 'AZ'},
    {text: 'Arkansas', value: 'AR'},
    {text: 'California', value: 'CA'},
    {text: 'Colorado', value: 'CO'},
    {text: 'Connecticut', value: 'CT'},
    {text: 'Delaware', value: 'DE'},
    {text: 'Florida', value: 'FL'},
    {text: 'Georgia', value: 'GA'},
    {text: 'Hawaii', value: 'HI'},
    {text: 'Idaho', value: 'ID'},
    {text: 'Illinois', value: 'IL'},
    {text: 'Indiana', value: 'IN'},
    {text: 'Iowa', value: 'IA'},
    {text: 'Kansas', value: 'KS'},
    {text: 'Kentucky', value: 'KY'},
    {text: 'Louisiana', value: 'LA'},
    {text: 'Maine', value: 'ME'},
    {text: 'Maryland', value: 'MD'},
    {text: 'Massachusetts', value: 'MA'},
    {text: 'Michigan', value: 'MI'},
    {text: 'Minnesota', value: 'MN'},
    {text: 'Mississippi', value: 'MS'},
    {text: 'Missouri', value: 'MO'},
    {text: 'Montana', value: 'MT'},
    {text: 'Nebraska', value: 'NE'},
    {text: 'Nevada', value: 'NV'},
    {text: 'New Hampshire', value: 'NH'},
    {text: 'New Jersey', value: 'NJ'},
    {text: 'New Mexico', value: 'NM'},
    {text: 'New York', value: 'NY'},
    {text: 'North Carolina', value: 'NC'},
    {text: 'North Dakota', value: 'ND'},
    {text: 'Ohio', value: 'OH'},
    {text: 'Oklahoma', value: 'OK'},
    {text: 'Oregon', value: 'OR'},
    {text: 'Pennsylvania', value: 'PA'},
    {text: 'Rhode Island', value: 'RI'},
    {text: 'South Carolina', value: 'SC'},
    {text: 'South Dakota', value: 'SD'},
    {text: 'Tennessee', value: 'TN'},
    {text: 'Texas', value: 'TX'},
    {text: 'Utah', value: 'UT'},
    {text: 'Vermont', value: 'VT'},
    {text: 'Virginia', value: 'VA'},
    {text: 'Washington', value: 'WA'},
    {text: 'West Virginia', value: 'WV'},
    {text: 'Wisconsin', value: 'WI'},
    {text: 'Wyoming', value: 'WY'}
  ];

  // jquery simple example
  $('#input-jquery-1').immybox({
    choices: _statesChoices
  });

  $.fn.immybox.defaults = {
    maxResults: 5,
    showArrow: false,
    open_on_focus: false,
    defaultSelectedValue: 'LA',
    scroll_behavior: 'instant',
    no_results_text: 'no results',
    makeQueryResultsText(x, y) {
      return `${x} matching results (out of ${y})`;
    },
    filterFn(query) {
      let lower_query = query.toLowerCase();
      return choice => choice.alwaysShow || choice.text.toLowerCase().indexOf(lower_query) >= 0;
    },
    formatChoice(query) {
      if (query) {
        let reg = new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'gi');
        return choice => choice.text.replace(reg, '<strong class="highlight">$&</strong>');
      } else
        return choice => choice.text;
    }
  };

  $('#input-jquery-2').immybox({
    choices: _statesChoices
  });

  // simple example
  new ImmyBox(document.getElementById('input-1'), {
    choices: _statesChoices,
    defaultSelectedValue: 'LA'
  });

  // options -- choices
  new ImmyBox(document.getElementById('input-2'), {
    choices: [
      {text: 'Foo', value: 'foo'},
      {text: 'Bar', value: 'bar'}
    ]
  });

  // options -- maxResults
  new ImmyBox(document.getElementById('input-3'), {
    choices: [
      {text: 'Foo', value: 'foo'},
      {text: 'Bar', value: 'bar'}
    ],
    maxResults: 1
  });

  // options -- showArrow
  new ImmyBox(document.getElementById('input-4'), {
    choices: [
      {text: 'Foo', value: 'foo'},
      {text: 'Bar', value: 'bar'}
    ],
    showArrow: false
  });

  // options -- open_on_focus
  new ImmyBox(document.getElementById('input-5'), {
    choices: [
      {text: 'Foo', value: 'foo'},
      {text: 'Bar', value: 'bar'}
    ],
    open_on_focus: false
  });

  // options -- formatChoice
  new ImmyBox(document.getElementById('input-6'), {
    choices: [
      {text: 'John Smith', value: 'jsmith', age: 31, employer: 'Smith Enterprises'},
      {text: 'Jane Doe', value: 'jdoe', age: 20, employer: 'National Security Agency'}
    ],
    formatChoice: function(query) {
      var reg = new RegExp("(" + query + ")", "i");
      return function(choice) {
        return "<div class='mdl-grid mdl-grid--no-spacing'>" +
                 "<div class='mdl-cell mdl-cell--6-col'>" +
                   [
                     choice.text.replace(reg, "<u>$1</u>"),
                     choice.age
                   ].join(", ") +
                 "</div>" +
                 "<div class='mdl-cell mdl-cell--6-col'>" +
                   choice.employer +
                 "</div>" +
               "</div>";
      };
    }
  });

  // options -- filterFn
  new ImmyBox(document.getElementById('input-7'), {
    choices: [
      {text: 'John Smith', value: 'jsmith', age: 31, employer: 'Smith Enterprises'},
      {text: 'Jane Doe', value: 'jdoe', age: 20, employer: 'National Security Agency'}
    ],
    filterFn: function(query) {
      var lowercase_query = query.toLowerCase();
      return function(choice) {
        return choice.text.toLowerCase().indexOf(lowercase_query) >= 0 ||
        String(choice.age).toLowerCase().indexOf(lowercase_query) >= 0 ||
        choice.employer.toLowerCase().indexOf(lowercase_query) >= 0;
      };
    },
    formatChoice: function(query) {
      var reg = new RegExp("(" + query + ")", 'i');
      return function(choice) {
        return "<div class='mdl-grid mdl-grid--no-spacing'>" +
                 "<div class='mdl-cell mdl-cell--6-col'>" +
                   [
                     choice.text.replace(reg, "<u>$1</u>"),
                     String(choice.age).replace(reg, "<u>$1</u>")
                   ].join(", ") +
                 "</div>" +
                 "<div class='mdl-cell mdl-cell--6-col'>" +
                   choice.employer.replace(reg, "<u>$1</u>") +
                 "</div>" +
               "</div>";
      };
    }
  });

  // options -- defaultSelectedValue
  new ImmyBox(document.getElementById('input-8'), {
    choices: [
      {text: 'Foo', value: 'foo'},
      {text: 'Bar', value: 'bar'}
    ],
    defaultSelectedValue: 'bar'
  });

  // options -- scroll_behavior
  new ImmyBox(document.getElementById('input-9'), {
    choices: _statesChoices,
    scroll_behavior: 'instant'
  });

  // options -- no_results_text
  new ImmyBox(document.getElementById('input-10'), {
    choices: [],
    no_results_text: 'No Schmeckles Available'
  });

  // options -- makeQueryResultsText
  new ImmyBox(document.getElementById('input-11'), {
    choices: _statesChoices,
    maxResults: 10,
    makeQueryResultsText(numVisibleChoices, numChoicesMatchingFilter) {
      if (numChoicesMatchingFilter === numVisibleChoices) {
        return `Showing all ${numChoicesMatchingFilter} matching states`;
      }
      return `${numChoicesMatchingFilter} states match; displaying ${numVisibleChoices} of them`;
    }
  });

  ImmyBox.defaults = {
    maxResults: 5,
    showArrow: false,
    open_on_focus: false,
    defaultSelectedValue: 'LA',
    scroll_behavior: 'instant',
    no_results_text: 'no results',
    makeQueryResultsText(x, y) {
      return `${x} matching results (out of ${y})`;
    },
    filterFn(query) {
      let lower_query = query.toLowerCase();
      return choice => choice.alwaysShow || choice.text.toLowerCase().indexOf(lower_query) >= 0;
    },
    formatChoice(query) {
      if (query) {
        let reg = new RegExp(query.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'), 'gi');
        return choice => choice.text.replace(reg, '<strong class="highlight">$&</strong>');
      } else
        return choice => choice.text;
    }
  };

  new ImmyBox(document.getElementById('input-12'), {
    choices: _statesChoices
  });

  ImmyBox.resetDefaults();

  // Runnable 1
  function destroyRunnable1() {
    var el = document.getElementById('input-runnable-1');
    var plugin = ImmyBox.pluginForElement(el);
    plugin && plugin.destroy();
  }
  document.getElementById('button-run-1').addEventListener('click', event => {
    if (window.plugin) destroyRunnable1();
    event.cancelBubble = true;
    event.stopPropogation && event.stopPropogation();
    var el = document.getElementById('input-runnable-1');
    var plugin = new ImmyBox(el, {
      choices: [
        {text: 'Foo', value: 'foo'},
        {text: 'Bar', value: 'bar'}
      ]
    });
    plugin.showResults();
  });
  document.getElementById('button-reset-1').addEventListener('click', event => {
    event.cancelBubble = true;
    event.stopPropogation && event.stopPropogation();
    destroyRunnable1();
  });
});
