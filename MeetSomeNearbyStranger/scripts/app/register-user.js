var app = app || {};

(function(a) {
    function getYears(){
        var years = [];
        for (var i = 2013; i >= 1900; i--){
            var value = i.toString();
            years.push({
                name: value,
                value: value
            });
        }
        return years;
    }
    
    var viewModel = kendo.observable({
        years: getYears(),    
        year: "2013",         nickname: "",
        genders: [ { name: "Male", value: "Male" }, { name: "Female", value: "Female" } ],
        gender: "Male",
        errorMessage: "",
        
        // event execute on click of add button
        
        create: function(e) {
            cordovaExt.getLocation().then(function (position) {
                var age = (new Date()).getFullYear() - parseInt(viewModel.get("year"));
                var uuid = device.uuid;
                
                var userData = {
                    phoneID: uuid,
                    age: age,
                    nickname: viewModel.get("nickname"), 
                    gender: viewModel.get("gender"),
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                window.httpRequester.postJSON(app.servicesBaseUrl  + "users/senduserdata", userData).then(function (){
                    // reset the form
                    viewModel.set("year", "2013");
                    viewModel.set("nickname", "");
                    viewModel.set("gender", "Male");
                    
                    var storage = window.localStorage;
                    storage.setItem("isInitializingComplete", "true");
                                        
                    app.application.navigate("views/profile-view.html#profile-view");
                }, function (error) {
                    viewModel.set("errorMessage", error.message);
                    viewModel.set("errorMessage", error.message);
                    navigator.notification.alert(error.message,
                            function () { }, "Registering user failed", 'OK');
                });
            }, function (error){
                viewModel.set("errorMessage", error.message);
                navigator.notification.alert(error.message,
                        function () { }, "Registering user failed", 'OK');
            });
        }
    });
    
    app.registerService = {
        viewModel: viewModel
    }
}(app));