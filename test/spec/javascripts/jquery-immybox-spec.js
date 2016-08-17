var fixture;

const testChoices1 = [
  {text: 'Alabama', value: 'AL'},
  {text: 'Louisiana', value: 'LA'},
  {text: 'Alaska', value: 'AK'},
  {text: 'Wisconsin', value: 'WI'},
  {text: 'Wyoming', value: 'WY'}
];

const testChoices2 = [
  {text: 'John Smith', value: 'jsmith', age: 31, employer: 'Smith Enterprises'},
  {text: 'Jane Doe', value: 'jdoe', age: 20, employer: 'National Security Agency'}
];

var immybox;
var el;

document.addEventListener("DOMContentLoaded", () => {
  const input = document.body.removeChild(document.getElementById('input-1'));

  // Before each test, reinitialize input
  beforeEach(() => {
    el = input.cloneNode(false);
    document.body.appendChild(el);
  });

  // After each test, remove the input
  afterEach(() => {
    immybox && immybox.destroy();
    document.body.removeChild(el);
  });


  describe('immybox', () => {

    it('can have a default value', () => {
      const opts = {
        choices: testChoices1,
        defaultSelectedValue: 'LA'
      };
      immybox = new ImmyBox(el, opts);
      expect(immybox.values[0]).toEqual('LA');
    });

    it('can have a max value', () => {
      const opts = {
        choices: testChoices1,
        maxResults: 2
      };
      immybox = new ImmyBox(el, opts);
      el.click();
      expect(immybox.queryResultArea.querySelectorAll('li').length).toEqual(2);
    });

    it('can specify whether to show an arrow in the input', () => {
      const opts = {
        choices: testChoices1,
        showArrow: false
      };
      immybox = new ImmyBox(el, opts);
      expect(el.classList).not.toContain('immybox_witharrow');
    });

    it('selects the first item in the list when open', () => {
      const opts = {
        choices: testChoices1
      };
      immybox = new ImmyBox(el, opts);
      el.click();
      el.value = "Ala";
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));

      const results = document.querySelectorAll('.immybox_results li');
      expect(results[0].classList).toContain('active');
    });

    describe('openOnClick option', () => {
      it('shows results when true', () => {
        const opts = {
          choices: testChoices1,
          openOnClick: true
        };

        immybox = new ImmyBox(el, opts);
        el.click();
        expect(document.querySelector('.immybox_results')).not.toBeNull();
      });
      it('doesnt show results when false', () => {
        const opts = {
          choices: testChoices1,
          openOnClick: false
        };

        immybox = new ImmyBox(el, opts);
        el.click();
        expect(document.querySelector('.immybox_results')).toBeNull();
      });
    });

    describe('formatChoice option', () => {
      const opts = {
        choices: testChoices2,
        formatChoice(query) {
          const reg = new RegExp("(" + query + ")", "i");
          return choice => (
            '<div class="mdl-grid mdl-grid--no-spacing">' +
              '<div class="mdl-cell mdl-cell--6-col">' +
                [
                  choice.text.replace(reg, "<u>$1</u>"),
                  choice.age
                ].join(", ") +
              '</div>' +
              '<div class="mdl-cell mdl-cell--6-col">' +
                choice.employer +
              '</div>' +
            '</div>'
          );
        }
      };
      const empty_string_formatter = opts.formatChoice("");
      const john_string_formatter = opts.formatChoice("John");

      it('can format the choices with query', () => {

        immybox = new ImmyBox(el, opts);

        el.click();
        el.value = "John";
        el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));

        Array.prototype.forEach.call(immybox.queryResultArea.querySelectorAll('li'), node => {
          const index = Number(node.getAttribute('data-immybox-value-index'));
          const choice = testChoices2[index];
          expect(node.innerHTML).toEqual(john_string_formatter(choice))
        });
      });

      it('can format the choices without query', () => {

        immybox = new ImmyBox(el, opts);

        const empty_string_formatter = opts.formatChoice("");
        const john_string_formatter = opts.formatChoice("John");

        el.click();

        Array.prototype.forEach.call(immybox.queryResultArea.querySelectorAll('li'), node => {
          const index = Number(node.getAttribute('data-immybox-value-index'));
          const choice = testChoices2[index];
          expect(node.innerHTML).toEqual(empty_string_formatter(choice))
        });
      });
    });


    it('can filter the choices', () => {
      const opts = {
        choices: testChoices2,
        filterFn(query) {
          const lowercase_query = query.toLowerCase();
          return choice => {
            return choice.text.toLowerCase().indexOf(lowercase_query) >= 0 ||
              String(choice.age).toLowerCase().indexOf(lowercase_query) >= 0 ||
              choice.employer.toLowerCase().indexOf(lowercase_query) >= 0
          };
        }
      };
      immybox = new ImmyBox(el, opts);
      el.click();
      el.value = '3';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));

      expect(immybox.queryResultArea.querySelectorAll('li').length).toEqual(1);
    });

    it('accepts object values in choices', () => {
      const foo = {foo: 'foo'};
      const bar = {bar: 'bar'};
      const baz = {baz: 'baz'};
      const opts = {
        choices: [
          {text: 'foo', value: foo},
          {text: 'bar', value: bar},
          {text: 'baz', value: baz}
        ]
      };
      immybox = new ImmyBox(el, opts);
      el.click();

      el.value = 'foo';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual(foo);
      expect(el.value).toEqual('foo');

      el.value = 'bar';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual(bar);
      expect(el.value).toEqual('bar');

      el.value = 'baz';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual(baz);
      expect(el.value).toEqual('baz');
    });

    it('accepts falsey values in choices', () => {
      const opts = {
        choices: [
          {text: 'null',      value: null},
          {text: '0',         value: 0},
          {text: '1',         value: 1}
        ]
      };
      immybox = new ImmyBox(el, opts);
      el.click();

      el.value = 'null';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual(null);
      expect(el.value).toEqual("null");

      el.value = '0';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual(0);
      expect(el.value).toEqual("0");

      el.value = '1';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual(1);
      expect(el.value).toEqual("1");
    });

    it('allows choices to be reset', () => {
      const opts = {
        choices: [
          {text: 'foo', value: 'foo'},
          {text: 'bar', value: 'bar'}
        ]
      };
      immybox = new ImmyBox(el, opts);
      el.click();

      el.value = 'foo';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual('foo');
      expect(el.value).toEqual('foo');

      immybox.setChoices([
        {text: 'baz', value: 'baz'},
        {text: 'quux', value: 'quux'}
      ]);
      expect(immybox.value).toEqual(undefined);
      expect(el.value).toEqual('');

      el.click();
      el.value = 'quux';
      el.dispatchEvent(new Event("keyup", {"bubbles":true, "cancelable":false}));
      immybox.queryResultArea.querySelector('li:first-of-type').click();
      expect(immybox.value).toEqual('quux');
      expect(el.value).toEqual('quux');
    });
  });

  describe('jquery.immybox', () => {
    describe('#open() and #close()', () => {
      it('opens and closes the query result area', () => {
        const opts = {
          choices: [
            {text: 'foo', value: 'foo'},
            {text: 'bar', value: 'bar'}
          ]
        };
        $('#input-1').immybox(opts);
        immybox = ImmyBox.all_objects.get(el);
        $('#input-1').immybox('open');
        expect(document.querySelector('.immybox_results')).not.toBeNull();
        $('#input-1').immybox('close');
        expect(document.querySelector('.immybox_results')).toBeNull();
      });
    });
  });
});
