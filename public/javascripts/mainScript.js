$(document).ready(function () {
    $('#popular').click((event) => {
        $('#popular').addClass('active');
        $('#rating').removeClass('active');
        $('#products-popular').removeClass('hide', {duration: 500});
        $('#products-rated').addClass('hide', {duration: 500});
    });
    $('#rating').click((event) => {
        $('#popular').removeClass('active');
        $('#rating').addClass('active');
        $('#products-popular').addClass('hide', {duration: 500});
        $('#products-rated').removeClass('hide', {duration: 500});
    });
});