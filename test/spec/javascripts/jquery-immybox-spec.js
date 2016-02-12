var fixture;

var testChoices1 = [
  {text: 'Alabama', value: 'AL'},
  {text: 'Louisiana', value: 'LA'},
  {text: 'Alaska', value: 'AK'},
  {text: 'Wisconsin', value: 'WI'},
  {text: 'Wyoming', value: 'WY'}
];

var testChoices2 = [
  {text: 'John Smith', value: 'jsmith', age: 31, employer: 'Smith Enterprises'},
  {text: 'Jane Doe', value: 'jdoe', age: 20, employer: 'National Security Agency'}
]

// Before each test, reinitialize input
beforeEach(function () {
  fixture = setFixtures('<input type="text" id="input-1" />') ;
});

// After each test, remove the input
afterEach(function () {
  $("#input-1").remove();
  $(".immybox_results").remove();
});


describe('immybox options', function() {

  it('can have a default value', function() {
    $('#input-1').immybox({
      choices: testChoices1,
      defaultSelectedValue: 'LA'
    });
    expect($('#input-1').data().plugin_immybox.defaultSelectedChoice).toEqual({text: "Louisiana", value: "LA"});
  });

  it('can have a max value', function() {
    $('#input-1').immybox({
      choices: testChoices1,
      maxResults: 2
    });
    expect($('#input-1').data().plugin_immybox.options.maxResults).toEqual(2);
  });

  it('can specify whether to show an arrow in the input', function() {
    $('#input-1').immybox({
      choices: testChoices1,
      showArrow: false
    });
    expect($('#input-1').data().plugin_immybox.options.showArrow).toEqual(false);
  });

  it('can specify whether to open on click', function() {
    $('#input-1').immybox({
      choices: testChoices1,
      openOnClick: false
    });
    expect($('#input-1').data().plugin_immybox.options.openOnClick).toEqual(false);
  });

  it('can format the choices', function() {
    $('#input-1').immybox({
      choices: testChoices2,
      formatChoice(query) {
        const reg = new RegExp("(" + query + ")", "i");
        return choice => (
          "<div class='mdl-grid mdl-grid--no-spacing'>" +
            "<div class='mdl-cell mdl-cell--6-col'>" +
              [
                choice.text.replace(reg, "<u>$1</u>"),
                choice.age
              ].join(", ") +
            "</div>" +
            "<div class='mdl-cell mdl-cell--6-col'>" +
              choice.employer +
            "</div>" +
          "</div>"
        );
      }
    });
    $('#input-1').trigger( "click" );
    expect($('#input-1').data().plugin_immybox.queryResultArea[0].innerHTML).toEqual('<ul><li class="immybox_choice active" data-value="jsmith"><div class="mdl-grid mdl-grid--no-spacing"><div class="mdl-cell mdl-cell--6-col"><u></u>John Smith, 31</div><div class="mdl-cell mdl-cell--6-col">Smith Enterprises</div></div></li><li class="immybox_choice" data-value="jdoe"><div class="mdl-grid mdl-grid--no-spacing"><div class="mdl-cell mdl-cell--6-col"><u></u>Jane Doe, 20</div><div class="mdl-cell mdl-cell--6-col">National Security Agency</div></div></li></ul>');
  });


  it('can filter the choices', function() {
    $('#input-1').immybox({
      choices: testChoices2,
      filterFn: query => {
        const lowercase_query = query.toLowerCase();
        return choice => {
          return choice.text.toLowerCase().indexOf(lowercase_query) >= 0 ||
            String(choice.age).toLowerCase().indexOf(lowercase_query) >= 0 ||
            choice.employer.toLowerCase().indexOf(lowercase_query) >= 0
        };
      }
    });
    $('#input-1').click();
    $('#input-1').val('3');
    $('#input-1').trigger('keyup');
    var filterCount = $('.immybox_results li ').length;
    expect(filterCount).toEqual(1);

  });

});
