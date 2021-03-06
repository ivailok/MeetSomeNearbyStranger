(function (global) {
    var map,
        geocoder,
        LocationViewModel,
        app = global.app = global.app || {};

    LocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,
        markers: [],
        infoWindows: [],
        _isLoading: false,
        address: "",

        onNavigateHome: function () {
            var that = this,
                position;

            that._isLoading = true;
            that.showLoading();

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    map.panTo(position);
                    that._putMarker({
                        position: position,
                        name: "Me",
                        img: "styles/images/person-clip-art-2.png"
                    });
                    
                    window.httpRequester.getJSON(app.servicesBaseUrl + "users/getusersshortview?phoneID=" + device.uuid).then(function(data){
                        for (var i = 0; i < data.length; i++){
                            var image = "styles/images/person-clip-art-2.png";
                            if (data[i].profileImage){
                                image = data[i].profileImage;
                            }
                            that._putMarker({
                                position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
                                name: data[i].nickname,
                                img: image,
                                id: data[i].id
                            });
                        }
                        that._isLoading = false;
                        that.hideLoading();
                    }, function(error){
                        navigator.notification.alert("Unable to find any people online. Check your interner connection.",
                        function () { }, "Finding users failed", 'OK');
                        
                        that._isLoading = false;
                        that.hideLoading();
                    });
                },
                function (error) {
                    //default map coordinates                    
                    position = new google.maps.LatLng(43.459336, -80.462494);
                    map.panTo(position);

                    that._isLoading = false;
                    that.hideLoading();

                    navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                        function () { }, "Location failed", 'OK');
                },
                {
                    timeout: 30000
                }
            );
        },

        onSearchAddress: function () {
            var that = this;

            geocoder.geocode(
                {
                    'address': that.get("address")
                },
                function (results, status) {
                    if (status !== google.maps.GeocoderStatus.OK) {
                        navigator.notification.alert("Unable to find address.",
                            function () { }, "Search failed", 'OK');

                        return;
                    }

                    map.panTo(results[0].geometry.location);
                    that._putMarker(results[0].geometry.location);
                });
        },

        showLoading: function () {
            if (this._isLoading) {
                app.application.showLoading();
            }
        },

        hideLoading: function () {
            app.application.hideLoading();
        },

        _putMarker: function (myMarker) {
            var that = this;

            var marker = new google.maps.Marker({
                map: map,
                position: myMarker.position
            });
            
            var contentString =
                '<div id="content">' +
                    '<h3 style="color:black;">' + myMarker.name + '</h3>' +
                    '<img src="' + myMarker.img + '" width="50px" height="50px"/>';
            if (myMarker.name != "Me"){
                contentString += '<button onclick="goToDetails(\'' + myMarker.id + '\')" style="color:black; display:block;">View</button>';
            }
            contentString += '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });
        }
    });

    app.locationService = {
        initLocation: function () {
            var mapOptions = {
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
    
                    mapTypeControl: false,
                    streetViewControl: false
                };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);            
            geocoder = new google.maps.Geocoder();
            app.locationService.viewModel.onNavigateHome.apply(app.locationService.viewModel, []);
        },

        show: function () {
            //show loading mask in case the location is not loaded yet 
            //and the user returns to the same tab
            app.locationService.viewModel.showLoading();
            
            //resize the map in case the orientation has been changed while showing other tab
            google.maps.event.trigger(map, "resize");
        },

        hide: function () {
            //hide loading mask if user changed the tab as it is only relevant to location tab
            app.locationService.viewModel.hideLoading();
        },

        viewModel: new LocationViewModel()
    };
}
)(window);