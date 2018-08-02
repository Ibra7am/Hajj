$(document).ready(function () {
    $('#editor-submit').click(function () {
        $.ajax({
            method: "POST",
            url: "/location",
            data: {
                filter: canvas.toDataURL('png'),
                // canvas: JSON.stringify(canvas.toJSON())
            },
            success: function (res) {
                $("body").html(res);
                // console.log(res);
            }
        });
        // console.log('canvas..');
        // console.log(canvas.toJSON());

    });

    $('#location-submit').click(function () {
        $.ajax({
            method: "POST",
            url: "/checkout",
            data: {
                lat: lat,
                lng: lng,
                radius: radius,
                startDate: moment(startDate).format('DD MMM, YYYY'),
                endDate: moment(endDate).format('DD MMM, YYYY'),
                startTime: startTime,
                endTime: endTime,
                areaCovered: areaCovered,
                snapchatPrice: quote,
                totalPrice: (14.99 + parseFloat(quote))
            },
            success: function (res) {
                $("body").html(res);
            }
        });
    });
});