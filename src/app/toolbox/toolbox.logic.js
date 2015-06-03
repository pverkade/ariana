angular.module('ariana').controller('toolboxCtrl', function($scope) {
    
    $scope.leftColor  = "#ffaa00";
    $scope.rightColor = "#88cc44";
    updateColorPreview();
    
    /* make tools. */
    var toolset = document.getElementById('toolset');   
    tools = toolset.children;
    
    /* For every tool in the toolset, get the inner HTML and use it as filename
    for the icon. Load the icon using a new Request. */
    for (var i = 0; i < tools.length; i++) {
        tool = tools[i];
        icon = tool.innerHTML.trim();
        tool.innerHTML = "";
        filename = "assets/vectors/" + icon;
        
        var request = new XMLHttpRequest();
        request.open('GET', filename, true);
        request.icon_i = i;
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                parser = new DOMParser();
                svg = parser.parseFromString(this.response,"text/xml").getElementsByTagName("svg")[0];
                tools[this.icon_i].appendChild(svg);
            }
        };
        request.onerror = function() {
            // ...
        };
        request.send();    
    }
    
    var subtoolsets = document.getElementById('sub-toolsets').children;   
    var n = [];
    
    /* Add onClick handlers for each category-button. */
    for (var i = 0; i < tools.length; i++) {
    
        /* Add variables to button. */
        tools[i].toolNumber = i;
        tools[i].toolEnabled = false;
        
        tools[i].onclick = function (){
            if (this.toolEnabled) {
                this.toolEnabled = false;
                hideSubToolsets();
            }
            else {
                this.toolEnabled = true;
                showSubToolset(this.toolNumber);
            }
        };
    }    
    
    for (var i = 0; i < subtoolsets.length; i++) {
        var subtoolset = subtoolsets[i].children;
        n.push(subtoolset);
    }
    
    /* For every subtool, load the svg to show as icon. */
    for (var i = 0; i < n.length; i++) {
        for (var j = 0; j < n[i].length; j++){
        
            tool = n[i][j];
            
            icon = tool.innerHTML.trim();
            tool.innerHTML = "";
            filename = "assets/vectors/" + icon;
            
            var request = new XMLHttpRequest();
            request.open('GET', filename, true);
            request.icon_i = i;
            request.icon_j = j;
            request.onload = function() {
                if (this.status >= 200 && this.status < 400) {
                    parser = new DOMParser();
                    svg = parser.parseFromString(this.response,"text/xml").getElementsByTagName("svg")[0];
                    n[this.icon_i][this.icon_j].appendChild(svg);
                }
            };
            request.onerror = function() {
                //
            };
            request.send();
        }
    }
    
    document.getElementById('color-preview').onclick = switchColors();
    
    function switchColors(){
        console.log("switch");
        var t = $scope.leftColor;
        $scope.leftColor = $scope.rightColor;
        $scope.rightColor = t;
        updateColorPreview();
        console.log("done");
    }
    
    function setLeftColor(color){
        $scope.leftColor = color;
        updateColorPreview();
    }

    function setRightColor(color){
        $scope.rightColor = color;
        updateColorPreview(); 
    }

    function updateColorPreview(leftColor, rightColor){
        document.getElementById('color-left').style.background  = $scope.leftColor; 
        document.getElementById('color-right').style.background = $scope.rightColor; 
    }   
    
   /* This function shows a certain toolblock. */
    function showSubToolset(setnumber) {

        /* Set all other category-selection tools as disabled. */
        var toolset = document.getElementById('toolset').children; 
        for (var i = 0; i < toolset.length; i++) {
            if (i == setnumber) toolset[i].toolEnabled = true;
            else toolset[i].toolEnabled = false;
        } 
        
        /* Move the desired toolblock in view. Move all tool blocks to their 
         * original position. */
        var subtoolsets = document.getElementById('sub-toolsets').children;  
        for (var i = 0; i < subtoolsets.length; i++) {
            if (i == setnumber) subtoolsets[i].style.transform = "translate(144px, 0px)";
            else subtoolsets[i].style.transform = "translate(-144px, 0px)";
        }
        
        return;
    }

    /* This function hides all toolsets. */
    function hideSubToolsets(){

        /* Set all category-selection tools as disabled. */
        var toolset = document.getElementById('toolset').children; 
        for (var i = 0; i < toolset.length; i++) {
            toolset[i].toolEnabled = false;
        } 

        /* Move all tool blocks to their original position. */
        var subtoolsets = document.getElementById('sub-toolsets').children;  
        for (var i = 0; i < subtoolsets.length; i++) {
            subtoolsets[i].style.transform = "translate(-144px, 0px)";
        }
        
        return;
    }
}   
    
    
    
    
    
angular.module('ariana').directive('color-preview', ['$document', function($document) {
return {
    link: function(scope, element, attr) {
      var startX = 0, startY = 0, x = 0, y = 0;

      element.css({
            /*
           position:        'relative',
           border:          '1px solid red',
           backgroundColor: 'lightgrey',
           cursor:          'pointer'
            */
      });

      element.on('mousedown', function(event) {t
            /*event.preventDefault();
            startX = event.pageX - x;
            startY = event.pageY - y;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
            */
            switchColors();
      });

      function mousemove(event) {
            y = event.pageY - startY;
            x = event.pageX - startX;
            element.css({
              top: y + 'px',
              left:  x + 'px'
            });
      }

      function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);
      }
    }
  };
}]);



