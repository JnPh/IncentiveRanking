var SWroot = 'http://famille.mazet.free.fr/FG/SW/dev/';

var TabletManagement =
{

   LoadTabletEventData: function(mainlistview, playerlistview)
		{       
     		$(mainlistview).empty();
    		 $.each(app.CurrentEventsCollection, function(i, row) {
		        if(row.data.ev_id == app.CurrentEventId) {
            		$(mainlistview).append('<li>Date : ' + row.data.ev_date +'</li>');
            		$(mainlistview).append('<li>Heure : ' + row.data.ev_heure +'</li>');
            		$(mainlistview).append('<li>Lieu: '+row.data.ev_lieu+'</li>');
            		$(mainlistview).append('<li>Type: '+row.data.ev_type+'</li>');
            		$(mainlistview).append('<li>Info : '+row.data.ev_desc +'</li>');   
            		             
            		$(mainlistview).listview('refresh');    
            		
            		TabletManagement.GetParticipants(app.CurrentEventId, playerlistview );        
        		}
    		});   
		},
			
	GetParticipants: function(event, playerlistview)
		{

			var url = SWroot,
        	service = 'participantsevent.php?e=' + event;
            
      		console.log(url + service );        
               
     		$.ajax({
     		   	url: url + service ,
     		   	dataType: "jsonp",
     		   	async: true,
     		   	success: function (result) {
			
     		   	    TabletManagement.parseParticipants(result, playerlistview); 
     		   	  
     		   },
     		   error: function (request,error) {
  		
     		       console.log('Network error has occurred please try again!');
     		       console.log(arguments);
     		       console.log(error);
     		       console.log(request.stringify); 
     		      
     		   }
    		}); 
    	}, 
    	
    parseParticipants:function(result, playerlistview)
		{ 
    		eval(result); 
        
         	$(playerlistview).empty();
          	$(playerlistview).append('<li data-role="list-divider">Participants ('+ result.length +')</li>');
        
        	$.each(result, function(i, row) {
            
            	$(playerlistview).append('<li class="staticlist"><img src="' +row.data.jou_photo+'"/>' +row.data.jou_prenom+'</li>');
    
        	});
        
       		$(playerlistview).listview('refresh'); 
         
    	},
    	
    LoadTabletPlayerData: function(mainlistview)
		{      
    		
    		$(mainlistview).empty();
    		$.each(app.CurrentPlayersCollection, function(i, row) {
		        if(row.data.jou_id == app.CurrentPlayerId) {
		       
            			$(mainlistview).append('<img class="playerdetails" src="'+ row.data.jou_photo.toString().replace("150","300") +'">');
            			$(mainlistview).append('<li>Nom: '+row.data.jou_nom+'</li>');
            			$(mainlistview).append('<li>Prenom: '+row.data.jou_prenom+'</li>');
            			$(mainlistview).append('<li>Position : '+row.data.jou_position +'</li>');   
            			$(mainlistview).append('<li>Points implication : '+row.data.points+'</li>');             
            			$(mainlistview).append('<li>Progession : '+row.data.delta+'</li>');
            			$(mainlistview).listview('refresh');            
       				 }
    			});   
			}  
		
}


