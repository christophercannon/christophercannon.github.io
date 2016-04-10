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

      // reset img and text divs
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
          alert('nothing to return!');
        }

        // generate random object A /////////////////////////////////////////////////
        var rand1 = Math.floor(Math.random() * results.length);
        var thumbImgA = results[rand1].thumb;
        var linkImgA = ('http://discogs.com' + results[rand1].uri);
        console.log(rand1);
        console.log(thumbImgA);

        // if no image available, use generic img
        if(thumbImgA == '') {
          thumbImgA = 'img/default-release.png';
        }

        var newThumb = $('<div class="thumb"></div>');
        newThumb.css('background-image', 'url("' + thumbImgA + '")');
        $(newThumb).fadeOut(0).fadeIn(1500);
        $('#bandA-img').append( newThumb );
        $('#bandA-img').wrap( '<a href="' + linkImgA + '" target="_blank"></a>' );
        $('#bandA-name').fadeOut(0).fadeIn(1500);
        $('#bandA-name').html(results[rand1].title.replace(/ \([0-9]\)/g,'').replace(/ - /g,'<br><span class="albumName">') + '</span>')
            .attr('data-name' , results[rand1].title.replace(/[\\\/]/g,'')); 
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
          alert('Only one record returned. Try again.');
        }
        
        function nonDupeNum(rand2) {
          // generate random object B
          var thumbImgB = results[rand2].thumb;
          var linkImgB = ('http://discogs.com' + results[rand2].uri);
          console.log(rand2);
          console.log(thumbImgB);

          // if no image available, use generic img
          if(thumbImgB == '') {
            thumbImgB = 'img/default-release.png';
          }

          var newThumb = $('<div class="thumb"></div>');
          newThumb.css('background-image', 'url("' + thumbImgB + '")');
          $(newThumb).fadeOut(0).fadeIn(1500);
          $('#bandB-img').append( newThumb );
          $('#bandB-img').wrap( '<a href="' + linkImgB + '" target="_blank"></a>' );
          $('#bandB-name').fadeOut(0).fadeIn(1500);
          $('#bandB-name').html(results[rand2].title.replace(/ \([0-9]\)/g,'').replace(/ - /g,'<br><span class="albumName">') + '</span>')
            .attr('data-name' , results[rand2].title.replace(/[\\\/]/g,'')); 
          $('#voteForB').fadeOut(0).fadeIn(1500);
        }

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

  // updating data /////////////////////////////////////////////////
  function updateVotes(bandAlbumNameID, votes) {
    var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/" + bandAlbumNameID);
    ref.update({ votes: votes });
  }

})
