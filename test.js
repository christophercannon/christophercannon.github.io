$(document).ready(function() {
	
	// $('#bandInput').keypress(queryDBfunction);
  $('#doSearch').on('click', queryDBfunction);

  function queryDBfunction (e) {
      var selectedStyle = $('select[name="dropdown"]').val();
      var valYearInput = $('#yearInput').val();
      console.log(selectedStyle, valYearInput);
      e.preventDefault();
      var discogsApiUrl = "https://api.discogs.com/database/search";
      $('#bandA-img, #bandB-img').empty();
      $('#bandA-name, #bandB-name').empty();
      // $('select[name="dropdown"]').val("Select a musical style");
      // $('#yearInput').val("");

      var params = {
        q: '',
        key: 'WwxjcqYkafscMAPPikTJ',
        secret: 'uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ',
        type:'master', // was 'release'
        // sort: 'want%2Cdesc',
        year: valYearInput,
        style: selectedStyle
      };

      $.getJSON(discogsApiUrl, params, function(response) {
        console.log('response',response);
        var results = response.results;
        // console.log(results)

        // generate random object A
        var rand1 = Math.floor(Math.random() * results.length);
          // console.log(rand1 + ' out of ' + results.length);
        var thumbImgA = results[rand1].thumb;
        console.log(thumbImgA);
        var newThumb = $('<div class="thumb"></div>');
        newThumb.css('background-image', 'url("' + thumbImgA + '")');
        $( '#bandA-img' ).append( newThumb );
        $('#bandA-name').text(results[rand1].title);

        // generate random object B
        var rand2 = Math.floor(Math.random() * results.length);
          // console.log(rand1 + ' out of ' + results.length);
        var thumbImgB = results[rand2].thumb;
        console.log(thumbImgB);
        var newThumb = $('<div class="thumb"></div>');
        newThumb.css('background-image', 'url("' + thumbImgB + '")');
        $( '#bandB-img' ).append( newThumb );
        $('#bandB-name').text(results[rand2].title);          
      });
    
  }
})