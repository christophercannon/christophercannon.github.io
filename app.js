$(document).ready(function() {
  var fireb = new Firebase("https://chriscannon.firebaseio.com");

  // sends input to Firebase
  $('#messages-form').submit(function(e) {
    e.preventDefault(); // sending data thru javascript, NOT HTML

    var $messageInput = $(this).find('input[name="message"]');
    console.log($messageInput.val());

    fireb.child('messages').push({
      text: $messageInput.val(),
      votes: 0
    })

    // reset input field
    $messageInput.val("");
  })

  // reads messages from Firebase
  function getFanMessages() {
    fireb.child('messages').on('value', function(results) {
      $('#messages').empty(); // prevents full list from being repeated on new input
      var values = results.val();

      for(var key in values) {
        console.log(values[key]);
        var msg = values[key];
        var upvote = $('<button data-id="' + key + '">upvote</button>');
        var container = $("<p>" + msg.text + ", " + msg.votes + " votes</p>");

        container.append(upvote);
        // or: upvote.appendTo(container);

        upvote.click(function() {
          console.log(msg);
          var msgID = $(this).data('id');
          updateVotes(msgID, values[msgID].votes + 1);
        })

        container.appendTo('#messages');
      }
    })
  }

  // updating data
  function updateVotes(msgID, votes) {
    var ref = new Firebase("https://chriscannon.firebaseio.com/messages/" + msgID);
    ref.update({ votes: votes });
  }

  getFanMessages();

})