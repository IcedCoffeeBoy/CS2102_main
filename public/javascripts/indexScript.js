$('.message a').click(function () {
  $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});

$(".register-form").on("submit", function (e) {
  e.preventDefault();
  var data = $(this).serialize();
  console.log(data.body);
  $.post('/reg', data, function (result) {
    if (result.valid == false) {
      alert("Username or email taken");
    } else {
      alert("Sucessfully created account")
      window.location.href = '../';
    }
  });
});

window.setTimeout(function() {
  $(".alert").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove(); 
  });
}, 4000);
