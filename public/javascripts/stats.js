$(document).ready(function () {

    var randomScalingFactor = function () {
        return Math.round(Math.random() * 100);
    };

    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: [10, 90],
                backgroundColor: [
                    'rgb(224, 57, 57)',
                    'rgb(57, 189, 57)'
                ],
                label: 'Dataset 1'
            }]
        },
        options: {
            responsive: true
        }
    };

    var config2 = {
        type: 'pie',
        data: {
            datasets: [{
                data: [20, 80],
                backgroundColor: [
                    'rgb(224, 57, 57)',
                    'rgb(57, 189, 57)'
                ],
                label: 'Dataset 1'
            }]
        },
        options: {
            responsive: true
        }
    };

    window.onload = function () {
        var ctx = document.getElementById('leaders-chart').getContext('2d');
        window.myPie1 = new Chart(ctx, config);

        ctx = document.getElementById('volunteers-chart').getContext('2d');
        window.myPie2 = new Chart(ctx, config2);
    };
});