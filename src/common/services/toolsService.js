app.service('tools', function() {

    this.getTool = function() {
        return this._params.activeTool;
    };

    this.getToolFunctions = function() {
        return this._params.activeToolFunctions;
    };

    this.getToolset = function() {
        return this._params.activeToolset;
    };

    this.setTool = function(tool) {
        this._params.activeTool = tool;
    };

    this.setToolFunctions = function(functions) {
        this._params.activeToolFunctions = functions;
    };

    this.setToolset = function(toolset) {
        this._params.activeToolset = toolset;
    };

    this._params = {
        activeTool: 'pan',
        activeToolFunctions: null,
        activeToolset: null,
    };
});