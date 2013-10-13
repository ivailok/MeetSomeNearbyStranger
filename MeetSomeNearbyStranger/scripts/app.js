var app = app || {};

(function () {
    document.addEventListener("deviceready", function () {
        
        app.application = new kendo.mobile.Application(document.body);
        var localUrl = "http://localhost:63716/api/";
        var remoteUrl = "http://meetsomenearbystranger.apphb.com/api/";
        app.servicesBaseUrl = remoteUrl;
        
        var storage = window.localStorage;
        //storage.clear();
        var isInitializingComplete = storage.getItem("isInitializingComplete");
        if (isInitializingComplete){
            app.application.navigate("views/profile-view.html#profile-view");
        }
    }, false)
}());