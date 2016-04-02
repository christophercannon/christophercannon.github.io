$(document).ready(function() {
	
	// $('#bandInput').keypress(queryDBfunction);
  $('#doSearch').on('click', queryDBfunction);

  function queryDBfunction (e) {
      var selectedStyle = $('select[name="dropdown"]').val();
      var valYearInput = $('#yearInput').val();
      console.log(selectedStyle, valYearInput);
      e.preventDefault();
      var discogsApiUrl = "https://api.discogs.com/database/search";
      $('select[name="dropdown"]').val("Select a musical style");
      $('#yearInput').val("");
      $('#allThumbs').empty();

      var params = {
        q: '',
        key: 'WwxjcqYkafscMAPPikTJ',
        secret: 'uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ',
        type:'release',
        year: valYearInput,
        style: selectedStyle
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
    
  }
})