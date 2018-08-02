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
    var makkah = { lat: 21.42287180684407, lng: 39.8257344961166449611664 };
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

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map
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

    heatmap.setMap(heatmap.getMap() ? null : map);
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

    for(var i = 1; i < 25; i++ ) {
        lastLat += (Math.random())/750;
        lastLng += (Math.random())/750;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    //21.405260,39.877396
    lastLat = 21.405260;
    lastLng = 39.877396;

    for(var i = 1; i < 25; i++ ) {
        lastLat += (Math.random())/750;
        lastLng += (Math.random())/750;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    // 21.384802,39.876023
    lastLat = 21.384802;
    lastLng = 39.876023;

    for(var i = 1; i < 25; i++ ) {
        lastLat += (Math.random())/750;
        lastLng += (Math.random())/750;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    // 21.384802,39.876023
    lastLat = 21.382000;
    lastLng = 39.878000;

    for(var i = 1; i < 25; i++ ) {
        lastLat += (Math.random())/750;
        lastLng += (Math.random())/750;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }

    // 21.384802,39.876023
    lastLat = 21.386000;
    lastLng = 39.878000;

    for(var i = 1; i < 25; i++ ) {
        lastLat += (Math.random())/750;
        lastLng += (Math.random())/750;
        locations.push(new google.maps.LatLng(lastLat, lastLng));
        // console.log(lastLat);
    }
    // console.log(locations);
    // console.log('locations');

    return locations;

    // var locations = [
        // new google.maps.LatLng(21.412931,39.895241),
        // new google.maps.LatLng(21.413890,39.889750),
        // new google.maps.LatLng(21.419643,39.892839),
        // new google.maps.LatLng(21.419963,39.901075),
        // new google.maps.LatLng(21.416128,39.891123),
        // new google.maps.LatLng(21.412612,39.892152),
        // new google.maps.LatLng(21.414210,39.893182),

        // new google.maps.LatLng(21.422871806848065, 39.825734496120646),
        // new google.maps.LatLng(21.422871806849063, 39.82573449612165),
        // new google.maps.LatLng(21.422871806850060, 39.82573449612265),
        // new google.maps.LatLng(21.422871806851060, 39.82573449612365),
        // new google.maps.LatLng(21.422871806852058, 39.82573449612465),
        // new google.maps.LatLng(21.422871806853056, 39.825734496125655),
        // new google.maps.LatLng(21.422871806854054, 39.82573449612666),
        // new google.maps.LatLng(21.422871806855053, 39.82573449612766),
        // new google.maps.LatLng(21.422871806856050, 39.82573449612866),
        // new google.maps.LatLng(21.422871806857050, 39.82573449612966),
        // new google.maps.LatLng(21.422871806858048, 39.825734496130664),
        // new google.maps.LatLng(21.422871806859046, 39.825734496131666),
        // new google.maps.LatLng(21.422871806860044, 39.82573449613267),
        // new google.maps.LatLng(21.422871806861043, 39.82573449613367),
        // new google.maps.LatLng(21.42287180686204, 39.82573449613467),
        // new google.maps.LatLng(21.42287180686304, 39.825734496135674),
        // new google.maps.LatLng(21.422871806864038, 39.825734496136675),
        // new google.maps.LatLng(21.422871806865036, 39.82573449613768),
        // new google.maps.LatLng(21.422871806866034, 39.82573449613868),
        // new google.maps.LatLng(21.422871806867033, 39.82573449613968),
        // new google.maps.LatLng(21.42287180686803, 39.82573449614068),
        // new google.maps.LatLng(21.42287180686903, 39.825734496141685),
        // new google.maps.LatLng(21.422871806870027, 39.82573449614269),
        // new google.maps.LatLng(21.422871806871026, 39.82573449614369),
        // new google.maps.LatLng(21.422871806872024, 39.82573449614469),
        // new google.maps.LatLng(21.422871806873022, 39.82573449614569),
        // new google.maps.LatLng(21.42287180687402, 39.825734496146694),
        // new google.maps.LatLng(21.42287180687502, 39.825734496147696),
        // new google.maps.LatLng(21.422871806876017, 39.8257344961487),
        // new google.maps.LatLng(21.422871806877016, 39.8257344961497),
        // new google.maps.LatLng(21.422871806878014, 39.8257344961507),
        // new google.maps.LatLng(21.422871806879012, 39.8257344961517),
        // new google.maps.LatLng(21.42287180688001, 39.825734496152705),
        // new google.maps.LatLng(21.42287180688101, 39.82573449615371),
        // new google.maps.LatLng(21.422871806882007, 39.82573449615471),
        // new google.maps.LatLng(21.422871806883006, 39.82573449615571),
        // new google.maps.LatLng(21.422871806884004, 39.82573449615671),
        // new google.maps.LatLng(21.422871806885002, 39.825734496157715),
        // new google.maps.LatLng(21.422871806886, 39.82573449615872),
        // new google.maps.LatLng(21.422871806887, 39.82573449615972),
        // new google.maps.LatLng(21.422871806887997, 39.82573449616072),
        // new google.maps.LatLng(21.422871806888995, 39.82573449616172),
        // new google.maps.LatLng(21.422871806889994, 39.825734496162724),
        // new google.maps.LatLng(21.422871806890992, 39.825734496163726),
        // new google.maps.LatLng(21.42287180689199, 39.82573449616473),
        // new google.maps.LatLng(21.42287180689299, 39.82573449616573),
        // new google.maps.LatLng(21.422871806893987, 39.82573449616673),
        // new google.maps.LatLng(21.422871806894985, 39.82573449616773),
        // new google.maps.LatLng(21.422871806895984, 39.825734496168735),
        // new google.maps.LatLng(21.422871806896982, 39.82573449616974),
        // new google.maps.LatLng(21.42287180689798, 39.82573449617074),
        // new google.maps.LatLng(21.42287180689898, 39.82573449617174),
        // new google.maps.LatLng(21.422871806899977, 39.82573449617274),
        // new google.maps.LatLng(21.422871806900975, 39.825734496173745),
        // new google.maps.LatLng(21.422871806901973, 39.825734496174746),
        // new google.maps.LatLng(21.42287180690297, 39.82573449617575),
        // new google.maps.LatLng(21.42287180690397, 39.82573449617675),
        // new google.maps.LatLng(21.42287180690497, 39.82573449617775),
        // new google.maps.LatLng(21.422871806905967, 39.825734496178754),
        // new google.maps.LatLng(21.422871806906965, 39.825734496179756),
        // new google.maps.LatLng(21.422871806907963, 39.82573449618076),
        // new google.maps.LatLng(21.42287180690896, 39.82573449618176),
        // new google.maps.LatLng(21.42287180690996, 39.82573449618276),
        // new google.maps.LatLng(21.42287180691096, 39.82573449618376),
        // new google.maps.LatLng(21.422871806911957, 39.825734496184765),
        // new google.maps.LatLng(21.422871806912955, 39.82573449618577),
        // new google.maps.LatLng(21.422871806913953, 39.82573449618677),
        // new google.maps.LatLng(21.42287180691495, 39.82573449618777),
        // new google.maps.LatLng(21.42287180691595, 39.82573449618877),
        // new google.maps.LatLng(21.422871806916948, 39.825734496189774),
        // new google.maps.LatLng(21.422871806917946, 39.825734496190776),
        // new google.maps.LatLng(21.422871806918945, 39.82573449619178),
        // new google.maps.LatLng(21.422871806919943, 39.82573449619278),
        // new google.maps.LatLng(21.42287180692094, 39.82573449619378),
        // new google.maps.LatLng(21.42287180692194, 39.825734496194784),
        // new google.maps.LatLng(21.422871806922938, 39.825734496195786),
        // new google.maps.LatLng(21.422871806923936, 39.82573449619679),
        // new google.maps.LatLng(21.422871806924935, 39.82573449619779),
        // new google.maps.LatLng(21.422871806925933, 39.82573449619879),
        // new google.maps.LatLng(21.42287180692693, 39.82573449619979),
        // new google.maps.LatLng(21.42287180692793, 39.825734496200795),
        // new google.maps.LatLng(21.422871806928928, 39.8257344962018),
        // new google.maps.LatLng(21.422871806929926, 39.8257344962028),
        // new google.maps.LatLng(21.422871806930925, 39.8257344962038),
        // new google.maps.LatLng(21.422871806931923, 39.8257344962048),
        // new google.maps.LatLng(21.42287180693292, 39.825734496205804),
        // new google.maps.LatLng(21.42287180693392, 39.825734496206806),
        // new google.maps.LatLng(21.422871806934918, 39.82573449620781),
        // new google.maps.LatLng(21.422871806935916, 39.82573449620881),
        // new google.maps.LatLng(21.422871806936914, 39.82573449620981),
        // new google.maps.LatLng(21.422871806937913, 39.82573449621081),
        // new google.maps.LatLng(21.42287180693891, 39.825734496211815),
        // new google.maps.LatLng(21.42287180693991, 39.82573449621282),
        // new google.maps.LatLng(21.422871806940908, 39.82573449621382),
        // new google.maps.LatLng(21.422871806941906, 39.82573449621482),
        // new google.maps.LatLng(21.422871806942904, 39.82573449621582)
    // ]
    // return locations;
}


$(document).ready(function () {
    $('#confirm-request').click(() => {
        $('.modal').html('<img src="../images/loading.gif" class="loading">');
        setTimeout(() => {
            $('.modal').html('<p>sent!</p>');
        }, 1000);

        setTimeout(() => {
            $('#request-form').fadeOut();            
        }, 2000);
    })

    $('#send-volunteers').click(()=> {
        $('#request-form').fadeIn();
    })

    $('#cancel-request').click(()=> {
        $('#request-form').fadeOut();
    })

    $('#chat-button').click(()=> {
        $('#chat-form').fadeIn();
    })

    $('#cancel-chat').click(()=> {
        $('#chat-form').fadeOut();
    })

    $('#send-chat').click(() => {
        $('.chat-modal').html('<img src="../images/loading.gif" class="loading">');
        setTimeout(() => {
            $('.modal').html('<p>sent!</p>');
        }, 1000);

        setTimeout(() => {
            $('#chat-form').fadeOut();            
        }, 2000);
    })

    $('#chat-form .contacts .contact').click(()=> {
        console.log(this);
        
    })

    addTimes("#from-time", 0);
    addTimes("#to-time", 0);
});

function addTimes(menu, startNum) {
    console.log('addTimes: ' + menu + ' with startNum: ' + startNum);
    
    $(menu).empty();
    // if a bitch selected 11 pm while selecting the same day, update the endDate to the next day
    if(startNum == 24) {
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
            $(menu).append('<option value="' + i + '">0' + (i-12) + ':00 pm</option>');
            
        else 
            $(menu).append('<option value="' + i + '">' + (i-12) + ':00 pm</option>');
    }

    $(menu).val('-1');
}