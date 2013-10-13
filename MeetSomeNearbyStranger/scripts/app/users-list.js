var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        users: [],
        errorMessage: "",
        noPeopleFound: false,
        
        listViewItemClick: function(e){
            app.currentProfileId = e.dataItem.Id;
            app.application.navigate("views/user-details-view.html#user-details-view");   
        }
    });
    
    var init = function(){
        window.httpRequester.getJSON(app.servicesBaseUrl + "users/getusersmediumview?phoneID=" + device.uuid).then(function(data){
            var users = viewModel.get("users");
            users.splice(0, users.length);
            
            for (var i = 0; i < data.length; i++){
                var img = "styles/images/person-clip-art-2.png";
                if (data[i].profileImage){
                    img = data[i].profileImage;   
                }
                viewModel.get("users").push({ 
                    Id: data[i].id,
                    ProfileImage: img,
                    Nickname: data[i].nickname,
                    Gender: data[i].gender,
                    Age: data[i].age,
                    Meets: data[i].meets
                });
            }
            
            if (data.length == 0){
                viewModel.set("noPeopleFound", true);
            }
        }, function(error){
            viewModel.set("errorMessage", error.Message);
        });
    }
    
    app.listService = {
        viewModel: viewModel,
        init: init
    }
}(app));