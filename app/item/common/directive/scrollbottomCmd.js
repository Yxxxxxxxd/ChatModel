/**
 * Created by NM-029 on 10/24/2016.
 */
commonModule.directive('schrollBottom', ['$timeout', function ($timeout) {
    return {
        scope: {
            schrollBottom: "=", isEnableScroll:'='
        },
        restrict: "A",
        link: function (scope, $element) {
            var isEnScroll = true;
            scope.$watchCollection('schrollBottom', function (newValue) {
                if (newValue && isEnScroll) {
                    $timeout(function(){
                        $element[0].scrollTop = $element[0].scrollHeight;
                    });
                }
            });

            scope.$watch('isEnableScroll', function (newValue) {
                isEnScroll = newValue;
            });

            $element.on('mouseenter', function(event) {
                angular.element($element).removeClass('hrScrollbar2').addClass('hrScrollbar1');
            });
            $element.on('mouseleave', function(event) {
                angular.element($element).removeClass('hrScrollbar1').addClass('hrScrollbar2');
            });
        }
    }
}]);