var HomePage = 
{

	InitListeners: function()
		{
			//Load Data
			$(document).on('pagebeforeshow', '#home', HomePage.LoadData);
			
			//Clic Joueur
			$(document).on('click', '#joueur-list li a', function(event){  
  			
  			//Id du joueur pour lequel afficher la fiche
    		HomePage.joueurInfo.id = $(this).attr('data-id');
    		app.CurrentPlayerId = HomePage.joueurInfo.id ;
    		app.CurrentPlayersCollection = HomePage.joueurInfo.result;
    
     		if(window.styleMedia.matchMedium("screen and (max-width: 1023px)")){
  					$(":mobile-pagecontainer").pagecontainer("change", "#playerdetails", { transition: "slide" });
    			}
    			else 
    			{
    				$('#eventplayerslist').empty();
    				TabletManagement.LoadTabletPlayerData('#tabletpanel');   
    			}    
			});
			
			
			//Clic Prochainement
			$(document).on('click', '#whatsnext li a', function(e){  
    
	    	HomePage.eventInfo.id = $(this).attr('data-id');
			app.CurrentEventId = HomePage.eventInfo.id;
			app.CurrentEventsCollection = HomePage.eventInfo.result;
			
			if(window.styleMedia.matchMedium("screen and (max-width: 1023px)")){
  				$(":mobile-pagecontainer").pagecontainer("change", "#eventdetails", { transition: "slide" });
    		}
     		else TabletManagement.LoadTabletEventData('#tabletpanel', '#eventplayerslist');
    
			});

			
		},
	
	LoadData: function() 
		{


			// Get ranking info.
    		var url = SWroot,
    		    service = 'joueurs.php';
    		           
    		          
    		           
    		 $.ajax({
    		    url: url + service ,
    		    dataType: "jsonp",
    		    async: true,
    		    
    		    success: function (result) {
    		        
    		        HomePage.parseRank(result);
    		      
    		    },
    		    error: function (request,error) {
    		    
    		        console.log('Network error has occurred please try again!');
    		        console.log(arguments);
    		        console.log(error);
    		          console.log(request.stringify); 
    		          
    		       
    		    }
    		});  
    		
  		
    		// Get What's next info.
    		
    		service = 'whatsnext.php';
    		
    		console.log(url + service );        
    		           
    		 $.ajax({
    		    url: url + service ,
    		    dataType: "jsonp",
    		    async: true,
    		    
    		    success: function (result) {
    		        
    		        HomePage.parseWNext(result);
    		      
    		    },
    		    error: function (request,error) {
    		    
    		        console.log('Network error has occurred please try again!');
    		        console.log(arguments);
    		        console.log(error);
    		          console.log(request.stringify); 
    		          
    		       
    		    }
    		});  
    
	},

	joueurInfo:
		{
    		id : null,
    		result : null
		},

	eventInfo: 
		{
    		id : null,
    		result : null
    	},
    	
    parseRank:function(result)
    	{ 
    		eval(result); 
        	this.joueurInfo.result = result;
        	
        	$('#joueur-list').empty().append('<li data-role="list-divider" >Classement MVP</li>');
        	$.each(result, function(i, row) {
        	    //console.log(JSON.stringify(row));
        	    
        	    $rankdelta = "";
        	    
        	    if (row.data.delta > 0) $rankdelta = "<img src='img/rank_up.png'/> (+" + row.data.delta + ")" ;
				else if (row.data.delta < 0) $rankdelta = "<img src='img/rank_down.png'/>(" + row.data.delta + ")" ;
        	      
        	    $('#joueur-list').append('<li><a href="" data-id="' + row.data.jou_id + '"><img src="' +row.data.jou_photo+'"/>' +  row.data.cur_rank + ". " + row.data.jou_prenom + '<p>'+ $rankdelta +'</p>' + '<span class="ui-li-count">'+row.data.points+' pts</span></a></li>');
        	});
        	$('#joueur-list').listview('refresh');
      
      		//sorting players list for future use by index
      		this.joueurInfo.result.sort(function(a, b){return a.data.jou_id - b.data.jou_id});
   		 },
    
    parseWNext:function(result)
    	{ 
    	
    		eval(result); 
    		this.eventInfo.result = result;
        	var str;
        	$.each(result, function(i, row) {
        	        
        	    str = '<li data-role="list-divider"> Prochainement : ' +  row.data.ev_date + '</li>'
        	    str = str.concat('<li><a href="" data-id="'+ row.data.ev_id +'">');
        	    str = str.concat('<h3>' +  row.data.ev_type + '</h3>');
        	    str = str.concat('<p><strong>' + row.data.ev_desc + '</strong></p>');
        		str = str.concat('<p>' + 'Les Patriotes sont invités à participer à cet évènement' + '</p>');
        	    str = str.concat('<p class="ui-li-aside"><strong>'+row.data.ev_heure+'</strong></p>');   
   				str = str.concat('<span class="ui-li-count">+'+row.data.ev_bonus +' points</span></a></li>');
        	     
        	    $('#whatsnext').empty().append(str); 
        	});
        	$('#whatsnext').listview('refresh');
        	
        }
    
    
}

