'use strict';

module.exports = function(Targetplayers) {

	Targetplayers.deleteFromTarget = function(data,cb) {


console.log(data.dataToRemove);
		/*var query = { 
					target_id: data.dataToRemove[0].target_id
		      		//player_id: { $in : data.dataToRemove[0].players}
				};*/

				/*var data = {"dataToRemove":[{
    "target_id": "59b437250494ef0012c70b57",
    "players": ["1035312016","1102772016"]
}]}*/

				var query = { 
					target_id: data.dataToRemove[0].target_id,
		      		player_id: { inq : data.dataToRemove[0].players}
				};
// Targetplayers.getDataSource().connector.connect(function (err, db) {
		// db.collection("target_players").deleteMany(query, function(err, res) {
		Targetplayers.destroyAll(query, function(err, res) {
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

	Targetplayers.remoteMethod(
    'deleteFromTarget', {
	    accepts: { arg: 'data', type: 'object', http: { source: 'body' } },
	    returns: {arg: 'result', type: 'string', root: true},
	    http: {path: '/deleteFromTarget', verb: 'post'}, 
	}
  );
};
