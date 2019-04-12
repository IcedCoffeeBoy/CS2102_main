const getPlaceholderImg = () => {
    return (
        "https://randomuser.me/api/portraits/med/" +
        (Math.random() > 0.5 ? "men/" : "women/") +
        (Math.floor(Math.random() * 80) + 10) +
        ".jpg"
    );
};

var currentCwnd = "#cwnd0";
var currentTimestamp = ts;

$(document).ready(() => {
    // Automatically scroll all chat windows to the bottom
    $(".chatwindow").each((idx, cwnd) => {
        $(cwnd).scrollTop($(cwnd)[0].scrollHeight);
    });

    // Set user imgs to randomly generated placeholders
    $(".user>img").each((i, img) => {
        img.setAttribute("src", getPlaceholderImg());
        if (i == 0) {
            $(".chat-title>img").each((i, selectedImg) => {
                selectedImg.setAttribute("src", img.getAttribute("src"));
            });
        }
    });

    // Search functionality
    $(".chat-search>input").on("input", () => {
        refreshUserSearch();
    });

    $(".chat-search>input").keypress(e => {
        if (e.which == 13) {
            $(".chat-search>input").val("");
            refreshUserSearch();
        }
    });

    $(".chatbox>input").keypress(async e => {
        if (e.which == 13 && $(".chatbox>input").val() != "") {
            sendMessage();
        }
    });

    $(".chat-send-btn").click(() => {
        if ($(".chatbox>input").val() != "") {
            sendMessage();
        }
    });

    $(".user").click(e => {
        let userId = e.currentTarget.getAttribute("uid");
        let itemId = e.currentTarget.getAttribute("iid");
        let imgSrc = e.currentTarget
            .getElementsByClassName("uimg")[0]
            .getAttribute("src");

        $(".chat-title>img").attr("src", imgSrc);
        $(".chat-title>.user-details>.username").text(
            e.currentTarget.querySelector(".user-details>.username").textContent
        );
        $(".chat-title>.user-details>.item-subtitle").text(
            e.currentTarget.querySelector(".user-details>.item-subtitle").textContent
        );


        $(".chatwindow").each((i, cwnd) => {
            if (
                cwnd.getAttribute("uid") != userId ||
                cwnd.getAttribute("iid") != itemId
            ) {
                cwnd.hidden = true;
            } else {
                cwnd.hidden = false;
                $(cwnd).scrollTop($(cwnd)[0].scrollHeight);

                currentCwnd = "#" + cwnd.id;
            }
        });
    });

    const sendMessage = async () => {
        let msg = {
            recipient: $(currentCwnd).attr("uid"),
            itemId: $(currentCwnd).attr("iid"),
            msg: $(".chatbox>input").val()
        };

        $(".chatbox>input").val("");

        var msgSendResult = false;
        try {
            await $.post("../chat/sendChatMain", msg);
            msgSendResult = true;
        } catch (err) {
            console.log("Error posting message!");
        }

        if (msgSendResult) {
            var newMsgElement =
                '<div class="msg-container"><div class="msg msg-yours">' +
                msg["msg"] +
                "</div></div>";
        } else {
            var newMsgElement =
                '<div class="msg-container"><div class="msg msg-yours">' +
                '<span style="color:#812411" class="fa fa-exclamation-circle" aria-hidden="true"></span>' +
                '<em style="color:#812411"> Error Sending Message:<br></em>' +
                msg["msg"] +
                "</div></div>";
        }

        $(currentCwnd).append(newMsgElement);
        $(currentCwnd).scrollTop($(currentCwnd)[0].scrollHeight);
    };

    const getNewMessages = async () => {
        var msgPollParams = {
            timestamp: currentTimestamp
        };

        try {
            var msgs = await $.post("../chat/getChatMain", msgPollParams);
        } catch (err) {
            console.log(err);
            return;
        }
        currentTimestamp = msgs.pop();

        if (msgs.length != 0) {
            displayNewInboundMessage(msgs);
        }
    };

    const displayNewInboundMessage = msgs => {
        $(".chatwindow").each((idx, cwnd) => {
            msgs.filter(m => {
                return m.userid == cwnd.getAttribute("uid");
            }).forEach(m => {
                var newMsgElement =
                    '<div class="msg-container"><div class="msg msg-theirs">' +
                    m.msg +
                    "</div></div>";
                $(cwnd).append(newMsgElement);
            });
        });

        $(currentCwnd).scrollTop($(currentCwnd)[0].scrollHeight);
    };

    var getNewMessageTimer = setInterval(getNewMessages, 3000);
});

const refreshUserSearch = () => {
    let val = $(".chat-search>input").val();
    $(".user").each((i, user) => {
        let name = user.querySelector(".username").textContent;
        let itemTitle = user.querySelector(".item-subtitle").textContent;
        user.hidden =
            !name.toLowerCase().includes(val.toLowerCase()) &&
            !itemTitle.toLowerCase().includes(val.toLowerCase());
    });
};
