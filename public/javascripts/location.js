var lat, lng, radius;
var areaCovered = 0;

// map logic

/* 
Snapchat :
min = 20,000 sequare feet
max = 50,000,000 sequare feet

min = 1858.0608 sequare meter 
min r = 25

max = 4645152 sequare meter 
max r = 1215
*/

var marker, circle, heatmap;

// Initialize and add the map
function initMap() {
    // The location of makkah
    // lat: 21.42287180684407 lng: 39.8257344961166449611664
    var makkah = { lat: 21.414210, lng: 39.859551 };
    // The map, centered at makkah
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 13,
            center: makkah,
            gestureHandling: 'greedy',
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.BOTTOM_CENTER
            }
        }
    );

    var locations = [
        ['Volunteer: Ahmad Khalid', 21.419004, 39.891809, 4],
        ['Volunteer: Ali Abdulrahman', 21.416767, 39.876023, 5],
        ['Volunteer: Ali Abdulrahman', 21.416767, 39.879523, 6],
        ['Volunteer: Ali Abdulrahman', 21.419767, 39.879523, 6],
        ['Volunteer: Mohammad Jamal', 21.408137,39.886662, 3],
        ['Volunteer: Ahmad Khalid', 21.418684,39.865042, 2],
        ['Volunteer: Ahmad Khalid', 21.415169,39.848226, 1]
    ];

    var infowindow = new google.maps.InfoWindow();

    var newMarker, i;

    for (i = 0; i < locations.length; i++) {
        newMarker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map,
            icon: '../images/volunteer.png'
        });

        google.maps.event.addListener(newMarker, 'click', (function (newMarker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, newMarker);
            }
        })(newMarker, i));
    }

    newMarker = new google.maps.Marker({
        position: new google.maps.LatLng(21.416128,39.868817),
        map: map,
        icon: '../images/volunteer-busy.png'
    });

    newMarker = new google.maps.Marker({
        position: new google.maps.LatLng(21.432108,39.870533),
        map: map,
        icon: '../images/volunteer-busy.png'
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map,
        radius: 25
        // dissipating: false
    });
    
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: [ 
            new google.maps.LatLng(21.407480, 39.873925),
            new google.maps.LatLng(21.409500, 39.875760),
            new google.maps.LatLng(21.413096, 39.874301),
            new google.maps.LatLng(21.413016, 39.881426),
        ],
        map: map,
        radius: 25,
        // dissipating: false
    });

    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
    // map.controls[google.maps.ControlPosition.LEFT].push(document.getElementById('pac-input'));
    google.maps.event.addListener(searchBox, 'places_changed', function () {
        searchBox.set('map', null);
        if (marker)
            marker.setMap(null);
        if (circle)
            circle.setMap(null);

        var places = searchBox.getPlaces();

        var bounds = new google.maps.LatLngBounds();
        var i, place;
        for (i = 0; place = places[i]; i++) {
            (function (place) {
                marker = new google.maps.Marker({

                    position: place.geometry.location
                });
                marker.bindTo('map', searchBox, 'map');
                google.maps.event.addListener(marker, 'map_changed', function () {
                    if (!this.getMap()) {
                        this.unbindAll();
                    }
                });
                bounds.extend(place.geometry.location);

            }(place));

        }
        map.fitBounds(bounds);
        searchBox.set('map', map);
        map.setZoom(Math.min(map.getZoom(), 12));
    });

    // The marker, positioned at makkah
    //var marker = new google.maps.Marker({position: makkah, map: map});

    google.maps.event.addListener(map, 'click', function (event) {
        // delete previous marker & circle
        // if (marker)
        //     marker.setMap(null);
        // if (circle)
        //     circle.setMap(null);

        // Create marker 
        marker = new google.maps.Marker({
            position: {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            },
            map: map,
            animation: google.maps.Animation.DROP,
            title: 'This will be your event loccation',
            draggable: true,
        });
        marker.setVisible(false);

        lat = event.latLng.lat();
        lng = event.latLng.lng();
        

        // marker.addListener('click', toggleBounce);

        // Add circle overlay and bind to marker
        circle = new google.maps.Circle({
            map: map,
            radius: 1000,
            fillColor: '#00AA00',
            strokeOpacity: 0.5,
            editable: true,
            draggable: true,
        });

        // radius = 200;

        circle.bindTo('center', marker, 'position');

        google.maps.event.addListener(circle, 'dragend', function (event) {
            lat = circle.getCenter().lat();
            lng = circle.getCenter().lng();
        })

        google.maps.event.addListener(marker, 'dragend', function (event) {
            lat = circle.getCenter().lat();
            lng = circle.getCenter().lng();
        })

        google.maps.event.addListener(circle, 'radius_changed', function () {
            var r = circle.getRadius();
            $('.feedback-container div').html(
                '<i class="fas fa-exclamation-circle"></i>' +
                '<span id="feedback">Choose a time, date & location for your event</span>'
            );
            $('.feedback-container').removeClass('warning');
            circle.setOptions({ fillColor: '#00AA00' });

            radius = r;

            areaCovered = getAreaInSqFt(circle.getRadius());
            $('#area').text(areaCovered);
        });

        areaCovered = getAreaInSqFt(circle.getRadius());
        $('#area').text(areaCovered);
    });
}

