'use strict';

module.exports = function(Watchlist) {

	Watchlist.deleteFromWatchlist = function(data,cb) {


console.log(data.dataToRemove);
		var query = { 
					user_id: data.dataToRemove[0].user_id,
		      		player_id: { inq : data.dataToRemove[0].players}
				};
//Watchlist.getDataSource().connector.connect(function (err, db) {
	//	db.collection("watchlist").remove(query, function(err, res) {
		Watchlist.destroyAll(query, function(err, res) {
		  // removed matching products
		  			if (err){
						console.log(err);
						cb(null, '0');
					}else{
						 //console.log(res.result.n + " document(s) deleted");
						cb(null, '1');
					}
		});

	// });
}

	Watchlist.remoteMethod(
    'deleteFromWatchlist', {
	    accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
	    returns: {arg: 'result', type: 'string', root: true},
	    http: {path: '/deleteFromWatchlist', verb: 'post'}, 
	}
  );

};
