'use strict';

angular.module('myApp').controller('TotalReposCtrl', function($scope, repoStatService, $timeout, repoService, credsService){

  var stats = repoStatService.stats;
  $scope.total = stats.repos.total || {};

  //we use totals.repos as is, so no need to apply watch function

  //we want to alter the reset time so its more human friendly
  //so we create a watch function on rateLimit.resetTime
//  $scope.$watch('rateLimit.resetTime', function(newResetTime) {
//    if(!newResetTime){ return $scope.resetTime = null; }
//    $scope.resetTime = moment.unix( parseInt(newResetTime)).fromNow();
//  }, false);

})