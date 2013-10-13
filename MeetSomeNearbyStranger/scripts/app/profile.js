(function(){
    var viewModel = kendo.observable({        
        nickname: "",
        age: "",
        gender: "",
        meets: 0,
        interests: [],
        newNickname: "",
        newInterest: "",
        errorMessage: "",
        isOpenForEditing: false,
        imageUrl: "styles/images/person-clip-art-2.png",
        
        changeNickname: function(e) {
            window.httpRequester.putJSON(app.servicesBaseUrl + "users/updateprofile?phoneID=" + device.uuid, viewModel.get("newNickname")).then(function(data){
                viewModel.set("nickname", data);
                viewModel.set("newNickname", "");
            }, function(error){
                viewModel.set("errorMessage", error.Message);
            })
            viewModel.set("isOpenForEditing", false);
        },
        
        editNickname: function(e){
            viewModel.set("isOpenForEditing", true);
        },
        
        addInterest: function(e){
            var currentInterest = viewModel.get("newInterest");
            window.httpRequester.putJSON(app.servicesBaseUrl + "users/addinterest?phoneID=" + device.uuid, currentInterest).then(function(){
                viewModel.get("interests").push({ Interest: currentInterest });
                viewModel.set("newInterest", "");
            }, function (error){
                viewModel.set("errorMessage", error.Message);
            });
        },
        
        useExistingPhoto: function(e) {
            viewModel.capture(Camera.PictureSourceType.SAVEDPHOTOALBUM);
        },

        takePhoto: function(e) {
            viewModel.capture(Camera.PictureSourceType.CAMERA);
        },
        
        capture: function(sourceType) {
            navigator.camera.getPicture(viewModel.onCaptureSuccess, viewModel.onCaptureFail, {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: sourceType,
                correctOrientation: true
            });
        },

        onCaptureSuccess: function(imageURI) {
            var ft, options;
            
            options = new FileUploadOptions();
            options.fileKey = "my_image";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            ft = new FileTransfer();
            ft.upload(imageURI, app.servicesBaseUrl + "users/uploadimage?phoneID=" + device.uuid, viewModel.success, viewModel.fail, options);
        },

        onCaptureFail: function(message) {
            alert("Failed because: " + message);
        },
        
        success: function(response) {
            alert("Your photo has been uploaded!");
        },
              
        fail: function(error) {
            alert("An error has occurred: Code = " + error.code);
        }
    });
    
    var init = function () {
        window.httpRequester.getJSON(app.servicesBaseUrl + "users/getmyprofile?phoneID=" + device.uuid).then(function(data){
            var interests = viewModel.get("interests");
            interests.splice(0, interests.length);
            
            viewModel.set("nickname", data.nickname);
            viewModel.set("age", data.age);
            viewModel.set("gender", data.gender);
            viewModel.set("meets", data.meets);
            if (data.profileImage){
                viewModel.set("imageUrl", data.profileImage);
            }
            for (var i = 0; i < data.interests.length; i++){
                viewModel.get("interests").push({ Interest: data.interests[i].Key });
            }
        }, function(error){
            viewModel.set("errorMessage", error.Message);
        });
    }
    
    app.profileService = {
        viewModel: viewModel,
        init: init,
    }
}(app));