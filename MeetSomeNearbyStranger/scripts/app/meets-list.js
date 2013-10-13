var app = app || {};

(function(a) {
    var viewModel = kendo.observable({
        meets: [],
        errorMessage: "",
        noMeets: false,
        
        listViewItemClick: function(e){
            app.currentMeetId = e.dataItem.Id;
            app.application.navigate("views/meet-details-view.html#meet-details-view");   
        }
    });
    
    var init = function(){
        window.httpRequester.getJSON(app.servicesBaseUrl + "meets/getmy?phoneID=" + device.uuid).then(function(data){
            var meets = viewModel.get("meets");
            meets.splice(0, meets.length);
            
            for (var i = 0; i < data.length; i++){
                if (data[i].isReceived){
                    intro = "Meeting";
                } else {
                    intro = "Meet with";  
                }
                
                status = "Awaiting response";
                if (data[i].isAccepted){
                    status = "Accepted";
                }  else if (data[i].isDeclined){
                    status = "Declined";
                }
                
                viewModel.get("meets").push({
                    Id: data[i].id,
                    Intro: intro,
                    Nickname: data[i].nickname,
                    Status: status
                });
            }
            
            if (data.length == 0){
                viewModel.set("noMeets", true);
            }
        }, function(error){
            viewModel.set("errorMessage", error.Message);
        });
    }
    
    app.meetsService = {
        viewModel: viewModel,
        init: init
    }
}(app));