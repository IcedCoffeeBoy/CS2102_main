$('.message a').click(function () {
  $('form').animate({ height: "toggle", opacity: "toggle" }, "slow");
});

$(".register-form").on("submit", function (e) {
  e.preventDefault();
  var data = $(this).serialize();
  $.post('/reg', data, function (result) {
    if (result.valid == false) {
      $('#reg-alert').slideDown()
      window.setTimeout(()=>$('#reg-alert').slideUp() , 5000);
    } else {
      alert("Sucessfully created account");
      window.location.href = '../';
    }
  });
});

window.setTimeout(function () {
  $("#login-alert").fadeTo(500, 0).slideUp(500, function () {
    $(this).remove();
  });
}, 1000);

function checkUsername(username) {
  var re = /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/
  return re.test(username)
}