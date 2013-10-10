var app = app || {};

(function () {
    document.addEventListener("deviceready", function () {
        
        app.application = new kendo.mobile.Application(document.body);
        app.servicesBaseUrl = "http://localhost:63716/api/";
        
        var storage = window.localStorage;
        storage.clear();
        var isInitializingComplete = storage.getItem("isInitializingComplete");
        if (isInitializingComplete){
            $("#register-user-view").css("display", "none");
            $("#after-initial-view").css("display", "block");
        }
        else
        {
            
        }
    }, false)
}());