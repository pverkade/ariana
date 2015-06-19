Array.prototype.swap = function(x, y) {
    var b = this[x];
    this[x] = this[y];
    this[y] = b;
    return this;
}