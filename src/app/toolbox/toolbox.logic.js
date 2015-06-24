/*
 * Project Ariana
 * toolbox.logic.js
 *
 * This file contains the ToolboxCtrl, which controls the behaviour of
 * the toolbox and the color preview. 
 *
 */

app.controller('ToolboxCtrl', function($scope) {
    
    $scope.setCursor = function(cursor) {
        $scope.config.canvas.cursor = cursor;
    };

    $scope.getCursor = function() {
        return $scope.config.canvas.cursor;
    };

    /* This function swaps the primary and secondary color. */
    $scope.swapColors = function() {
        var temp = $scope.config.tools.colors.primary;
        $scope.config.tools.colors.primary = $scope.config.tools.colors.secondary;
        $scope.config.tools.colors.secondary = temp;
        $scope.$broadcast('swapColorsBC', {});
    };
    
    $scope.checkVisible = function() {
        return !mouse.checkActive()
    };

    $scope.isActive = function(name) {
        return tools.getTool() == name;
    };

    $scope.isActiveToolset = function(name) {
        return tools.getTool()set == name;
    };

    /* This function selects a toolset and therefore opens a toolbox. When
     * a toolset is already selected, it becomes unselected. The pan tool will
     * then be used. */
    $scope.selectToolSet = function(name) {
        if (tools.getTool()set == name) {
            tools.getTool()set = null;
            return true;
        }

        tools.getTool()set = name;
    };

    $scope.selectTool = function(event, name) {
        if (event) {
            event.stopPropagation();
        }
        
        tools.getTool() = name;
        return true;
    };

    $scope.getActiveToolFunctions = function() {
        return tools.getTool()Functions;
    }
});
