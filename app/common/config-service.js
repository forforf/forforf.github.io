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
      var name = Object.keys(obj).map(function(k){ return k.toString(); })
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

    cfg.defaultRepoSrot = 'updated';

    cfg.defaultFetchLimit = 100;

    return cfg;
  }
);