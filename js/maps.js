$(function () {
    var
    map,
    geocoder,
    church,
    reception,
    
    /**
     * Initialize the Map
     * 
     * Wedding: { Baptist Temple : 40.755049, -86.361357 },
     * Reception: { Memorial Home : 40.7536264, -86.36107879999997 }
     */
    initialize = function () {
        geocoder = new google.maps.Geocoder();
        church = new google.maps.LatLng('40.755049','-86.361357');
        reception = new google.maps.LatLng('40.7536264','-86.36107879999997');

        var mapOptions = {
            zoom: 8,
            center: church,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI: true
        };

        $('#map').gmap({
            center: church,
            zoom: 8,
            mapTypeId: google.maps.MapTypeId.HYBRID,
            disableDefaultUI: true
        }).bind('init', function (e, map) {
            $('#map').gmap('addMarker', {
                position: '40.755049,-86.361357',
                bounds: true
            }).click(function () {
                $('#map').gmap('openInfoWindow', {
                    content: '<address><strong>The Baptist Temple</strong><br>700 E Broadway<br>Logansport, IN 46947</address>'
                }, this);
            });

            $('#map').gmap('addMarker', {
                position: '40.7536264,-86.36107879999997',
                bounds: true
            }).click(function () {
                $('#map').gmap('openInfoWindow', {
                    content: '<address><strong>The Memorial Home</strong><br>706 E Market St<br>Logansport, IN 46947</address>'
                }, this);
            });
        });
    },

    /**
     * Geocode a given address
     */
    codeAddress = function (address) {
        geocoder.geocode({
            address: address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log('geocoder', results[0].geometry.location);
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    },

    /**
     * Get Geocode from Google Maps API and 
     */
    getGeocode = function (address, type) {
        var
        geocode,
        url = 'http://maps.googleapis.com/maps/api/geocode/json';

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            data: {
                address: address,
                sensor: false
            },
            success: function (json) {
                console.log('json', json);
                for (var i=0; i < json.results.length; i++) {
                    geocode = json.results[i].geometry.location;
                    console.log('geocode', geocode);
                    console.log('type', type);

                    $('body').data(type, geocode);
                }            

            }
        });

        return geocode;
    };

    google.maps.event.addDomListener(window, 'load', initialize);

    $('.rsvp-choice').on({
        click: function (e) {
            e.preventDefault();
            var $this = $(this);
            $('.rsvp-choice').removeClass('selected');
            $this.addClass('selected');
            $('#attending').val($this.val());
        }
    });

    $('#submit').on({
        click: function (e) {
            e.preventDefault();
            $('input', '#rsvp-form').each(function () {
                var value = $(this).val();
                var id = $(this).attr('name');
                $('#rsvp-form').data(id, value);
            });

            $.ajax({
                url: 'lib/processForm.php',
                data: $('#rsvp-form').data()
            }).done(function (data) {
                console.log('data', data);
                if (data) {
                    var message = $('<div class="span12"/>');
                    message.html('Thank you!  We will be receiving your RSVP shortly!');
                    $('#rsvp-form').parent().fadeOut(400);
                    $('#rsvp').html(message);
                }
            });
        }
    });
});