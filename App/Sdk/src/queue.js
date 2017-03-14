;(function () {
  function Array_h (length) {
    this.array = length === undefined ? [] : new Array(length)
  }

  Array_h.prototype = {
        /**
         * return length of array
         *
         * @return {Number} length [length of array]
         */
    length: function () {
      return this.array.length
    },

    at: function (index) {
      return this.array[index]
    },

    set: function (index, obj) {
      this.array[index] = obj
    },

        /**
         * add object to the end of array, and return length of array
         *
         * @param  {*} obj [description]
         * @return {Number} length [length of array]
         */
    push: function (obj) {
      return this.array.push(obj)
    },

        /**
         * return selected range of object in array
         *
         * @param  {Number} start [start index]
         * @param  {Number} end [end index]
         * @return {Array} newArray  [new array]
         */
    slice: function (start, end) {
      return this.array = this.array.slice(start, end)
    },

    concat: function (array) {
      this.array = this.array.concat(array)
    },

    remove: function (index, count) {
      count = count === undefined ? 1 : count
      this.array.splice(index, count)
    },

    join: function (separator) {
      return this.array.join(separator)
    },

    clear: function () {
      this.array.length = 0
    }
  }

    /**
     * First Input First Output
     *
     * FIFO buffer
     */
  var Queue = function () {
    this._array_h = new Array_h()
  }

  Queue.prototype = {
    _index: 0,

        /**
         * queue
         *
         * @param  {Object} obj [description]
         * @return {[type]}     [description]
         */
    push: function (obj) {
      this._array_h.push(obj)
    },

        /**
         * dequeue
         *
         * @return {Object} [description]
         */
    pop: function () {
      var ret = null
      if (this._array_h.length()) {
        ret = this._array_h.at(this._index)
        if (++this._index * 2 >= this._array_h.length()) {
          this._array_h.slice(this._index)
          this._index = 0
        }
      }
      return ret
    },

        /**
         * return the latest added object of the array (last object in array)
         *
         * @return {Object} [description]
         */
    head: function () {
      var ret = null, len = this._array_h.length()
      if (len) {
        ret = this._array_h.at(len - 1)
      }
      return ret
    },

        /**
         * return the oldest added object of the array
         *
         * @return {Object} [description]
         */
    tail: function () {
      var ret = null, len = this._array_h.length()
      if (len) {
        ret = this._array_h.at(this._index)
      }
      return ret
    },

        /**
         * return the length of the queue
         *
         * @return {Number} [description]
         */
    length: function () {
      return this._array_h.length() - this._index
    },

        /**
         * if empty queue
         *
         * @return {Boolean} [description]
         */
    empty: function () {
      return (this._array_h.length() === 0)
    },

    clear: function () {
      this._array_h.clear()
    }
  }
  exports.Queue = Queue
}())
