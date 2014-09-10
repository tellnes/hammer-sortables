# hammer-sortable

This is an extension for [Hammer.js](http://eightmedia.github.io/hammer.js/)
which implements sortable lists.

It depends on [hammer-draggables](https://github.com/tellnes/hammer-draggables).

## Usage

```js
var options =
  { handle: '.move'
  , draggable: 'li'
  , axis: 'y'
  }

var sortable = new Sortable($('ul'), options)
sortable.on('start', function (event, dragging) {
  dragging.element.classList.add('dragging')
})
sortable.on('end', function (event, dragging) {
  dragging.element.classList.remove('dragging')
})
sortable.on('change', function (dragging, moved) {
  // position changed
})

```

## Install

    $ npm install hammer-sortable

    $ bower install https://github.com/tellnes/hammer-sortables.git

## License

MIT
