$(document).ready(function() {
	
  var bandBattleData = new Firebase("https://bandbattle.firebaseio.com/");

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
      $('#voteForA, #voteForB').css({'display': 'none'});

      // resets vote btn functionality on new matchup
      $( "#voteForA, #voteForB" ).prop( "disabled", false );
      $( "#voteForA, #voteForB" ).css({'cursor': 'pointer'});

      var params = {
        q: '', // query empty, can get user input for refined search
        key: 'WwxjcqYkafscMAPPikTJ',
        secret: 'uwErYCQYspUPCqzmwfdoLwHdflJQJjbQ',
        type:'master', // was 'release'
        // sort: 'want%2Cdesc',
        year: valYearInput,
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
        console.log(thumbImgB);
        var newThumb = $('<div class="thumb"></div>');
        newThumb.css('background-image', 'url("' + thumbImgB + '")');
        $( '#bandB-img' ).append( newThumb );
        $('#bandB-name').text(results[rand2].title); 
        $('#voteForB').css({'display': 'block'});         
      });
    
  }

  // Vote reset button function
  $('#voteForA, #voteForB').on('click', function voteReset() {
    $( "#voteForA, #voteForB" ).prop( "disabled", true ); // disables vote button after vote is cast
    $( "#voteForA, #voteForB" ).css({'cursor': 'default'}); // hides pointer after casting vote
  })

  // Vote functions
  // $('#voteForA').on('click', function() {
  //       console.log('One vote for A');
  //       var bandARef = bandBattleData.child("Matchup 1");
  //       bandARef.set({
  //         BandA: {
  //           record: "record title",
  //           votes: 1
  //         },
  //         BandB: {
  //           record: "record title",
  //           votes: 1
  //         }
  //       });
  //   })

  // Band B voting function
  // sends input to Firebase
  $('#voteForB').on('click', function(e) {
    var votes;
    e.preventDefault(); // sending data thru javascript, NOT HTML
    // console.log('One vote for B');

    var $voteBInput = $('div#bandB-name');
    console.log($voteBInput);

    var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/");

    ref.on("value", function(res) { 
      if(res.hasChild($voteBInput.text())) {
        console.log($voteBInput.text() + " is already in Firebase");
        votes = votes + 1;
      } else {
        console.log($voteBInput.text() + " is NOT found in Firebase");
        votes = 1;
      }
    })

    // console.log(bandBattleData.child('matchups').set())

    // bandBattleData.child('matchups').push({
    //   text: $voteBInput.text(),
    //   votes: votes + 1
    // })

    updateVotes($voteBInput.text(), votes);

    // reset input field
    $voteBInput.val("");
  })

  // reads messages from Firebase
  function getBandName() {
    bandBattleData.child('matchups').on('value', function(results) {
      $('#bandB-results').empty(); // prevents full list from being repeated on new input
      var values = results.val();

      for(var key in values) {
        console.log(values[key]);
        var bandAlbumName = values[key];
        var upvote = $('<button data-id="' + key + '">vote</button>');
        var container = $("<p>" + bandAlbumName.text + ", " + bandAlbumName.votes + " votes</p>");

        container.append(upvote);
        // or: upvote.appendTo(container);

        upvote.click(function() {
          console.log(bandAlbumName);
          var bandAlbumNameID = $(this).data('id');
          updateVotes(bandAlbumNameID, values[bandAlbumNameID].votes + 1);
        })

        // container.appendTo('#bandB-results');
      }
    })
  }

  // updating data
  function updateVotes(bandAlbumNameID, votes) {
    var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/" + bandAlbumNameID);
    ref.update({ votes: votes });
  }

  getBandName();

})