importScripts("magic-selection.js");

self.addEventListener('message', function(e) {
    var magicSelection = new MagicSelection();
    var val = magicSelection.getSelection(e.data["data"], 255, 250, 0.1, e.data["width"], e.data["height"]);
    self.postMessage(val);
}, false);