const getPlaceholderImg = () => {
    return ('https://randomuser.me/api/portraits/med/'
        + (Math.random()>0.5 ? 'men/' : 'women/')
        + (Math.floor(Math.random() * 80)+10)
        + '.jpg');
}



$(document).ready(() => {
    // Set user imgs to randomly generated placeholders
    $(".user>img").each((i, img) => {
        img.setAttribute("src", getPlaceholderImg());
        if (i == 0) {
            $(".chat-title>img").each((i, selectedImg) => {
                selectedImg.setAttribute("src", img.getAttribute("src"));
            })
        }
    });

    // Search functionality
    $('.chat-search>input').on('input', () => {
        refreshUserSearch();
    });

    $('.chat-search>input').keypress((e) => {
        if (e.which == 13) {
            $('.chat-search>input').val("");
            refreshUserSearch();
        }
    });

    $('.chatbox>input').keypress(async (e) => {	
		if(e.which == 13 && $('.chatbox>input').val() != "") {
            sendMessage();
        }
    });

    $('.chat-send-btn').click(() => {
        if ($('.chatbox>input').val() != "") {
            sendMessage();
        }
    })
})

const refreshUserSearch = () => {
    let val = $('.chat-search>input').val()
    $(".user").each((i, user) => {
        let name = user.querySelector(".user-details").textContent
        user.hidden = !name.toLowerCase().includes(val.toLowerCase())
    })
}

const sendMessage = () => {
    let msg = {
        'msg': $('.chatbox>input').val()
    }
    
    $('.chatbox>input').val('')

    var msgSendResult = true;
    // try {
    //     await $.post('../chat/sendChat', msg)
    //     msgSendResult = true;
    // } catch (err) {
    //     console.log("Error posting message!")
    // }
    
    if (msgSendResult) {
        var newMsgElement = ('<div class="msg-container"><div class="msg msg-yours">'
        + msg['msg']
        +'</div></div>');
    } else {
        var newMsgElement = ('<div class="msg-container"><div class="msg msg-yours">'
        + '<span style="color:#812411" class="fa fa-exclamation-circle" aria-hidden="true"></span>'
        + '<em style="color:#812411"> Error Sending Message:<br></em>'
        + msg['msg']
        +'</div></div>');
    }
    
    
    $('#cwnd').append(newMsgElement)
    $('#cwnd').scrollTop($('#cwnd')[0].scrollHeight)
}