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
        
        year: 2013, 
     
        // the values are bound to the merchant and amount fields
        nickname: null,
        gender: [ { name: "Male", value: "Male" }, { name: "Female", value: "Female" } ],
        
        // event execute on click of add button
        create: function(e) {
            cordovaExt.getLocation().then(function (position) {
                var userData = { 
                    phoneID: device.uuid,
                    age: new Date().getFullYear() - parseInt(this.get("year")), 
                    nickname: this.get("nickname"), 
                    gender: this.get("gender"),
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                httpRequest.postJSON(app.servicesBaseUrl  + "users/senduserdata", userData)
            }, function (error){
                
            });
            
            // add the items to the array of expenses
            
            
            // reset the form
            this.set("expenseType", "food");
            this.set("merchant", "");
            this.set("amount", "");
        }
    });
}(app));