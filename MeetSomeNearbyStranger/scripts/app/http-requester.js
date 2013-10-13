window.httpRequester = (function(){
    function getJSON(url){
        var promise = new RSVP.Promise(function(resolve, reject){
            $.ajax({
                url: url,
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                timeout: 10000,
                success: function(data){
                    resolve(data);
                },
                error: function(err){
                    reject(err);
                }
            });
        });
        return promise;
    }
    
    function postJSON(url, requestData){
        var promise = new RSVP.Promise(function(resolve, reject){
           $.ajax({
               url: url,
               type: "POST",
               dataType: "json",
               data: JSON.stringify(requestData),
               contentType: "application/json",
               timeout: 10000,
               success: function(data){
                   resolve(data);
               },
               error: function(err){
                   reject(err);
               }
           });
        });
        return promise;
    }
    
    function putJSON(url, requestData){
        var promise = new RSVP.Promise(function(resolve, reject){
           $.ajax({
               url: url,
               type: "PUT",
               dataType: "json",
               data: JSON.stringify(requestData),
               contentType: "application/json",
               timeout: 5000,
               success: function(data){
                   resolve(data);
               },
               error: function(err){
                   reject(err);
               }
           });
        });
        return promise;
    }
    
    return {
        getJSON: getJSON,
        postJSON: postJSON,
        putJSON: putJSON
    };    
}());