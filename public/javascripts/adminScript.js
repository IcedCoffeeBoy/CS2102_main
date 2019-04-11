$(document).ready(() => {
    $(".delete-item").click(function (event) {
        event.preventDefault();
        let url = $(this).attr("href");
        $.get(url, function (result) {
            pop_msg("Success!", "Deleted item");
            window.setTimeout(() => { location.reload() }, 5000)
        }).fail(function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status = 403) {
                pop_msg("Failure!", "Only admin can use this function");
            } else if (jqXHR.status == 500 || jqXHR.status == 403) {
                pop_msg("Failure!", "Server error");
            }
        });
    });

    $(".delete-user").click(function (event) {
        event.preventDefault();
        let url = $(this).attr("href");
        popmsg("<p>are you sure to delete?<p>" +
            "<a class='confirm-yes' href='" + url + "'>confirm</a>");

        $(".confirm-yes").click(function (event) {
            event.preventDefault();
            console.log("confirm-yes")
            let url = $(this).attr("href");
            $.get(url, function (result) {
                pop_msg("Success!", "Deleted item");
                window.setTimeout(() => { location.reload() }, 2000)
            }).fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status = 403) {
                    pop_msg("Failure!", "Only admin can use this function");
                } else if (jqXHR.status == 500 || jqXHR.status == 403) {
                    pop_msg("Failure!", "Server error");
                }
            });
        })
    })



    // $.get(url, function (result) {
    //     pop_msg("Success!", "Deleted item");
    //     window.setTimeout(() => { location.reload() }, 5000)
    // }).fail(function (jqXHR, textStatus, errorThrown) {
    //     if (jqXHR.status = 403) {
    //         pop_msg("Failure!", "Only admin can use this function");
    //     } else if (jqXHR.status == 500 || jqXHR.status == 403) {
    //         pop_msg("Failure!", "Server error");
    //     }
    // });

    // $(".delete-form").submit(function (event) {
    //     event.preventDefault();
    //     let url = $(this).attr("action");
    //     $.get("/admin/" + url, function (result) {
    //         pop_msg("Success!", "Deleted user!");
    //         window.setTimeout(() => { location.reload() }, 5000)
    //     }).fail(function (jqXHR, textStatus, errorThrown) {
    //         if (jqXHR.status = 403) {
    //             pop_msg("Failure!", "Only admin can use this function");
    //         } else if (jqXHR.status == 500 || jqXHR.status == 403) {
    //             pop_msg("Failure!", "Server error");
    //         }
    //     });
    // })
})
