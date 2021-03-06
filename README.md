# Immybox

Immybox is a jQuery plugin to transform regular text boxes into autocompleting
input boxes that act like select boxes.

## Usage

Check out [http://immybox.js.org/](http://immybox.js.org/) to get a quick idea of how it works and how to use it.

### IE integration

Since IE does not support the modern [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event) constructor, we suggest using
a [polyfill](https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Event/polyfill.js) to use immybox on IE.

This allows the immybox codebase to remain concise and up-to-date with modern
browser APIs.

## Installation

Immybox is available in the bower repository. To install it in your bower enabled project, just do:

`bower install immybox`

## Building

To build immybox from the less and coffeescript source, do the following in a node.js enabled environment:

```
npm install -g grunt-cli
npm install
grunt
```
## License

Immybox is released under the MIT License. Please see the LICENSE file for details.
