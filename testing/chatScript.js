$(document).ready(() => {
    $('#cwnd').scrollTop($('#cwnd')[0].scrollHeight)

    $('.chatbox>input').keypress(function( e ) {			
		if(e.which == 13) {
            var msg = {'msg': $('.chatbox>input').val()}
            console.log(msg)
            $('.chatbox>input').val('')

            let newMsgElement = `<div class="msg-container"><div class="msg msg-yours"> ${msg['msg']} </div></div>`;
            
            $('#cwnd').append(newMsgElement)
            $('#cwnd').scrollTop($('#cwnd')[0].scrollHeight)
		}
    });
    
    
})




