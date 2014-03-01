'use strict';

angular.module('myApp').factory('RepoService',
  function($rootScope, GithubRepo, RepoMeta){
    var repos = {};
    repos.downloaded = {};
    repos.selected = {};
    repos.rateLimit = {};

    //side affect function
    //ToDo: Figure out an elegant fix that will
    // get us header information without screwing up chaining
    // This is so ugly it hurts - see parent module for details
    function getRateLimits(updater){
      updater(nul, repos.rateLimit);
    }

//    function setRateLimits(creds, rateLimitCallback){
//      return function(repoObjs){
//        // Stinky - see parent module for details
//        var headers = GithubRepo.headers();
//        GithubRepo.rateLimits(creds).then(function(resp){
//          console.log('rate limit gh', resp);
//          return resp;
//        });
//        repos.rateLimit.fromCache = headers['X-Local-Cache'];
//
//        var remaining = headers['x-ratelimit-remaining'];
//        var reset = headers['x-ratelimit-reset'];
//        repos.rateLimit.remaining = remaining && parseInt(remaining);
//        repos.rateLimit.resetTime = reset && moment.unix( parseInt(reset)).fromNow();
//
//        if (rateLimitCallback) { rateLimitCallback(repos.rateLimit); }
//
//        return repoObjs;
//      }
//
//    }

    function getRateLimits(creds){
      return GithubRepo.rateLimits(creds);
    }

    function downloadRepos(creds, filters, rateLimitCallback){
      return GithubRepo.fetcher(creds, filters);
       // .then(setRateLimits(creds, rateLimitCallback));
    }

    function downloadMeta(rateLimitCallback){
      return RepoMeta.insertRepoMeta(repos)
    }

    function setReposSelected(setRepos){
      repos.selected = setRepos;
      $rootScope.$broadcast('REPOS_UPDATE_SELECTED');
    }

    function addRepoMeta(repos){
      return RepoMeta.insertRepoMeta(repos)
        .then(function(repos){
          //$rootScope.$broadcast('REPOS_UPDATE_META_ADDED');
          return repos;
        });
    }

    return {
      setSelected: setReposSelected,
      getSelected: function(){ return repos.selected },
      downloadRepo: downloadRepos,
      getRateLimits: getRateLimits,
      addRepoMeta: addRepoMeta

    }

  }
);