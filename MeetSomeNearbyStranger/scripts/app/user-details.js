var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        nickname: "",
        age: "",
        gender: "",
        meets: 0,
        interests: [],
        profileImageUrl: "styles/images/person-clip-art-2.png",
        errorMessage: "",
        meetRequestSend: false,
        status: "",
        
        meet: function(e){
            window.httpRequester.postJSON(app.servicesBaseUrl + "meets/arrange?phoneID=" + device.uuid + "&profileId=" + app.currentProfileId, {}).then(function(){
                viewModel.set("meetRequestSend", true);
                viewModel.set("status", "Meet request send");
            }, function(error){
                viewModel.set("errorMessage", error.Message);
            });
        }
    });
    
    var init = function(){
        window.httpRequester.getJSON(app.servicesBaseUrl + "users/getprofile?phoneID=" + device.uuid + "&profileId=" + app.currentProfileId).then(function(data){
            var interests = viewModel.get("interests");
            interests.splice(0, interests.length);
            
            if (data.status){
                viewModel.set("status", data.status);
                viewModel.set("meetRequestSend", true);
            }
            else{
                viewModel.set("status", "");
                viewModel.set("meetRequestSend", false);
            }
            
            viewModel.set("nickname", data.nickname);
            viewModel.set("age", data.age);
            viewModel.set("gender", data.gender);
            viewModel.set("meets", data.meets);
            if (data.profileImage){
                viewModel.set("profileImageUrl", data.profileImage);
            }
            for (var i = 0; i < data.interests.length; i++){
                viewModel.get("interests").push({ Interest: data.interests[i].Key });
            }
        }, function(error){
            viewModel.set("errorMessage", error.Message);
        });
    }
    
    app.detailsService = {
        viewModel: viewModel,
        init: init
    }
}(app));