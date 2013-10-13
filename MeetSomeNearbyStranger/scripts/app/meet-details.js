var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        status: "",
        userId: 0,
        nickname: "",
        isReceived: true,
        isToBeAccepted: true,
        
        view: function(){
            app.currentProfileId = viewModel.get("userId");
            app.application.navigate("views/user-details-view.html#user-details-view");
        },
        
        accept: function(){
            window.httpRequester.getJSON(app.servicesBaseUrl + "meets/accept?phoneID=" + device.uuid + "&meetId=" + app.currentMeetId).then(function(data){
                viewModel.set("isReceived", true);
                viewModel.set("isToBeAccepted", false);
                viewModel.set("status", "Accepted");
            }, function(error){
                viewModel.set("errorMessage", error.Message);
            });
        },
        
        decline: function(){
            window.httpRequester.getJSON(app.servicesBaseUrl + "meets/decline?phoneID=" + device.uuid + "&meetId=" + app.currentMeetId).then(function(data){
                viewModel.set("isReceived", true);
                viewModel.set("isToBeAccepted", false);
                viewModel.set("status", "Declined");
            }, function(error){
                viewModel.set("errorMessage", error.Message);
            });
        }
    });
    
    var init = function(){
        window.httpRequester.getJSON(app.servicesBaseUrl + "meets/get?phoneID=" + device.uuid + "&meetId=" + app.currentMeetId).then(function(data){
            viewModel.set("isReceived", data.isReceived);
            
            var status;
            if (data.isReceived){
                if (data.isAccepted){
                    viewModel.set("isToBeAccepted", !data.isAccepted);
                    status = "Accepted";
                }
                if (data.isDeclined){
                    viewModel.set("isToBeAccepted", !data.isAccepted);
                    status = "Declined";
                }
            } else {
                if (data.isAccepted){
                    status = "Accepted";
                }
                else if (data.isDeclined){
                    status = "Declined";
                }
                else {
                    status = "Awaiting response"
                }
                viewModel.set("isToBeAccepted", false);
            }
            
            viewModel.set("nickname", data.nickname);
            viewModel.set("userId", data.otherUserId);
            viewModel.set("status", status);
        }, function(error){
            viewModel.set("errorMessage", error.Message);
        });
    }
    
    app.meetDetailsService = {
        viewModel: viewModel,
        init: init
    }
}(app));