// function to retrieve larger images
// goes in 'nonDupeNum(rand2)' function

     //gets id # from thumbnail results
     //passes this id into a new API call and places in 'master'
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