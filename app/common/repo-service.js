'use strict';

angular.module('myApp').factory('repoService',

  function(
    $rootScope,
    GithubRepo,
    RepoMeta,
    configService,
    credsService
  ){

    var repos = {};
    repos.downloaded = {};
    repos.selected = {};
    repos.inView = {};
    repos.final = {};
    repos.rateLimit = {};
    repos.actionReady = [];

    var INITIAL_DOWNLOAD_MSG = 'REPOSERVICE_INITIAL_DOWNLOAD';

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

      return GithubRepo.fetcher(creds, filters)
        .then(function(downloadedRepos){
          repos.downloaded = downloadedRepos;
          console.log('repos downloaded', repos.downloaded);
          $rootScope.$broadcast(INITIAL_DOWNLOAD_MSG);
          return downloadedRepos;
        });
    }

    function downloadMeta(rateLimitCallback){
      return RepoMeta.insertRepoMeta(repos)
    }

    //We broadcast the event because
    // a) $watch(ing) for changing in repos would spin on intermediate
    //     changes that are not intended for the UI
    // b) The updates propagate to services, where $watch can't be used
    //    or at least it feels ugly.
    function setReposSelected(setRepos){
      repos.selected = setRepos;
      $rootScope.$broadcast('REPOS_UPDATE_SELECTED');
      return setRepos;
    }

    function addRepoMeta(repos){
      if(!repos.length) { return repos }
      return RepoMeta.insertRepoMeta(repos)
        .then(function(repos){
          console.log('addRepoMeta', repos);
          //$rootScope.$broadcast('REPOS_UPDATE_META_ADDED');
          return repos;
        });
    }

    function slicerFn(start, stop){
      return function(repos){
        if(!repos || !repos.length){
          return [];
        }
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

    //ToDo: Allow user to override in subsequent fetches
    function setFetchMeta(){
      if (credsService.password && credsService.password.length>0){
        configService.do.fetchMeta = true;
      } else {
        configService.do.fetchMeta = false;
      }
    }

    function repoFetch(apiFetchLimit){

      apiFetchLimit = apiFetchLimit || defaultFetchLimit();

      var configSort = configService.sort || {};

      var initFilters = [
        {
          sort: configSort.fetch || '',
          direction: configSort.initDirection || '',
          per_page: apiFetchLimit || ''}
      ];
      //var initFilters = [];

      var baseFilters = [
        slicerFn(0,100),
        setReposSelected
        //addRepoMeta

      ];

      // setting fetchMeta flag in shared service
      setFetchMeta();

      //using fetchMeta flag from shared service
      var canGetMeta = configService.do && configService.do.fetchMeta;
      if(canGetMeta){
        baseFilters.push(addRepoMeta);
      }


      var allFilters = initFilters.concat(baseFilters);
      //var allFilters = cfg.allfilters();

      var initFromRepo = downloadRepos(credsService, allFilters);

      return initFromRepo
        //.then(getRateLimits)
        //.then(setDownloadedRepos)
        //.then(setReposSelected)
        //.then(addRepoMeta)
        .then(doneFetching)
      ;
    }

    return {
      INITIAL_DOWNLOAD_MSG: INITIAL_DOWNLOAD_MSG,
      setSelected: setReposSelected,
      getSelected: function(){ return repos.selected },
      getDownloaded: function(){ return repos.downloaded },
      getFinal: function(){ return repos.final },
      downloadRepo: downloadRepos,
      getRateLimits: getRateLimits,
      addRepoMeta: addRepoMeta,
      fetch: repoFetch,
      actionReady: repos.actionReady
    }

  }
);