function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        var id = input.id;
        id = id.substring(id.length - 1, id.length);
        reader.onload = function (e) {
            $('#image-upload-wrap-' + id).hide();
            $('#file-upload-image-' + id).attr('src', e.target.result);
            $('#file-upload-content-' + id).show();

            $('#num_img').val(parseInt($('#num_img').val())+1);
            console.log($('#num_img').val());
        };

        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload(id);
    }
}

function removeUpload(input) {
    var id = input.id;
    id = id.substring(id.length - 1, id.length);
    $('#file-upload-input-' + id).replaceWith($('#file-upload-input-' + id).clone());
    $('#file-upload-content-' + id).hide();
    $('#image-upload-wrap-' + id).show();

    $('#num_img').val(parseInt($('#num_img').val())-1);
    console.log($('#num_img').val());
}

$(document).ready(function () {
    var dropElems = document.getElementsByClassName("image-upload-wrap");
    for (var i = 0; i < dropElems.length; i++) {
        elem = dropElems[i];
        elem.addEventListener("dragover", function () {
            this.classList.add("image-dropping");
        });
        elem.addEventListener("dragleave", function () {
            this.classList.remove("image-dropping");
        });
    }
});

$(document).ready(function () {
    var imgurls = JSON.parse($('#temp').text());
    for (var i=0; i < imgurls.length; i++) {
        var imgurl = imgurls[i]['imgurl'];
        var id = i + 1;
        $('#image-upload-wrap-' + id).hide();
        $('#file-upload-image-' + id).attr('src', imgurl);
        $('#file-upload-content-' + id).show();

        $('#num_img').val(i+1);
        console.log($('#num_img').val());
    }
});


$(document).ready(function () {
    $('#editlisting-form').submit(function () {
        $.ajax({
            complete: function () {
                let msg = "<p>Success!<br/>Listing edited!</p>"
                popmsg(msg);
            }
        });
    });
});

$(document).ready(function () {
    $('#rangestart').calendar({
        type: 'date',
        endCalendar: $('#rangeend'),
        minDate: new Date()
    });
    $('#rangeend').calendar({
        type: 'date',
        startCalendar: $('#rangestart')
    });
});

