/*
 * Project Ariana
 * toolbox.logic.js
 *
 * This file contains the ToolboxCtrl, which controls the behaviour of
 * the toolbox and the color preview. 
 *
 */

app.controller('ToolboxCtrl', ['$scope', 'canvas', 'colors', 'tools', 'mouse', 
    function($scope, canvas, colors, tools, mouse) {
        
        $scope.getTool = function() {
            return tools.getTool();
        }

        $scope.getPrimary = function() {
            return colors.getPrimary();
        }

        $scope.getSecondary = function() {
            return colors.getSecondary();
        }

        $scope.setCursor = function(cursor) {
            canvas.setCursor(cursor);
        };

        $scope.getCursor = function() {
            return canvas.getCursor();
        };

        /* This function swaps the primary and secondary color. */
        $scope.swapColors = function() {
            colors.setPrimaryRgb(colors.getSecondary());
            colors.setSecondaryRgb(colors.getPrimary());
            $scope.$broadcast('swapColorsBC', {});
        };
        
        $scope.checkVisible = function() {
            return !mouse.checkActive();
        };

        $scope.isActive = function(name) {
            return tools.getTool() == name;
        };

        $scope.isActiveToolset = function(name) {
            return tools.getToolset() == name;
        };

        /* This function selects a toolset and therefore opens a toolbox. When
         * a toolset is already selected, it becomes unselected. The pan tool will
         * then be used. */
        $scope.selectToolSet = function(name) {
            if (tools.getToolset() == name) {
                tools.getToolset() = null;
                return true;
            }

            tools.setToolset(name);
        };

        $scope.selectTool = function(event, name) {
            if (event) {
                event.stopPropagation();
            }
            
            tools.setTool(name);
            return true;
        };

        $scope.getActiveToolFunctions = function() {
            return tools.getToolFunctions;
        };
    }
]);
