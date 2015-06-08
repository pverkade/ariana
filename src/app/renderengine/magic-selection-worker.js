importScripts("magic-selection.js");

self.addEventListener('message', function(e) {
    var magicSelection = new MagicSelection();
    var val = magicSelection.getSelection(
        e.data["data"],
        e.data["x"],
        e.data["y"],
        e.data["threshold"],
        e.data["width"],
        e.data["height"]
    );
    self.postMessage(val);
}, false);