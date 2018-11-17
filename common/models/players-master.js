'use strict';

var iterate =     function(obj, stack , playerData) {
	// console.log("obj inside iterate");
	// console.log(obj);
        for (var property in obj) {
            if (obj.hasOwnProperty(property) && !(property in playerData) ) {      


				if (obj[property] == null) {
					playerData[property] =  obj[property];
				}
				else if(Array.isArray(obj[property])){
					// console.log("array property is - " + property);
					playerData[property] = obj[property].join();
				}
				else if (typeof obj[property] == "object") {
					iterate(obj[property], stack + '.' + property, playerData);
				} else {

					if(property == 'full_name'){
						obj[property] = '<a href="#/app/playerdetail;p_id=' + obj["_id"] + ';seasons_data=2016;scope_data=Expected" >' + obj[property] + '</a>';
					}else if(typeof obj[property]==='number'){
					    obj[property]=Number(obj[property]);
					     if(parseInt(obj[property]) == obj[property]){
					        obj[property]=Number(obj[property]);
					    }
					    else if(parseFloat(obj[property]) == obj[property]){
					       obj[property]=Number(obj[property].toFixed(2));
					    }
					}else if( typeof obj[property] == 'string'){
							obj[property]= obj[property];
					}else{
						obj[property]= typeof obj[property];
					}
					playerData[property] =  obj[property];					
				}
            }
        }
    }

