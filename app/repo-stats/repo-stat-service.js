'use strict';

angular.module('myApp').factory('repoStatService',
  function($rootScope, $timeout, credsService, repoService){
    var stats = {};
    stats.rateLimit = {};
    stats.repos = {};
    stats.repos.total = {};

    $rootScope.$on('REPOS_UPDATE_SELECTED', function(){
      var creds = credsService;
      //delay to let things sort out
      $timeout(
        function(){
          repoService.getRateLimits(creds)
            .then(function(resp){
              var rateResp = resp && resp.rate
              var remaining = rateResp && rateResp.remaining;
              var reset = rateResp && rateResp.reset;
              stats.rateLimit = stats.rateLimit || {};
              stats.rateLimit.remaining = remaining;
              stats.rateLimit.resetTime = reset;

            })
        }, 1000);
    });

    $rootScope.$on('REPOS_UPDATE_DOWNLOADED', function(){
      stats.repos.total.downloaded =  repoService.getDownloaded().length;
      console.log('stat repos total', stats.repos.total);
    });




    return {
      stats: stats,
      get: function(key){ return stats[key]; }
      //set: function(key, val){ stats[key] = val}
    };
  }
);