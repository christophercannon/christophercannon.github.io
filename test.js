$(document).ready(function() {
	
	$('#bandInput').keypress(queryDBfunction);
  $('#doSearch').on('click', queryDBfunction);

  function getRandomYear(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  var randomYear = getRandomYear(1980, 1990);
  console.log(randomYear);


  function queryDBfunction (e) {
    if(event.keyCode == 13) {
      var valBandInput = $('#bandInput').val();
      console.log(valBandInput);
      e.preventDefault();
      var discogsApiUrl = "https://api.discogs.com/database/search";
      $('#bandInput').val("");
      $('#allThumbs').empty();

      var params = {
        q: '',
        key: 'WwxjcqYkafscMAPPikTJ',
        secret: 'uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ',
        type:'release',
        year: randomYear,
        style: 'hardcore'
      };

      $.getJSON(discogsApiUrl, params, function(response) {
        console.log('response',response);
        var results = response.results;

        $.each(results, function(index, item){
          var thumbImg = item.thumb;
          // console.log(thumbImg);
          var newThumb = $('<div class="thumb"></div>');
          newThumb.css('background-image', 'url("' + thumbImg + '")');
          $( '#allThumbs' ).append( newThumb );
          // $('#bandName').text(item.title);     
          console.log(item.uri)
        });
          
      });
    };
  }
})