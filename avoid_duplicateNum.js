// generate random object B
        var rand2 = numCheck(rand1);

        // new function to avoid duplicate numbers
        function numCheck(n1) {
          var n2 = Math.floor(Math.random() * results.length);
          console.log(n1, n2);
          if(n1==n2) {
            numCheck(n1);
          } else {
          return n2;}
        }
        console.log(rand2)