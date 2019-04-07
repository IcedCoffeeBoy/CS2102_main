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
    var bidPrice = $("#bidPrice").val()
    var price= $("#price").val()
    if (!checkbidPrice(bidPrice)) {
     popmsg("<p>Failure!<br/>Ensure your bid is valid number</p>")
    } else {
      if (parseFloat(bidPrice)>parseFloat(price)) {
        var data = $(this).serialize();
        var url = $(this).attr('action');
        $.post(url, data, function (result) {
          pop_msg("Success!","Successfully added bid");
          window.setTimeout(() => { location.reload() }, 5000)
        }).fail(function (jqXHR, textStatus, errorThrown) {
          if (jqXHR.status == 500 || jqXHR.status == 403) {
            popmsg("<p>Failure!<br />Please bid after 20 seconds</p>");
          } 
        });
      } else {
        popmsg("<p>Failure!<br />Ensure your bid is higher than the currrent bid</p>")
      }

    }
  })

})

$(document).ready(() => {
  $("#like-btn").one("click", function() {
    var url = window.location.href.toString().split("#")[0] + "/like";
    $.post(url, function(results){
      document.getElementById("like-btn").style.color = "red";
      updated_likes = parseInt($('#like-btn').html().split(" ")[1]) + 1;
      updated_str = $('#like-btn').html().split(" ")[0] + " " + updated_likes;
      $('#like-btn').html(updated_str);
    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status == 500) {
        popmsg("<p>Failure!<br />You have liked this item before</p>")
      } else if (jqXHR.status == 403) {
        popmsg("<p>Failure!<br />Please login to like this item</p>")
      }
    });
  });
});


function checkbidPrice(bidPrice) {
  var re = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
  return re.test(bidPrice)
}

