'use strict';

angular.module('myApp').controller('ApiRateLimitCtrl', function($scope, repoStatService, $timeout, repoService, credsService){

  var stats = repoStatService.stats;
  $scope.rateLimit = stats.rateLimit || {};

  //we use rateLimit.remaining as is, so no need to apply watch function

  //we want to alter the reset time so its more human friendly
  //so we create a watch function on rateLimit.resetTime
  $scope.$watch('rateLimit.resetTime', function(newResetTime) {
    if(!newResetTime){ return $scope.resetTime = null; }
    $scope.resetTime = moment.unix( parseInt(newResetTime)).fromNow();
  }, false);

});