module.exports = function(Playersmaster) {


	Playersmaster.getListWithDetail = function(reqParams ,cb) {
		
		// console.log('reqParams.query');
		// console.log(reqParams.query);
		
		// console.log('reqParams.body');
		// console.log(reqParams.body);
		/*console.log('formParams');
		console.log(formParams);*/
		var requestParams = reqParams.query;
		var formParams = reqParams.body;

		var season = requestParams.season;
		var lc = requestParams.lc;
		var lca = requestParams.lca;
		var scope = requestParams.scope;
		var limitList = formParams.limitList ? formParams.limitList : requestParams.limitList;
		 var skipList = formParams.skipList? formParams.skipList : requestParams.skipList;
		 var userId = requestParams.userId;
		 var watchlist = requestParams.watchlist;
		 var shortlistId = requestParams.shortlistId;
		 var targetId = requestParams.targetId;
		 var needKeys = requestParams.needKeys;

		 if (typeof formParams.limitRecords !== 'undefined') {
		 	limitList = parseInt(formParams.limitRecords);
		 	skipList = parseInt(formParams.startRecords);
		 	//limitList += skipList;
		 }
		 

		var league_competition = lc;//"Football League";
		var league_competition_area = lca;//"Greece";
		var playerIds = [];
		var query = {};
		//query["PlayersStats.full_name"] = {"nin" : [0,"0","",null,"null"]};
		if(watchlist != '0'){
			var Watchlist = Playersmaster.app.models.Watchlist;
			Watchlist.find({
			    "where": {
			      "user_id": userId
			    }
			},
			  function(err, watchlists) {
			  	//console.log(err);
			  	//console.log(watchlists);
			  	watchlists.forEach(function(watchlistDetail){	
			  		//console.log(watchlistDetail);
							var player_id = watchlistDetail.player_id;	
							//console.log(player_id);					
							playerIds.push(player_id);
						});
			  	//console.log("in watchlist");
			  	if(typeof league_competition_area != 'undefined' && league_competition != 'All League'){
			  		query["PlayersStats.domestic_competition_name"] = league_competition;
			  		query["PlayersStats.domestic_competition_area_name"] = league_competition_area;
			  	}
			  	query["PlayersStats._id"] = { "inq" : playerIds};
					/*domestic_competition_name: league_competition,
		      		domestic_competition_area_name: league_competition_area,
		      		 _id: { "inq" : playerIds}
				};*/
			  	callApi(query, formParams, season,lc,lca,scope, limitList, skipList, needKeys  ,cb);
			});
		}else if(shortlistId != '0'){
			var Shortlistplayers = Playersmaster.app.models.ShortlistPlayers;
			Shortlistplayers.find({
			    "where": {
			      "shortlist_id": shortlistId
			    }
			},
			  function(err, shortlistplayers) {
			  	//console.log(err);
			  	//console.log(watchlists);
			  	shortlistplayers.forEach(function(shortlistplayer){	
			  		//console.log(shortlistplayer);
							var player_id = shortlistplayer.player_id;	
							// console.log(player_id);					
							playerIds.push(player_id);
						});
			  	// console.log("in shortlist");
			  	// console.log(playerIds);
			  	if(typeof league_competition_area != 'undefined'  && league_competition != 'All League'){
			  		query["PlayersStats.league.leagueName"] = league_competition;
			  		query["PlayersStats.league.area"] = league_competition_area;
			  	}
			  	query["PlayersStats._id"] = { "inq" : playerIds};
			  	/*var query = { 
					domestic_competition_name: league_competition,
		      		domestic_competition_area_name: league_competition_area,
		      		 _id: { "inq" : playerIds}
				};*/
			  	callApi(query, formParams,season,lc,lca,scope, limitList, skipList,  needKeys  ,cb);
			});
		}else if(targetId != '0'){
			//console.log('inside target');
			var Targetplayers = Playersmaster.app.models.TargetPlayers;
			Targetplayers.find({
			    "where": {
			      "target_id": targetId
			    }
			},
			  function(err, targetplayers) {
			  	/*console.log(err);
			  	console.log(targetplayers);*/
			  	targetplayers.forEach(function(targetplayer){	
			  		//console.log(targetplayer);
							var player_id = targetplayer.player_id;	
							//console.log(player_id);					
							playerIds.push(player_id);
						});
			  	// console.log("in target");
			  	// console.log(playerIds);
			  	if(typeof league_competition_area != 'undefined'  && league_competition != 'All League'){
			  		query["PlayersStats.league.leagueName"] = league_competition;
			  		query["PlayersStats.league.area"] = league_competition_area;
			  	}
			  	query["PlayersStats._id"] = { "inq" : playerIds};
			  	/*var query = { 
					domestic_competition_name: league_competition,
		      		domestic_competition_area_name: league_competition_area,
		      		 _id: { "inq" : playerIds}
				};*/
			  	callApi(query, formParams,season,lc,lca,scope, limitList, skipList, needKeys  ,cb);
			});
		}else{
			if(typeof league_competition_area != 'undefined'  && league_competition != 'All League'){
			  		query["PlayersStats.league.leagueName"] = league_competition;
			  		query["PlayersStats.league.area"] = league_competition_area;
			  	}
			  	
			/*var query = { 
				domestic_competition_name: league_competition,
	      		domestic_competition_area_name: league_competition_area
			};*/
			callApi(query, formParams, season,lc,lca,scope, limitList, skipList ,  needKeys ,cb);
		}
		//console.log(playerIds);

	}

	function callApi(query, formParams, season,lc,lca,scope, limitList, skipList , needKeys ,cb){
		
		limitList = parseInt(limitList);
		skipList = parseInt(skipList);

		switch (scope.toLowerCase()){
			case 'universal':
				scope = 'International';
				break;

			case 'expected':
				scope = 'Expected';
				break;

			case 'domestic':
				scope = 'Domestic';
				break;

			default:
				scope = 'Expected';
		}


		// console.log(formParams);
		if(typeof formParams['columns'] != 'undefined'){
			var searchColumns = formParams['columns'];
			searchColumns.forEach(function(searchColumn){
				/** Check if the value is type of range **/
				var searchColumnValue = searchColumn.search.value; 
				if(searchColumnValue.indexOf('yadcf_delim') > 0){
					var searchColumnValues = searchColumnValue.split('-yadcf_delim-');
					var gteVal = 0; 
					var lteVal = 0; 
					if(searchColumnValues[0] && searchColumnValues[1]){
						gteVal = parseInt(searchColumnValues[0]);
						lteVal = parseInt(searchColumnValues[1]);
						var searchColumnName = searchColumn.name;
						if(searchColumnName.indexOf('at_') >= 0){
							if(typeof query['Players' + scope + 'Attribute.'+searchColumnName] == 'undefined'){
								query['Players' + scope + 'Attribute.'+searchColumnName] = {};
							}
							query['Players' + scope + 'Attribute.'+searchColumnName] = {
								"between" : [gteVal, lteVal ]
							}
						}else{
							if(typeof query['PlayersStats.'+searchColumnName] == 'undefined'){
								query['PlayersStats.'+searchColumnName] = {};
							}
							query['PlayersStats.'+searchColumnName] = {
								"between" : [gteVal, lteVal ]
							}	
						}
					}					
									
				}else{
					if(typeof query['PlayersStats.'+searchColumn.name] == 'undefined'){
						query['PlayersStats.'+searchColumn.name] = {};
					}
					query['PlayersStats.'+searchColumn.name] = new RegExp("" + searchColumnValue , 'i')  
				}

			});
		}
		console.log(JSON.stringify(query));
		var PlayersModel;
		console.log("season - " + season);
		switch (season){
			case '2015':
				PlayersModel = Playersmaster.app.models.Players2015;
				break;
			case '2016':
				PlayersModel = Playersmaster.app.models.Players2016;
				break;
			case '2017':
				PlayersModel = Playersmaster.app.models.Players2017;
				break;
			default:
				PlayersModel = Playersmaster.app.models.Players2015;
				break;
		}


		var filterObject = {};
		filterObject["where"] = query;

		var totalRecords = 0;
	    PlayersModel.count(query, function(err, count) {
		  console.log("here in count - " + count); 
		  totalRecords = count;
		});

		console.log("totalRecords above - " + totalRecords);

		var fieldsArr = ['_id'];
		fieldsArr.push('PlayersStats');
		fieldsArr.push('Players' + scope + 'Attribute');

		filterObject["fields"] = fieldsArr;

		var sortObject = {};
		if(typeof formParams.sortColumnName != 'undefined'){


			var sortColumnName = formParams.sortColumnName;
			var sortColumnDir = parseInt(formParams.sortColumnDir);


			if(sortColumnName.indexOf('at_') >= 0){
				sortColumnName = 'Players' + scope + 'Attribute.'+sortColumnName ;
				
			}else{
				sortColumnName = 'PlayersStats.'+sortColumnName;
			}

			if(sortColumnDir == '1'){
				sortColumnDir = 'ASC';
			}else{
				sortColumnDir = 'DESC';
			}

		}else{
			var sortColumnName = 'PlayersStats.assists';
			var sortColumnDir = 'DESC';
		}

		sortObject = sortColumnName + ' ' + sortColumnDir;
		filterObject["order"] = sortObject;

		filterObject["limit"] = limitList;

		filterObject["skip"] = skipList;


		

		console.log(filterObject);

		PlayersModel.find(filterObject,function(err, res) {
			if (err){
				console.log(err);
				cb(null, err);
			}else{
				//console.log(res);
				console.log("totalRecords - " + totalRecords);
				var searchResponse = [];
				res.forEach(function(playerDetails){	
					
					var playerData = {};
					/*if(needKeys == '1'){
						var playerData = {};
					}else{
						var playerData = [];
					}*/
											
					iterate(playerDetails, '' , playerData);

					 var keysToRemove = [0,1,2,3,4,5,6,7,8,"__persisted","__strict","__dataSource"];

					//  var playerKeys = Object.keys(playerData);
					//  console.log("playerKeys");
					//  console.log(playerKeys);
var arrayLength = keysToRemove.length;
var keyToRemove = '';
					for (var i = 0; i < arrayLength; i++) {
					    keyToRemove = keysToRemove[i];
					    //Do something
					    if(keyToRemove in playerData ){
							delete playerData[keyToRemove];
						}
					}


					var playerDataSorted = {
						"_id" : playerData["_id"],
						"id" : playerData["id"],
						"name" : playerData["name"],
						"full_name" : playerData["full_name"]
					};

					var keyToRemoveSorted = '';
					var keysToRemoveSorted = ["_id","id","name","full_name"];
					for (var i = 0; i < arrayLength; i++) {
					    keyToRemoveSorted = keysToRemoveSorted[i];
					    delete playerData[keyToRemoveSorted];
					}
					
					Object.keys(playerData)
				      .sort()
				      .forEach(function(v, i) {

				          playerDataSorted[v] = playerData[v];
				       });

					

					

					if(needKeys == '0'){
						var numeric_array = [];
						for (var items in playerDataSorted){
							console.log(items + " -> " + playerDataSorted[items]);
						    numeric_array.push( playerDataSorted[items] );
						}
						// numeric_array.shift();
						searchResponse.push(numeric_array);
					}else{
						searchResponse.push(playerDataSorted);
					}
				});

				var returnResponse = {
				  "draw": Math.floor(Date.now() / 1000),
				  "recordsTotal": totalRecords,
				  "recordsFiltered": totalRecords,
				  "data": searchResponse
				}

				cb(null, returnResponse);
				
			}
		});
	}



  Playersmaster.remoteMethod(
    'getListWithDetail', {
      http: [
	      {
	        path: '/getListWithDetail',
	        verb: 'get',        
	      },
	      {
	        path: '/getListWithDetail',
	        verb: 'post',        
	      }
      ],
      accepts: [
	      { 
	      	arg: 'reqParams',
	      	type: 'object',
	      	http: { source: 'req' }
	      }
      ],
      returns: {
        root: true,
        type: 'object'
      }
    }
  );

};

// ,
// 	      { 
// 	      	arg: 'formParams',
// 	      	type: 'object',
// 	      	http: { source: 'body' }
// 	      }