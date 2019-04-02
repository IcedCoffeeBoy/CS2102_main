$(document).ready(() =>
  $(".thumbnail").on("click", (event) => {
    var clicked = $(event.target).parent();
    var newSelection = clicked.data("big");
    var $img = $(".primary").css(
      "background-image",
      "url(" + newSelection + ")"
    );
    clicked
      .parent()
      .find(".thumbnail")
      .removeClass("selected");
    clicked.addClass("selected");
    $(".primary")
      .empty()
      .append($img.hide().show());
  })
);

$(document).ready(() => {

  $(".accept-offer").click(function () {
    $('.accept_offer_class').show();
  })

  $('.popupCloseButton').click(function () {
    $('.accept_offer_class').hide()
  });

  $('.cancel-offer').click(function () {
    $('.accept_offer_class').hide()
  });

  $('.confirm-offer').click(function () {
    $('.accept_offer_class').hide()
    var url = $(this).attr('action');
    $.post(url, function (result) {
      $('.hover_bkgr_fricc').show();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status = 404) {
        alert("No bidding is found for this item")
      } else if (jqXHR.status == 500 || jqXHR.status == 403) {
        alert("Server Error")
      } 
    });
  });
})


function checkbidPrice(bidPrice) {
  let re = /^[0-9]*$/
  return re.test(bidPrice)
}