var SplashPage =
{
	InitListeners: function()
		{
			//Avoid going back to welcome/loading page
			$(document).on("pagecontainershow", function (e, ui) {
  			if (typeof ui.prevPage[0] !== "undefined" && ui.toPage[0].id == "splash") {
    			//Restart
    			SplashPage.CheckSupportedVersion();
  				}
			});
		},
		
	CheckSupportedVersion: function()
		{
			var url = SWroot,
    	    service = 'checkversion.php';
         
    	 	$.ajax({
    	    	url: url + service ,
    	    	dataType: "jsonp",
    	    	async: true,
    	    
    	    	success: function (result) {
    	        
    	       // $(".event.listening").hide();
    	        //SplashPage.parseVersion(result);
    	      	SplashPage.parseVersion(result);
    	    	
    	    	},
    	    	error: function (request,error) {
    	    
    	        console.log('Network error has occurred please try again!');
    	        console.log(arguments);
    	        console.log(error);
    	        console.log(request.stringify); 
    	       
    	    }
    	});  
		
		},
		
	parseVersion:function(result)
		{ 
    		
    		eval(result); 
        	var SupportedVersions="";
        	$.each(result, function(i, row) {
        	    SupportedVersions +=  row.data.version + ';';
        	});
        	
       	
        	 //Si la version est supporté on charge le data et on affiche la homepage
        	 if(SupportedVersions.indexOf(app.currentversion) > -1)
        	 {  
       		
				setTimeout(function () {
					$(':mobile-pagecontainer').pagecontainer('change', '#home', {
					transition: 'slideup'
	
					});
				  }, 2000);
    		  }
    		  else //Sinon on invite à ce mettre à jour
    		  {
    		    $(".event.listening").hide();
    		    $(".event.updaterequiered").show();
    		    alert("Veuillez mettre à jour votre application.");
    		  }
        
    	}
	
}

var EventDetailsPage =
{
	InitListeners: function()
		{
			$(document).on('pagebeforeshow', '#eventdetails', EventDetailsPage.FillinEventDetails); 
		},
					
	GetParticipants: function(event)
		{

			var url = SWroot,
        	service = 'participantsevent.php?e=' + event;
            
      		console.log(url + service );        
               
     		$.ajax({
     		   	url: url + service ,
     		   	dataType: "jsonp",
     		   	async: true,
     		   	success: function (result) {
			
     		   	    EventDetailsPage.parseParticipants(result); 
     		   	  
     		   },
     		   error: function (request,error) {
  		
     		       console.log('Network error has occurred please try again!');
     		       console.log(arguments);
     		       console.log(error);
     		       console.log(request.stringify); 
     		      
     		   }
    		}); 
    	}, 
    	
    FillinEventDetails: function()
		{
		 $('#event-data').empty();
		    $.each(app.CurrentEventsCollection, function(i, row) {
		        if(row.data.ev_id == app.CurrentEventId) {
		            $('#event-data').append('<li>Date : ' + row.data.ev_date +'</li>');
		            $('#event-data').append('<li>Heure : ' + row.data.ev_heure +'</li>');
		            $('#event-data').append('<li>Lieu: '+row.data.ev_lieu+'</li>');
		            $('#event-data').append('<li>Type: '+row.data.ev_type+'</li>');
		            $('#event-data').append('<li>Info : '+row.data.ev_desc +'</li>');   
		            $('#event-data').append('<li>Participation : <span class="ui-li-count">+'+row.data.ev_bonus +' points</span></li>');
		                         
		            $('#event-data').listview('refresh');   
		            EventDetailsPage.GetParticipants(app.CurrentEventId);          
		        }
		    });    
		},
	
	parseParticipants:function(result)
		{ 
    		eval(result); 
        
         	$('#event-players').empty();
          	$('#event-players').append('<li data-role="list-divider">Participants ('+ result.length +')</li>');
        
        	$.each(result, function(i, row) {
            
            	$('#event-players').append('<li class="staticlist"><img src="' +row.data.jou_photo+'"/>' +row.data.jou_prenom+'</li>');
    
        	});
        
       		$('#event-players').listview('refresh'); 
         
    	}
    	
   
}

