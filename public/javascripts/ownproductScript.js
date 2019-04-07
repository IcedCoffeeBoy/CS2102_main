$(document).ready(() => {
  google.charts.load('current', { packages: ['corechart', 'line'] });
  google.charts.setOnLoadCallback(drawBackgroundColor);
})

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
      $('#popout-msg').html("<p>Successful Transaction! <br />Leave a review to the buyer?</p>");
      $('.hover_bkgr_fricc').show();
      window.setTimeout(() => { location.reload() }, 1000)
    }).fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.status = 404) {
      $('#popout-msg').html("<p>Failure! <br />No bidding is found for this item</p>");
      $('.hover_bkgr_fricc').show();
      } else if (jqXHR.status == 500 || jqXHR.status == 403) {
        alert("Server Error")
      }
    });
  });
})



function drawBackgroundColor() {
  let path = $(location).attr('href');
  var data = new google.visualization.DataTable();
  data.addColumn('date', 'time');
  data.addColumn('number', 'bid value');
  $.get(path + '/getbiddinghistory', function (result) {
    result.forEach((element) => {
      data.addRows([[new Date(element.timestamp), parseFloat(element.amount)]]);
    });
    var options = {
      hAxis: {
        title: 'Time'
      },
      vAxis: {
        title: 'Bid Price'
      },
      backgroundColor: '#FFFFFF',
    };
    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  })
}


function checkbidPrice(bidPrice) {
  let re = /^[0-9]*$/
  return re.test(bidPrice)
}