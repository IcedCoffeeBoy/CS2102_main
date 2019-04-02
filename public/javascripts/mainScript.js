$(document).ready(function () {
    $('#popular').click((event) => {
        event.preventDefault();
        $('#popular').addClass('active');
        $('#rating').removeClass('active');
    });
    $('#rating').click((event) => {
        event.preventDefault();
        $('#popular').removeClass('active');
        $('#rating').addClass('active');
    });
});