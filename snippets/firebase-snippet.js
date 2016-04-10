var ref = new Firebase("https://bandbattle.firebaseio.com/matchups/")

ref.on("value", function(res) { console.log(res.hasChild("Bongzilla - Stash")) } )
true

ref.on("value", function(res) { console.log(res.hasChild("Bongzilla - Sta")) } )
false