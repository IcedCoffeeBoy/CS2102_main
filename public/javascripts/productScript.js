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
  $(".bid-form").submit(function (event) {
    event.preventDefault();
    let bidPrice = $("#bidPrice").val()
    let price= $("#price").val()
    if (checkbidPrice(bidPrice) && bidPrice>price) {
      var data = $(this).serialize();
      var url = $(this).attr('action');
      $.post(url, data, function (result) {
        $('#popout-msg').html("<p>Success!<br />Successfully added bid</p>");
        $('.hover_bkgr_fricc').show();
        window.setTimeout(() => { location.reload() }, 5000)
      }).fail(function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 500 || jqXHR.status == 403) {
          $('#popout-msg').html("<p>Failure!<br />Something has went wrong</p>");
          $('.hover_bkgr_fricc').show();
        } 
      });
    } else {
      $('#popout-msg').html("<p>Failure!<br />Ensure your bid is higher than the currrent bid</p>");
      $('.hover_bkgr_fricc').show();
    }
  })

  $('.hover_bkgr_fricc').click(function () {
    location.reload()
  });

  $('.popupCloseButton').click(function () {
    location.reload()
  });
})

$(document).ready(() => {
  $("#like-btn").one("click", function() {
    var url = window.location.href.toString() + "/like";
    $.post(url, function(results){
      document.getElementById("like-btn").style.color = "red";
      updated_likes = parseInt($('#like-btn').html().split(" ")[1]) + 1;
      updated_str = $('#like-btn').html().split(" ")[0] + " " + updated_likes;
      $('#like-btn').html(updated_str);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == 500) {
        alert("You have liked this item before")
      } else if (jqXHR.status == 403) {
        alert("Please login to like this item")
      }
    });
  });
});


function checkbidPrice(bidPrice) {
  console.log(price)
  let re = /[0-9]+(\.[0-9][0-9]?)?/
  return re.test(bidPrice)
}