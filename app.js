$(document).ready(function() {
	
  var bandBattleData = new Firebase("https://bandbattle.firebaseio.com/");

  var myKey = '?key=WwxjcqYkafscMAPPikTJ';
  var mySecret = '&secret=uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ';

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

      // reset img and text divs
      $('#error').empty();
      $('#bandA-img, #bandB-img').empty();
      $('#bandA-name, #bandB-name').empty();
      $('#voteForA, #voteForB').css({'display': 'none'});
      $('#bandA-results, #bandB-results').empty();

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
        q: 'answer', // query empty, can get user input for refined search
        key: 'WwxjcqYkafscMAPPikTJ',
        secret: 'uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ',
        type:'master', // was 'release'
        // sort: 'want%2Cdesc',
        year: valYearInput,
        format: 'Vinyl',
        genre: genreType,
        style: selectedStyle,
        per_page: 100
      };

      $.getJSON(discogsApiUrl, params, function(response) {
        console.log('response',response);
        var results = response.results;
        // console.log(results);
        if(results == 0) {
          $('#error').html('No records in this style and year... try something else.');
        }

        // generate random object A /////////////////////////////////////////////////
        var rand1 = Math.floor(Math.random() * results.length);
        var thumbImgA = results[rand1].thumb;
        var linkImgA = ('http://discogs.com' + results[rand1].uri);
        console.log(rand1);
        console.log(thumbImgA);

        // get big images /////////////////////////////////////////////////
        // get big image A
        var resourceUrlA = results[rand1].resource_url;
        var idImgA = results[rand1].id;
        var bigImgAUrl = ('https://api.discogs.com/masters/' + idImgA + myKey + mySecret);
        console.log(bigImgAUrl);


        $.getJSON(bigImgAUrl, function(imgResponse) {
          console.log('response: ',imgResponse);

          // if no image available, use generic img
          if(typeof imgResponse.images != 'undefined') {
            var imgAResult = imgResponse.images[0].uri;
            console.log('Big img url A: ', imgAResult);
          } else {
            imgAResult = 'img/default-release-2.png';
          }

          var newThumb = $('<div class="thumb"></div>');
          newThumb.css('background-image', 'url("' + imgAResult + '")');
          $(newThumb).fadeOut(0).fadeIn(1500);
          $('#bandA-img').append( newThumb );
          $('#bandA-img').wrap( '<a href="' + linkImgA + '" target="_blank"></a>' );
          $('#bandA-name').fadeOut(0).fadeIn(1500);
          $('#bandA-name').html(results[rand1].title.replace(/ \([0-9]\)/g,'').replace(/ - /g,'<br><span class="albumName">') + '</span>').attr('data-name' , results[rand1].title.replace(/[\\\/]/g,'').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ' '));
          $('#voteForA').fadeOut(0).fadeIn(1500);

          // new function to avoid duplicate numbers
          function numCheck(n1) {
            var n2 = Math.floor(Math.random() * results.length);
            console.log(n1, n2);
            if(n1==n2) {
              numCheck(n1);
            } else {
              nonDupeNum(n2);
            }
          }

          // generate random object B /////////////////////////////////////////////////
          // checks for results array length
          if(results.length > 1) {
            numCheck(rand1);
          } else if(results.length == 1) {
            $('#error').html('Only one record returned... try something else.');
            $('#voteForA, #voteForB').css({'display': 'none'});
          }
          
          function nonDupeNum(rand2) {
            // generate random object B
            var thumbImgB = results[rand2].thumb;
            var linkImgB = ('http://discogs.com' + results[rand2].uri);
            console.log(rand2);
            console.log(thumbImgB);

            // get big image B
            var resourceUrlB = results[rand2].resource_url;
            var idImgB = results[rand2].id;
            var bigImgBUrl = ('https://api.discogs.com/masters/' + idImgB + myKey + mySecret);
            console.log(bigImgBUrl);

            $.getJSON(bigImgBUrl, function(imgResponse) {
              console.log('response: ',imgResponse);

              // if no image available, use generic img
              if(typeof imgResponse.images != 'undefined') {
                var imgBResult = imgResponse.images[0].uri;
                console.log('Big img url B: ', imgBResult);
              } else {
                imgBResult = 'img/default-release-2.png';
              }

              var newThumb = $('<div class="thumb"></div>');
              newThumb.css('background-image', 'url("' + imgBResult + '")');
              $(newThumb).fadeOut(0).fadeIn(1500);
              $('#bandB-img').append( newThumb );
              $('#bandB-img').wrap( '<a href="' + linkImgB + '" target="_blank"></a>' );
              $('#bandB-name').fadeOut(0).fadeIn(1500);
              $('#bandB-name').html(results[rand2].title.replace(/ \([0-9]\)/g,'').replace(/ - /g,'<br><span class="albumName">') + '</span>').attr('data-name' , results[rand2].title.replace(/[\\\/]/g,'').replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ' ')); 
              $('#voteForB').fadeOut(0).fadeIn(1500);
            });
          }
        });
      });
    
  }

  // Voting //////////////////////////////////////////////////////////
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


  // sends input to Firebase /////////////////////////////////////////////////
  function voteEvent(dataid){
    console.log(dataid)
    var $voteBInput = $('div#band'+dataid+'-name');
    // console.log($voteBInput);

    console.log(dataid, $voteBInput)

    var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/");

    ref.once("value", function(snapshot) { 
      var inputArtist = $voteBInput.attr('data-name');

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

          $('#band'+dataid+'-results').html('You and <span class="voteNum">' + (updatedVotes-1) + ' other people</span> like this album.');

          updateVotes(inputArtist, updatedVotes);
        })


      } else {
        console.log(inputArtist + " is NOT found in Firebase");
        votes = 1;
        updateVotes(inputArtist, 1);
        $('#band'+dataid+'-results').html('You are the <span class="voteNum">first person</span> to like this album.');
      }
    })

    // reset input field
    $voteBInput.val("");
  }

  // updating data /////////////////////////////////////////////////
  function updateVotes(bandAlbumNameID, votes) {
    var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/" + bandAlbumNameID);
    ref.update({ votes: votes });
  }

})
