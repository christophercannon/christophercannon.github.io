$(document).ready(function() {
	
  var bandBattleData = new Firebase("https://bandbattle.firebaseio.com/");

	// $('#bandInput').keypress(queryDBfunction);
  $('#doSearch').on('click', queryDBfunction);
  $('#yearInput').on('keypress', function(e) {
    if(e.keyCode == 13) queryDBfunction(e);
  })

  function queryDBfunction (e) {
      var selectedStyle = $('select[name="dropdown"]').val();
      var valYearInput = $('#yearInput').val();
      console.log(selectedStyle, valYearInput);
      e.preventDefault();
      var discogsApiUrl = "https://api.discogs.com/database/search";
      $('#bandA-img, #bandB-img').empty();
      $('#bandA-name, #bandB-name').empty();
      $('#voteForA, #voteForB').css({'display': 'none'});
      $('#bandA-results, #bandB-results').empty();
      $( '#test' ).empty();

      // resets vote btn functionality on new matchup
      $( "#voteForA, #voteForB" ).prop( "disabled", false );
      $( "#voteForA, #voteForB" ).css({'cursor': 'pointer'});

      // logic to further specify return results
      var genreType = 'Rock';
      if(selectedStyle == 'Hip Hop') {
        genreType = 'Hip Hop';
      } else if(selectedStyle == 'Reggae') {
        genreType = 'Reggae';
      }
      console.log(genreType);

      var params = {
        q: '', // query empty, can get user input for refined search
        key: 'WwxjcqYkafscMAPPikTJ',
        secret: 'uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ',
        type:'master', // was 'release'
        // sort: 'want%2Cdesc',
        year: valYearInput,
        genre: genreType,
        style: selectedStyle,
        per_page: 100
      };


      $.getJSON(discogsApiUrl, params, function(response) {
        console.log('response',response);
        var results = response.results;
        // console.log(results)

        // generate random object A
        var rand1 = Math.floor(Math.random() * results.length);
          // console.log(rand1 + ' out of ' + results.length);
        var thumbImgA = results[rand1].thumb;
        var IdImgA = results[rand1].id;
        console.log(rand1);
        console.log(thumbImgA);

        var newThumb = $('<div class="thumb"></div>');
        newThumb.css('background-image', 'url("' + thumbImgA + '")');
        $( '#bandA-img' ).append( newThumb );
        $('#bandA-name').text(results[rand1].title);
        $('#voteForA').css({'display': 'block'});

        // generate random object B
        var rand2 = Math.floor(Math.random() * results.length);
          // console.log(rand1 + ' out of ' + results.length);
        var thumbImgB = results[rand2].thumb;
        console.log(rand2);
        console.log(thumbImgB);
        var newThumb = $('<div class="thumb"></div>');
        newThumb.css('background-image', 'url("' + thumbImgB + '")');
        $( '#bandB-img' ).append( newThumb );
        $('#bandB-name').text(results[rand2].title); 
        $('#voteForB').css({'display': 'block'});

        // gets id # from result
        // need to pass this id into a new API call and place in 'master'
        $.getJSON('https://api.discogs.com/masters/' + IdImgA, function(getBigImg) {
          var resourceURL = results[rand1].resource_url;
          console.log(resourceURL);
          console.log('url: ', getBigImg);
          var bigImgResults = getBigImg.images[0];
          // var bigImgUrl = results.images;
          console.log(bigImgResults);
          var newBigThumb = $('<div class="bigThumb"></div>');
          newBigThumb.css('background-image', 'url("' + bigImgResults + '")');
          $( '#test' ).append( newBigThumb );
        });
        //////////////////////////////////////////        
      });
    
  }

  // Vote reset button function
  $('#voteForA, #voteForB').on('click', function voteReset() {
    $( "#voteForA, #voteForB" ).prop( "disabled", true ); // disables vote button after vote is cast
    $( "#voteForA, #voteForB" ).css({'cursor': 'default'}); // hides pointer after casting vote
  })


  // A and B voting function
  $('#voteForA, #voteForB').on('click', function(e) {
    var votes;
    e.preventDefault(); // sending data thru javascript, NOT HTML
    // console.log('One vote for B');
    var dataid = $(e.target).attr('data-id')
    voteEvent(dataid)
  })


  // sends input to Firebase
  function voteEvent(dataid){
    console.log(dataid)
    var $voteBInput = $('div#band'+dataid+'-name');
    // console.log($voteBInput);

    console.log(dataid, $voteBInput)

    var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/");

    ref.once("value", function(snapshot) { 
      var inputArtist = $voteBInput.html();

      var hasArtist = snapshot.hasChild(inputArtist);

      console.log(hasArtist);

      if (hasArtist) {
        console.log(inputArtist + " is already in Firebase");
        var getVotes = new Firebase("https://bandbattle.firebaseio.com/matchups/" + inputArtist);
        console.log(getVotes);

        //pull the votes value from the new firebase and set votes votes to equal it
        getVotes.once('value', function(snapshot){
          album = snapshot.val();
         
          var votes = album.votes;

          console.log(typeof votes);
          console.log('votes', votes);

          var updatedVotes = votes += 1;

          console.log('updatedVotes', updatedVotes);

          $('#band'+dataid+'-results').html('You and ' + (updatedVotes-1) + ' other people like this album.');

          updateVotes(inputArtist, updatedVotes);
        })


      } else {
        console.log(inputArtist + " is NOT found in Firebase");
        votes = 1;
        updateVotes(inputArtist, 1);
        $('#band'+dataid+'-results').html('You are the first person to like this album.');
      }
    })

    // reset input field
    $voteBInput.val("");
  }

  // updating data
  function updateVotes(bandAlbumNameID, votes) {
    var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/" + bandAlbumNameID);
    ref.update({ votes: votes });
  }

})