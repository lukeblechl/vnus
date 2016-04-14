// Not going to worry about polluting global scope for now as entire script is contained in this file

// TODO: Change this hard-coded font size mapping for the 'Source Code Pro' font to be calculated instead to allow for portablility to other mono-spaced font families
var fontSizesByCharWidth = [undefined, 2, 3, 4, 6, 8, 10, 11, 13, 15, 16, 18, 20, 22, 23, 25, 27, 29, 30, 32, 34, 35, 37, 39, 40, 42, 44, 45, 47, 49, 50, 52, 54, 55, 57, 59, 60, 62, 64, 65, 67, 69, 70, 72, 74, 75, 77, 79, 80, 82, 84, 85, 87, 89, 90, 92, 94, 95, 97, 99, 100, 102, 104, 105, 107, 109, 110, 112, 114, 115, 117, 119, 120];
var minFontSizePx = 1;
var maxFontPx = 120;

/**
 * Used to determine the closest mapped font size for our mono-spaced font. Larger sizes take precedence.
 * @param  {number} size Font size to map to
 * @return {number}      The largest font size possible for the amount of characters typed in the input box
 */
var getClosestFontSize = function( size ){
	size = ( size > minFontSizePx ) ? size : minFontSizePx;
	size = ( size < maxFontPx )     ? size : maxFontPx;

	if ( size > ( fontSizesByCharWidth.length - 1 ) ) {
		return maxFontPx;
	} else {
		for( var i = size; i >= minFontSizePx; i-- ) {
			if( typeof fontSizesByCharWidth[i] !== 'undefined' ) {
				return fontSizesByCharWidth[i];
			}
		}
	}
}

angular.module( 'vnusApp', [] )
.controller( 'vnusCtrl', ['$scope', '$window', function( $scope, $window ) {
	$scope.sChars = 0;

  /**
   * Shrinks or expands input text font size to be the largest possible size while fitting entire text in input
   * @param  {number} sChars Length of characters currently entered in the "#s" input field
   */
	$scope.sChange = function( sChars ) {

    // If the current text box character count is 0, then grab the placeholder length
    sChars = ( sChars > 0 ) ? sChars : document.getElementById("s").placeholder.length;

	  $scope.sChars      = sChars;
    var maxFontPxWidth = $scope.windowWidthNum / $scope.sChars;
    maxFontPxWidth     = ( maxFontPxWidth <= maxFontPx ) ? maxFontPxWidth : maxFontPx;
    maxFontPxWidth     = Math.floor( maxFontPxWidth );
    var newFontSize    = ( typeof fontSizesByCharWidth[newFontSize] !== 'undefined' ) ? fontSizesByCharWidth[newFontSize] : getClosestFontSize( maxFontPxWidth );
    $scope.sFontSize   = newFontSize + 'px';

	}

  // Initialize the text size according to the string in the placeholder value on page load
  var placeholderText = document.getElementById("s").placeholder.length;
  $scope.sChange( placeholderText );

}])
.directive( 'resizable', function( $window ) {

  return function( $scope ) {

    $scope.initializeWindowSize = function() {

      // Factor in scrollbar width plus a little extra "padding" to appease all browsers
      var scrollbarWidth = 50;
    
      $scope.windowWidthNum = ( $window.innerWidth - scrollbarWidth );
      $scope.sChange( $scope.sChars );

      return $scope.windowWidth = ( $window.innerWidth - scrollbarWidth ) + 'px';
    };

    $scope.initializeWindowSize();

    return angular.element( $window ).bind( 'resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
    });
  }

});