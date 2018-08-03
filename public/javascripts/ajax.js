$(document).ready(function () {
    $('#send-chat').click(function () {
        $.ajax({
            method: "POST",
            url: "http://10.1.1.132:3000/announcement/",
            data: {
                text: $('.chat-modal input[name="message"]').val()
            },
            success: function (res) {
                // $("body").html(res);
                // console.log(res);
            }
        });
    });
});