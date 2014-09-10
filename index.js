var inherits = require('inherits')
  , Draggables = require('hammer-draggables')

module.exports = Sortable

function Sortable(obj, options) {
  Draggables.call(this, obj, options)
  this.revert = true
  this.axis = options.axis || 'y'
}
inherits(Sortable, Draggables)

function rectOverlapsX(elmRect, sblRect) {
  var over

  if (elmRect.left < sblRect.left) {
    over = (elmRect.left + elmRect.width) - sblRect.left
    return over / sblRect.width

  } else if (elmRect.left > sblRect.left) {
    over = sblRect.width - (elmRect.left - sblRect.left)
    return over / sblRect.width

  } else {
    return 1
  }
}

function rectOverlapsY(elmRect, sblRect) {
  var over

  if (elmRect.top < sblRect.top) {
    over = (elmRect.top + elmRect.height) - sblRect.top
    return over / sblRect.height

  } else if (elmRect.top > sblRect.top) {
    over = sblRect.height - (elmRect.top - sblRect.top)
    return over / sblRect.height

  } else {
    return 1
  }
}

Sortable.prototype.move = function (event) {
  Draggables.prototype.move.call(this, event)
  if (!this.dragging) return

  var self = this
    , dragging = this.dragging
    , sibling
    , rectOverlaps = this.axis === 'x' ? rectOverlapsX : rectOverlapsY

  sibling = dragging.element.previousElementSibling

  var elementRect = dragging.element.getBoundingClientRect()
    , siblingRect

  // previous sortable
  if (!sibling && this.previous) {
    siblingRect = this.previous.element.getBoundingClientRect()
    if (rectOverlaps(elementRect, siblingRect) > 0) {
      dragging.offset.top += this.element.getBoundingClientRect().top - siblingRect.bottom
      return leave('before', this.previous)
    }
  }

  // Parent list item
  if (sibling) {
    siblingRect = sibling.getBoundingClientRect()
    if (rectOverlaps(elementRect, siblingRect) > 0.5) {
      dragging.offset.top += sibling.clientHeight
      return change(-1, sibling.parentNode, sibling)
    }
  }


  sibling = dragging.element.nextElementSibling

  // next list item
  if (sibling) {
    siblingRect = sibling.getBoundingClientRect()
    if (rectOverlaps(elementRect, siblingRect) > 0.5) {
      dragging.offset.top -= sibling.clientHeight
      return change(1, sibling.parentNode, sibling.nextElementSibling)
    }
  }

  // next sortable
  if (!sibling && this.next) {
    siblingRect = this.next.element.getBoundingClientRect()
    if (rectOverlaps(elementRect, siblingRect) > 0) {
      dragging.offset.top -= siblingRect.top - this.element.getBoundingClientRect().bottom
      return leave('after', this.next, this.next.element.firstElementChild)
    }
  }


  function change(direction, parent, before) {
    parent.insertBefore(dragging.element, before)
    self.dragging.updatePosition(event)
    self.emit('change', dragging, direction)
  }
  function leave(position, other, before) {
    other.element.insertBefore(dragging.element, before)

    other.dragging = self.dragging
    other.dragging.updatePosition(event)

    self.dragging = null

    self.hammer.off('drag', self.moveHandler)
    self.hammer.off('dragend', self.endHandler)
    other.hammer.on('drag', other.moveHandler)
    other.hammer.on('dragend', other.endHandler)

    self.emit('leave', dragging, other, position)
    other.emit('receive', dragging, self, position)
  }
}
