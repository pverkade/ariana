/*
 * Project Ariana
 * arrayFunctions.js
 *
 * This file contains a function for using arrays.
 *
 */

Array.prototype.swap = function(x, y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
}