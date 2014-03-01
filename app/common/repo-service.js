'use strict';

angular.module('myApp').factory('repoService',
  function($rootScope, GithubRepo, RepoMeta, configService, credsService){
    var repos = {};
    repos.downloaded = {};
    repos.selected = {};
    repos.final = {};
    repos.rateLimit = {};

    //side affect function
    //ToDo: Figure out an elegant fix that will
    // get us header information without screwing up chaining
    // This is so ugly it hurts - see parent module for details
    function getRateLimits(updater){
      updater(nul, repos.rateLimit);
    }


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
      return setRepos;
    }

    function addRepoMeta(repos){
      return RepoMeta.insertRepoMeta(repos)
        .then(function(repos){
          console.log('addRepoMeta', repos);
          //$rootScope.$broadcast('REPOS_UPDATE_META_ADDED');
          return repos;
        });
    }

    function slicerFn(start, stop){
      return function(repos){
        return(repos.slice(start, stop+1));
      };
    }

//    function setSelectedRepos(repos){
//      $scope.selectedRepos = repos;
//      //ToDo: this will move to a download specific function
//      repoService.setSelected(repos);
//      console.log('setSelectedRepos wrapping up', repos);
//      return repos;
//    }

    function doneFetching(fetchedRepos){
      repos.final = fetchedRepos;
      $rootScope.$broadcast('REPOS_UPDATE_DONE')
    }

    function defaultFetchLimit(){
      var defaultFetchLimit = configService.fetchLimit.unauth;
      if (credsService.password && credsService.password.length>0){
        defaultFetchLimit = configService.fetchLimit.auth;
      }
      return defaultFetchLimit;
    }

    function repoFetch(apiFetchLimit){

      apiFetchLimit = apiFetchLimit || defaultFetchLimit();


      var initFilters = [
        {sort: configService.repoSort, per_page: apiFetchLimit}
      ];
      //var initFilters = [];

      var baseFilters = [
        slicerFn(0,100)
      ];

      var allFilters = initFilters.concat(baseFilters);
      //var allFilters = cfg.allfilters();

      var initFromRepo = downloadRepos(credsService, allFilters);

      return initFromRepo
        //.then(getRateLimits)
        //.then(setDownloadedRepos)
        .then(setReposSelected)
        .then(addRepoMeta)
        .then(doneFetching)
      ;
    }

    return {
      setSelected: setReposSelected,
      getSelected: function(){ return repos.selected },
      getFinal: function(){ return repos.final },
      downloadRepo: downloadRepos,
      getRateLimits: getRateLimits,
      addRepoMeta: addRepoMeta,
      fetch: repoFetch

    }

  }
);