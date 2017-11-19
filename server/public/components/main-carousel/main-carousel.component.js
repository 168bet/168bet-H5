(function() {
    'use strict';

    angular
        .module('app')
        .component('mainCarousel', {
            templateUrl: "components/main-carousel/main-carousel.template.html",
            controller: [ '$routeParams',
                function MainCarouselController($routeParams) {

                }
            ]
        });
}());