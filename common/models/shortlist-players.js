'use strict';

module.exports = function(Shortlistplayers) {

	Shortlistplayers.deleteFromShortlist = function(data,cb) {


console.log(data.dataToRemove);
		/*var query = { 
					shortlist_id: data.dataToRemove[0].shortlist_id
		      		//player_id: { $in : data.dataToRemove[0].players}
				};*/

				/*var data = {"dataToRemove":[{
    "shortlist_id": "59b437250494ef0012c70b57",
    "players": ["1035312016","1102772016"]
}]}*/

				var query = { 
					shortlist_id: data.dataToRemove[0].shortlist_id,
		      		player_id: { inq : data.dataToRemove[0].players}
				};
// Shortlistplayers.getDataSource().connector.connect(function (err, db) {
		// db.collection("shortlist_players").deleteMany(query, function(err, res) {
		Shortlistplayers.destroyAll(query, function(err, res) {
		  // removed matching products
		  			if (err){
						console.log(err);
						cb(null, '0');
					}else{
						// console.log(res.result.n + " document(s) deleted");
						cb(null, '1');
					}
		});

	// });
}

	Shortlistplayers.remoteMethod(
    'deleteFromShortlist', {
	    accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
	    returns: {arg: 'result', type: 'string', root: true},
	    http: {path: '/deleteFromShortlist', verb: 'post'}, 
	}
  );
};