var PlayerDetailsPage =
{
	InitListeners: function()
		{
			$(document).on('pagebeforeshow', '#playerdetails', PlayerDetailsPage.FillinPlayerDetails); 
		},
		
	FillinPlayerDetails: function(event)
		{
			
			$('#joueur-data').empty();
		    $.each(app.CurrentPlayersCollection, function(i, row) {
		        if(row.data.jou_id == app.CurrentPlayerId) {
		            $('#joueur-data').append('<img class="playerdetails" src="'+ row.data.jou_photo.toString().replace("150","300") +'">');
		            $('#joueur-data').append('<li>Nom: '+row.data.jou_nom+'</li>');
		            $('#joueur-data').append('<li>Prenom: '+row.data.jou_prenom+'</li>');
		            $('#joueur-data').append('<li>Position : '+row.data.jou_position +'</li>');   
		            $('#joueur-data').append('<li>Points implication : '+row.data.points+'</li>');             
		                     
		            $('#joueur-data').listview('refresh');            
		        }
		    });    
		}

}


var PracticeRankingPage = 
{

	InitListeners: function()
		{
			
			$(document).on('pagebeforeshow', '#practicesranking', PracticeRankingPage.LoadData); 
			
			//Clic Joueur
			$(document).on('click', '#practice-players-list li a', function(event){  
  			
  			//Id du joueur pour lequel afficher la fiche
    		PracticeRankingPage.joueurInfo.id = $(this).attr('data-id');
    		app.CurrentPlayerId = PracticeRankingPage.joueurInfo.id ;
    		app.CurrentPlayersCollection = PracticeRankingPage.joueurInfo.result;
    		
     		if(window.styleMedia.matchMedium("screen and (max-width: 1023px)")){
  					$(":mobile-pagecontainer").pagecontainer("change", "#playerdetails", { transition: "slide" });
    			}
    			else TabletManagement.LoadTabletPlayerData('#practice-tabletpanel');       
			});
			
		},
	
	LoadData: function() 
		{


			// Get ranking info.
    		var url = SWroot,
    		    service = 'ClassementPratiques.php';
    		           
    		          
    		           
    		 $.ajax({
    		    url: url + service ,
    		    dataType: "jsonp",
    		    async: true,
    		    
    		    success: function (result) {
    		        
    		        PracticeRankingPage.parseRank(result);
    		      
    		    },
    		    error: function (request,error) {
    		    
    		        console.log('Network error has occurred please try again!');
    		        console.log(arguments);
    		        console.log(error);
    		          console.log(request.stringify); 
    		          
    		       
    		    }
    		});  
    		
	},

	joueurInfo:
		{
    		id : null,
    		result : null
		},

	eventInfo: 
		{
    		id : null,
    		result : null
    	},
    	
    parseRank:function(result)
    	{ 
    		eval(result); 
        	this.joueurInfo.result = result;
        	
        	$('#practice-players-list').empty().append('<li data-role="list-divider" >Classement Pratiques</li>');
        	$.each(result, function(i, row) {
        	    //console.log(JSON.stringify(row));
        	    
        	    $rankdelta = "";
        	    
        	    if (row.data.delta > 0) $rankdelta = "<img src='img/rank_up.png'/> (+" + row.data.delta + ")" ;
				else if (row.data.delta < 0) $rankdelta = "<img src='img/rank_down.png'/>(" + row.data.delta + ")" ;
        	      
        	    $('#practice-players-list').append('<li><a href="" data-id="' + row.data.jou_id + '"><img src="' +row.data.jou_photo+'"/>' +  row.data.cur_rank + ". " + row.data.jou_prenom + '<p>'+ $rankdelta +'</p>' + '<span class="ui-li-count">'+row.data.points+' pts</span></a></li>');
        	});
        	$('#practice-players-list').listview('refresh');
      
      		//sorting players list for future use by index
      		this.joueurInfo.result.sort(function(a, b){return a.data.jou_id - b.data.jou_id});
   		 }
    
}

