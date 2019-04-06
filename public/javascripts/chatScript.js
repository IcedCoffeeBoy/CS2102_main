$(document).ready(() => {
    const pid = window.location.pathname.split("/").pop();
    var currentTimestamp = false;

    $('.chatbox>input').keypress(async (e) => {	
		if(e.which == 13 && $('.chatbox>input').val() != "") {
            let msg = {
                'itemId': pid,
                'msg': $('.chatbox>input').val()
            }
            
            $('.chatbox>input').val('')

            var msgSendResult = false;
            try {
                await $.post('../chat/sendChat', msg)
                msgSendResult = true;
            } catch (err) {
                console.log("Error posting message!")
            }
            
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
    });

    $('.chat-close').click((e) => {
        $('#chat-window').hide()
        $('#chat-open-btn').show()
    })

    $('#chat-open-btn').click((e) => {
        $('#chat-window').show()
        $('#chat-open-btn').hide()
        $('#cwnd').scrollTop($('#cwnd')[0].scrollHeight)
    })

    $('#main-chat-open-btn').click((e) => {
        $('#chat-window').show()
        $('#chat-open-btn').hide()
        $('#cwnd').scrollTop($('#cwnd')[0].scrollHeight)
    })
    
    const getNewMessages = async () => {
        if (!currentTimestamp)  {
            var msgPollParams = {
                'itemId': pid,
                'retrieveAll': true,
                'tstamp': 0
            }
        } else {
            var msgPollParams = {
                'itemId': pid,
                'retrieveAll': false,
                'tstamp': currentTimestamp
            }
        }

        let msgs = await $.post('../chat/getChat', msgPollParams)
        currentTimestamp = msgs.pop()

        if (msgs.length != 0) {
            displayNewInboundMessage(msgs)
        }
    }

    const displayNewInboundMessage = (msgs) => {
 
        msgs.forEach((m) => {
            if (m.toUser) {
                var newMsgElement = ('<div class="msg-container"><div class="msg msg-theirs">'
                + m.msg
                +'</div></div>');
            } else {
                var newMsgElement = ('<div class="msg-container"><div class="msg msg-yours">'
                + m.msg
                +'</div></div>');
            }
            $('#cwnd').append(newMsgElement)
        });
        
        $('#cwnd').scrollTop($('#cwnd')[0].scrollHeight)
    }

    getNewMessages(false)
    var getNewMessageTimer = setInterval(getNewMessages, 3000)
})




