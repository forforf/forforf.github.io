'use strict';

angular.module('myApp').controller('ApiRateLimitCtrl', function($scope, $timeout, repoService, credsService){
  $scope.rateLimit = {};

  //ToDo: move to own component
  $scope.$on('REPOS_UPDATE_SELECTED', function(){
    var creds = credsService;
    //delay to let things sort out
    $timeout(
      function(){
        repoService.getRateLimits(creds)
          .then(function(resp){
            var rateResp = resp && resp.rate
            var remaining = rateResp && rateResp.remaining;
            var reset = rateResp && rateResp.reset;
            $scope.rateLimit.remaining = remaining;
            $scope.rateLimit.resetTime = reset && moment.unix( parseInt(reset)).fromNow();
          })
      }, 1000);
  });
});