var MatchRankingPage = 
{

	InitListeners: function()
		{
			
			$(document).on('pagebeforeshow', '#matchranking', MatchRankingPage.LoadData); 
			
			//Clic Joueur
			$(document).on('click', '#match-players-list li a', function(event){  
  			
  			//Id du joueur pour lequel afficher la fiche
    		MatchRankingPage.joueurInfo.id = $(this).attr('data-id');
    		app.CurrentPlayerId = MatchRankingPage.joueurInfo.id ;
    		app.CurrentPlayersCollection = MatchRankingPage.joueurInfo.result;
    		
     		if(window.styleMedia.matchMedium("screen and (max-width: 1023px)")){
  					$(":mobile-pagecontainer").pagecontainer("change", "#playerdetails", { transition: "slide" });
    			}
    			else TabletManagement.LoadTabletPlayerData('#match-tabletpanel');       
			});
			
		},
	
	LoadData: function() 
		{


			// Get ranking info.
    		var url = SWroot,
    		    service = 'ClassementMatch.php';
    		           
    		          
    		           
    		 $.ajax({
    		    url: url + service ,
    		    dataType: "jsonp",
    		    async: true,
    		    
    		    success: function (result) {
    		        
    		        MatchRankingPage.parseRank(result);
    		      
    		    },
    		    error: function (request,error) {
    		    
    		        console.log('Network error has occurred please try again!');
    		        console.log(arguments);
    		        console.log(error);
    		          console.log(request.stringify); 
    		          
    		       
    		    }
    		});  
    		
	},

	joueurInfo:
		{
    		id : null,
    		result : null
		},

	eventInfo: 
		{
    		id : null,
    		result : null
    	},
    	
    parseRank:function(result)
    	{ 
    		eval(result); 
        	this.joueurInfo.result = result;
        	
        	$('#match-players-list').empty().append('<li data-role="list-divider" >Classement Match</li>');
        	$.each(result, function(i, row) {
        	    //console.log(JSON.stringify(row));
        	    
        	    $rankdelta = "";
        	    
        	    if (row.data.delta > 0) $rankdelta = "<img src='img/rank_up.png'/> (+" + row.data.delta + ")" ;
				else if (row.data.delta < 0) $rankdelta = "<img src='img/rank_down.png'/>(" + row.data.delta + ")" ;
        	      
        	    $('#match-players-list').append('<li><a href="" data-id="' + row.data.jou_id + '"><img src="' +row.data.jou_photo+'"/>' +  row.data.cur_rank + ". " + row.data.jou_prenom + '<p>'+ $rankdelta +'</p>' + '<span class="ui-li-count">'+row.data.points+' pts</span></a></li>');
        	});
        	$('#match-players-list').listview('refresh');
      
      		//sorting players list for future use by index
      		this.joueurInfo.result.sort(function(a, b){return a.data.jou_id - b.data.jou_id});
   		 }
    
}


var AllEventsPage = 
{

	InitListeners: function()
		{
			
			$(document).on('pagebeforeshow', '#allevents', AllEventsPage.LoadData); 
			
			//Clic Joueur
			$(document).on('click', '#events-list li a', function(event){  
  			
  			//Id du joueur pour lequel afficher la fiche
    		AllEventsPage.eventInfo.id = $(this).attr('data-id');
    		app.CurrentEventId = AllEventsPage.eventInfo.id ;
    		app.CurrentEventsCollection = AllEventsPage.eventInfo.result;
    		
     		if(window.styleMedia.matchMedium("screen and (max-width: 1023px)")){
  					$(":mobile-pagecontainer").pagecontainer("change", "#eventdetails", { transition: "slide" });
    			}
    			else TabletManagement.LoadTabletEventData('#allevents-tabletpanel','#allevent-playerslist');       
			});
			
		},
	
	LoadData: function() 
		{


			// Get ranking info.
    		var url = SWroot,
    		    service = 'yearevents.php';
    		           
    		          
    		           
    		 $.ajax({
    		    url: url + service ,
    		    dataType: "jsonp",
    		    async: true,
    		    
    		    success: function (result) {
    		        
    		        AllEventsPage.parseEvents(result);
    		      
    		    },
    		    error: function (request,error) {
    		    
    		        console.log('Network error has occurred please try again!');
    		        console.log(arguments);
    		        console.log(error);
    		        console.log(request.stringify); 
    		          
    		       
    		    }
    		});  
    		
	},

	joueurInfo:
		{
    		id : null,
    		result : null
		},

	eventInfo: 
		{
    		id : null,
    		result : null
    	},
    	
    parseEvents:function(result)
    	{ 
    	
    		eval(result); 
    		this.eventInfo.result = result;
        	var str="";
        	$.each(result, function(i, row) {
        	        
        	    str = str.concat('<li data-role="list-divider">' + row.data.ev_date + '</li>');
        	    str = str.concat('<li><a href="" data-id="'+ row.data.ev_id +'">');
        	    str = str.concat('<h3>' +  row.data.ev_type + '</h3>');
        	    str = str.concat('<p><strong>' + row.data.ev_desc + '</strong></p>');
        		str = str.concat('<p>' + 'Les Patriotes sont invités à participer à cet évènement' + '</p>');
        	    str = str.concat('<p class="ui-li-aside"><strong>'+row.data.ev_heure+'</strong></p>');   
   				str = str.concat('<span class="ui-li-count">+'+row.data.ev_bonus +' points</span></a></li>');
        	     
        	    
        	});
        	$('#events-list').empty().append(str); 
        	$('#events-list').listview('refresh');
        }
    	
    
    
}