// google.maps.event.addDomListener(window, 'load', init);

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

function getAreaInSqFt(r) {
    var area = Math.round(Math.pow(r, 2) * Math.PI * 10.186);
    return commafy(area);
}

function commafy(num) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}


function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
    locations = new Array();
    var lastLat = 21.412931;
    var lastLng = 39.895241;

    for (var i = 1; i < 15; i++) {
        lastLat += (Math.random()) / 250;
        lastLng += (Math.random()) / 250;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    //21.405260,39.877396
    lastLat = 21.405260;
    lastLng = 39.877396;

    for (var i = 1; i < 15; i++) {
        lastLat += (Math.random()) / 250;
        lastLng += (Math.random()) / 250;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    // 21.384802,39.876023
    lastLat = 21.384802;
    lastLng = 39.876023;

    for (var i = 1; i < 15; i++) {
        lastLat += (Math.random()) / 250;
        lastLng += (Math.random()) / 250;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    // 21.384802,39.876023
    lastLat = 21.382000;
    lastLng = 39.878000;

    for (var i = 1; i < 15; i++) {
        lastLat += (Math.random()) / 250;
        lastLng += (Math.random()) / 250;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    // 21.384802,39.876023
    lastLat = 21.386000;
    lastLng = 39.878000;

    for (var i = 1; i < 15; i++) {
        lastLat += (Math.random()) / 250;
        lastLng += (Math.random()) / 250;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }
    // console.log(locations);
    // console.log('locations');

    return locations;
}


$(document).ready(function () {
    $('#confirm-request').click(() => {
        $('#request-form').fadeOut();

        loading();

        $.ajax({
            method: "POST",
            url: "http://10.1.1.132:3000/request",
            data: {
                text: $('input[name="message"]').val(),
                lat: lat,
                lng: lng,
            },
            success: function (res) {
                console.log(res);
            }
        });

    })

    $('#send-volunteers').click(() => {
        $('#request-form').fadeIn();
    })

    $('#assign-leaders').click(() => {
        $('#leader-form').fadeIn();
    })

    $('#cancel-leader').click(() => {
        $('#leader-form').fadeOut();
    })

    $('#cancel-request').click(() => {
        $('#request-form').fadeOut();
    })

    $('#chat-button').click(() => {
        $('#chat-form').fadeIn();
    })

    $('#cancel-chat').click(() => {
        $('#chat-form').fadeOut();
    })

    $('#send-chat').click(() => {
        $('#chat-form').fadeOut();          
        loading();
    })

    $('#send-leader').click(() => {
        $('#leader-form').fadeOut();        
        loading();
    })

    $('#chat-form .contacts .contact').click(function() {
        $(this).addClass('modal-item-selected');
    })

    addTimes("#from-time", 0);
    addTimes("#to-time", 0);
});

function loading() {
    $('.loading-form').fadeIn();
    $('#loading-modal').html('<img src="../images/loading.gif" class="loading">');
    setTimeout(() => {
        $('#loading-modal').html('<p>sent!</p>');
    }, 2000);
    setTimeout(() => {
        $('.loading-form').fadeOut();
    }, 3000);
}

function addTimes(menu, startNum) {
    console.log('addTimes: ' + menu + ' with startNum: ' + startNum);

    $(menu).empty();
    // if a bitch selected 11 pm while selecting the same day, update the endDate to the next day
    if (startNum == 24) {
        startNum = 0;
        endDate = moment(startDate).add(1, 'days');
        $('input[name="date-range"]').data('daterangepicker').setEndDate(endDate);
        console.log('New end date: ' + moment(endDate).format('YYYY-MM-DD'));
    }

    for (i = startNum; i <= 23; i++) {
        if (i == 0)
            $(menu).append('<option value="' + i + '">12:00 am</option>');

        else if (i > 0 && i < 10)
            $(menu).append('<option value="' + i + '">0' + i + ':00 am</option>');

        else if (i > 9 && i < 12)
            $(menu).append('<option value="' + i + '">' + i + ':00 am</option>');

        else if (i == 12)
            $(menu).append('<option value="' + i + '">' + i + ':00 pm</option>');

        else if (i > 12 && i < 22)
            $(menu).append('<option value="' + i + '">0' + (i - 12) + ':00 pm</option>');

        else
            $(menu).append('<option value="' + i + '">' + (i - 12) + ':00 pm</option>');
    }

    // $(menu).val('-1');
}