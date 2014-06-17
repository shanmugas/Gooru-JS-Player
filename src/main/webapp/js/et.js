(function() {
   window.onbeforeunload = function() {
      var log = [];
      for (var dataIndex  = 0; dataIndex < _et.data; dataIndex++) { 
        log.push(_et.data[dataIndex]);
      }
      el.pushData(log, true);
  };
  if(typeof(_et.endPoint) == 'undefined' ||  _et.endPoint == '') {
      _et.endPoint =  "qa-logapi.goorulearning.org";
  }
     var apiEndpoint = ('https:' == document.location.protocol ? 'https://' : 'http://') + _et.endPoint +"/api/log";                                                       
                                                                                                                                                                       
  var el = {                                                                                                                                                            
    pushLogTimeInterval: 2000,                                                                                                                                          
    
    authenticate: function() {   
      var request = el.request();
      request.open('POST',apiEndpoint + "/event/authenticate?apiKey=" + _et.apiKey , true);
      request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      request.onreadystatechange=function() {
        if(request.readyState == 4) {
          var responseType = request.getAllResponseHeaders();
            if(responseType.indexOf("application/json") != -1) {
                var json = eval("(" + request.responseText + ")");
                if (request.status == 403) { 
                } else { 
                  self.setInterval(function(){el.triggerCall()},el.pushLogTimeInterval);
                }
            }
        }
      }    
     request.send(); 
    },
 
    triggerCall: function() {
      if (_et.data.length >= 0) {
        var log = [];
        var count = 0;
        for (var dataIndex  = 0; dataIndex < _et.data.length; dataIndex++) { 
          log.push(_et.data[dataIndex]);
        }
        _et.data.splice(0, _et.data.length);
        el.pushData(log, true);
      }
    },
    pushData: function(log, async) { 
       if (log.length > 0) {
          var request = el.request();
          request.open('POST',apiEndpoint + "/event?apiKey=" + _et.apiKey ,async);
          request.setRequestHeader("Content-type","application/json");
          request.onreadystatechange=function() {
            if(request.readyState == 4) {
              var responseType = request.getAllResponseHeaders();
                if(responseType.indexOf("application/json") != -1) {
                  var json = eval("(" + request.responseText + ")");
                }
            }
          }
          request.send("[" + log.toString() + "]");
        }     
    },
 
    request : function() { 
      var request;
      if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        request=new XMLHttpRequest();
      }
      else {// code for IE6, IE5
        request=new ActiveXObject("Microsoft.XMLHTTP");
      }
      return request;
    }
  };
  el.authenticate();
})();

