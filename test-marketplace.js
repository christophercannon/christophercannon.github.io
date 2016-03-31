$(document).ready(function() {
	
	$('#bandInput').keypress(function (e) {
    if(event.keyCode == 13) {
      var valBandInput = $('#bandInput').val();
      console.log(valBandInput);
      e.preventDefault();
      var discogsApi = "https://api.discogs.com/marketplace/search?q=";
      var discogsKey = "&key=WwxjcqYkafscMAPPikTJ";
      var discogsSecret = "&secret=uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ";
      var url = discogsApi + valBandInput + discogsKey + discogsSecret;
      $('#bandInput').val("");
      $('#allThumbs').empty();

      $.ajax({
        url: url,
        method: "GET",
        dataType: "jsonp",
        success: function(response) {
          console.log(url);
          console.log(response);
          var data = response.data;

          for(var i=0; i<response.data.length; i++) {
            var title = response.data[i].title;
            console.log(title);
            var newItem = $('<li></li>');
            newItem.text(title);
            $( '#allThumbs' ).append( newItem );
            // $('#bandName').text(response.data[0].title)
          }
        }
      })
    };
  });

})