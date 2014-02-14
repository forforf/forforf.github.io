'use strict';

angular.module('AngularEtag', [])

// ehttp wraps $http get function and caches etag responses to localStorage
.factory('ehttp', function($http, $window, $q){
  var STORAGE_PREFIX = 'eTagKey-';

  // wrapper for localStorage
  var storage = {};
  storage.save = function(key, obj){
    var val = JSON.stringify(obj);
    $window.localStorage.setItem(key, val);
  };
  storage.get = function(key){
    var val = $window.localStorage.getItem(key);
    return JSON.parse(val);
  };

  //generates key to use for localStorage
  function eTagKey(url){
    if(!url){ return null; }
    return STORAGE_PREFIX+url;
  }

  //creates the object to be cached in localStorage
  function makeCacheObj(etag, opts, response){
    return {
      etag: etag,
      opts: opts,
      response: response
    };
  }

  //caches the etag to local storage. Won't cache unless url exists in opts
  function cacheEtag(etag, opts, resp){
    if(opts && opts.url){
      if(resp){
        var cacheResponse = {};
        angular.extend(cacheResponse, resp);
        cacheResponse.status = 203;

        storage.save(eTagKey(opts.url), makeCacheObj(etag, opts, cacheResponse) );
      }
    }
  }

  //Wrapper for $http get
  function ehttpGet(urlOpts){

    // Handlers for the server response
    var respFn = {}

    // cache the Etag prior to returning the reponse
    respFn.cacheEtag = function(resp){
      var etag = resp.headers().etag;
      if(etag){ cacheEtag(etag, urlOpts, resp); }
      return resp;
    };

    //304's are treated as exceptions in angular, so
    //catch it, reject to bubble up the error if not 304
    respFn.catchUnmodified =  function(resp){
      if(resp.status === 304){
        cacheObj.response.headers = function(){
          return {"X-Local-Cache": "Nothing sent to server"};
        };
        return cacheObj.response;

      } else {
        return $q.reject(resp);
      }
    };

    var url = urlOpts.url;

    var cacheObj = storage.get(eTagKey(url));

    if(cacheObj && cacheObj.etag){
      urlOpts.headers = urlOpts.headers || {};
      angular.extend( urlOpts.headers, {'If-None-Match': cacheObj.etag} );
    }

    angular.extend(urlOpts, {method: 'GET'});

    //$http decorated with etag goodness
    return $http(urlOpts)
      .then(respFn.cacheEtag)
      .catch(respFn.catchUnmodified);
  }


  return {
    get: ehttpGet
  };
});