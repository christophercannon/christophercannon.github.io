$(document).ready(function() {
	
	$('#bandInput').keypress(function (e) {
    if(event.keyCode == 13) {
      var valBandInput = $('#bandInput').val();
      console.log(valBandInput);
      e.preventDefault();
      var discogsApi = "https://api.discogs.com/database/search?q=";
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

          for(var i=0; i<response.data.results.length; i++) {
            var thumbImg = response.data.results[i].thumb;
            console.log(thumbImg);
            var newThumb = $('<div class="thumb"></div>');
            newThumb.css('background-image', 'url("' + thumbImg + '")');
            $( '#allThumbs' ).append( newThumb );
            $('#bandName').text(response.data.results[0].title);
          }        
            console.log(response.data.results[0].uri)
        }

      })
    };
  });

})