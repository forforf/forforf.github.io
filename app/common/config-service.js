'use strict';

angular.module('myApp').factory('configService',
  function(){

    function getChildNames(obj){
      if (!obj) {
        return [];
      }

      if (!Object.keys(obj).length ) {
        return [];
      }
      var name = Object.keys(obj).map(function(k){ return k.toString(); });
      return name;
    }


    //ToDo: Get config from a ng-model
    var cfg = {};

    cfg.panelDescriptionLength = 40;
    cfg.progressClass = function(repo){
      var name = repo._ff_meta_ && repo._ff_meta_.progress;
      if (name) {
        return getChildNames(name)[0].replace(/\s/g, "-");
      }
      return name || "";
    };

    //sorting
    cfg.sort = {};

    //options provided by Github API
    cfg.sort.fetchOptions = ['updated', 'pushed', 'full_name'];
    cfg.sort.fetch = 'updated';
    cfg.sort.initDirectionOptions = ['asc', 'desc'];
    cfg.sort.initDirection = 'desc';

    cfg.sort.basicOptions = [
      { label: 'created', repoKey: 'created_at' },
      { label: 'full name', repoKey: 'full_name' },
      { label: 'is a fork', repoKey: 'fork' },
      { label: 'name', repoKey: 'name' },
      { label: 'num times forked', repoKey: 'forks_count' },
      { label: 'open issues', repoKey: 'pen_issues_count' },
      { label: 'size', repoKey: 'size' },
      { label: 'stars', repoKey: 'stargazers_count' },
      { label: 'wathcers', repoKey: 'watchers_count' }
    ];

    cfg.sort.basic = {};

    // Future: Metadata sort is dynamically created, not configured
    // and is added to the basic Options
    cfg.sort.metaProgressOptions  = [
      { label: 'stable (meta)', repoKey: 'stable' },
      { label: 'in development (meta)', repoKey: 'in-development' },
      { label: 'inactive (meta)', repoKey: 'inactive' }
    ];
    cfg.sort.metaProgress = {};


    cfg.fetchLimit = {};
    cfg.fetchLimit.unauth = 50;
    cfg.fetchLimit.auth = 100;



    cfg.fetchMeta = {};
    cfg.fetchMeta.unauth = false;
    cfg.fetchMeta.auth = true;

    cfg.viewPort = {};
    cfg.viewPort.limit = 8;

    cfg.do = {};

    cfg.do.fetchMeta = false; //default

    cfg.select = {};
    cfg.select.all = false; //default




    return cfg;
  }
);