var FutureEventsPage = 
{

	InitListeners: function()
		{
			
			$(document).on('pagebeforeshow', '#futureevents', FutureEventsPage.LoadData); 
			
			//Clic Joueur
			$(document).on('click', '#futureevents-list li a', function(event){  
  			
  			//Id du joueur pour lequel afficher la fiche
    		FutureEventsPage.eventInfo.id = $(this).attr('data-id');
    		app.CurrentEventId = FutureEventsPage.eventInfo.id ;
    		app.CurrentEventsCollection = FutureEventsPage.eventInfo.result;
    		
     		if(window.styleMedia.matchMedium("screen and (max-width: 1023px)")){
  					$(":mobile-pagecontainer").pagecontainer("change", "#eventdetails", { transition: "slide" });
    			}
    			else TabletManagement.LoadTabletEventData('#futureevents-tabletpanel','#futureevent-playerslist');      
			});
			
		},
	
	LoadData: function() 
		{


			// Get ranking info.
    		var url = SWroot,
    		    service = 'futureevents.php';
    		           
    		          
    		           
    		 $.ajax({
    		    url: url + service ,
    		    dataType: "jsonp",
    		    async: true,
    		    
    		    success: function (result) {
    		        
    		        FutureEventsPage.parseEvents(result);
    		      
    		    },
    		    error: function (request,error) {
    		    
    		        console.log('Network error has occurred please try again!');
    		        console.log(arguments);
    		        console.log(error);
    		        console.log(request.stringify); 
    		          
    		       
    		    }
    		});  
    		
	},

	joueurInfo:
		{
    		id : null,
    		result : null
		},

	eventInfo: 
		{
    		id : null,
    		result : null
    	},
    	
    parseEvents:function(result)
    	{ 
    	
    		eval(result); 
    		this.eventInfo.result = result;
        	var str="";
        	$.each(result, function(i, row) {
        	        
        	    str = str.concat('<li data-role="list-divider">' + row.data.ev_date + '</li>');
        	    str = str.concat('<li><a href="" data-id="'+ row.data.ev_id +'">');
        	    str = str.concat('<h3>' +  row.data.ev_type + '</h3>');
        	    str = str.concat('<p><strong>' + row.data.ev_desc + '</strong></p>');
        		str = str.concat('<p>' + 'Les Patriotes sont invités à participer à cet évènement' + '</p>');
        	    str = str.concat('<p class="ui-li-aside"><strong>'+row.data.ev_heure+'</strong></p>');   
   				str = str.concat('<span class="ui-li-count">+'+row.data.ev_bonus +' points</span></a></li>');
        	     
        	    
        	});
        	$('#futureevents-list').empty().append(str); 
        	$('#futureevents-list').listview('refresh');
        }
    	
    
    
}


// Init Listeners

HomePage.InitListeners();
SplashPage.InitListeners();
EventDetailsPage.InitListeners();
PlayerDetailsPage.InitListeners();
PracticeRankingPage.InitListeners();
MatchRankingPage.InitListeners();
AllEventsPage.InitListeners();
FutureEventsPage.InitListeners();





