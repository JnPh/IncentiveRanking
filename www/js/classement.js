var SWroot = 'http://famille.mazet.free.fr/FG/SW/1.0/';
 
function CheckSupportedVersion()
{



var url = SWroot,
        service = 'checkversion.php';
               
      console.log(url + service );        
               
     $.ajax({
        url: url + service ,
        dataType: "jsonp",
        async: true,
        
        success: function (result) {
            
            
            ajax.parseVersion(result);
          
        },
        error: function (request,error) {
        
            
            console.log('Network error has occurred please try again!');
            console.log(arguments);
            console.log(error);
            console.log(request.stringify); 
            alert("Vérification de version a échoué :(");
           
        }
    });  
    
}

function GetParticipants(event)
{

var url = SWroot,
        service = 'participantsevent.php?e=' + event;
            
      console.log(url + service );        
               
     $.ajax({
        url: url + service ,
        dataType: "jsonp",
        async: true,
        success: function (result) {

            ajax.parseParticipants(result); 
          
        },
        error: function (request,error) {
  
            console.log('Network error has occurred please try again!');
            console.log(arguments);
            console.log(error);
            console.log(request.stringify); 
           
        }
    });  
    
}


function LoadData() {

alert("LoadData");
// Get ranking info.
    var url = SWroot,
        service = 'joueurs.php';
               
      console.log(url + service );        
               
     $.ajax({
        url: url + service ,
        dataType: "jsonp",
        async: true,
        
        success: function (result) {
            
            ajax.parseRank(result);
          
        },
        error: function (request,error) {
        
            console.log('Network error has occurred please try again!');
            console.log(arguments);
            console.log(error);
              console.log(request.stringify); 
              alert("Récupération du classement a échoué :(");
           
        }
    });  
    
alert("whatsnext");    
    // Get What's next info.
    
    service = 'whatsnext.php';
    
    console.log(url + service );        
               
     $.ajax({
        url: url + service ,
        dataType: "jsonp",
        async: true,
        
        success: function (result) {
            
            ajax.parseWNext(result);
          
        },
        error: function (request,error) {
        
            console.log('Network error has occurred please try again!');
            console.log(arguments);
            console.log(error);
              console.log(request.stringify); 
              alert("Récupération du whatsnext a échoué :(");
           
        }
    });  
    
}

$(document).on('pagebeforeshow', '#headline', function()
{      
    $('#joueur-data').empty();
    $.each(joueurInfo.result, function(i, row) {
        if(row.data.jou_id == joueurInfo.id) {
            $('#joueur-data').append('<img class="playerdetails" src="'+ row.data.jou_photo.toString().replace("150","300") +'">');
            $('#joueur-data').append('<li>Nom: '+row.data.jou_nom+'</li>');
            $('#joueur-data').append('<li>Prenom: '+row.data.jou_prenom+'</li>');
            $('#joueur-data').append('<li>Position : '+row.data.jou_position +'</li>');   
            $('#joueur-data').append('<li>Points implication : '+row.data.points+'</li>');             
            $('#joueur-data').append('<li>Progession : '+row.data.delta+'</li>');           
            $('#joueur-data').listview('refresh');            
        }
    });    
} ); 

$(document).on('click', '#joueur-list li a', function(event){  
  
  	
  	
  	//Id du joueur pour lequel afficher la fiche
    joueurInfo.id = $(this).attr('data-id');
    
     if(window.styleMedia.matchMedium("screen and (max-width: 480px)")){
  $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
  
    }
    else LoadTabletJoueurData();
   
    
});


$(document).on('pagebeforeshow', '#event', function()
{      
    $('#event-data').empty();
    $.each(eventInfo.result, function(i, row) {
        if(row.data.ev_id == eventInfo.id) {
            $('#event-data').append('<li>Date : ' + row.data.ev_date +'</li>');
            $('#event-data').append('<li>Heure : ' + row.data.ev_heure +'</li>');
            $('#event-data').append('<li>Lieu: '+row.data.ev_lieu+'</li>');
            $('#event-data').append('<li>Type: '+row.data.ev_type+'</li>');
            $('#event-data').append('<li>Info : '+row.data.ev_desc +'</li>');   
                        
            $('#event-data').listview('refresh');   
            GetParticipants(eventInfo.id);          
        }
    });    
} ); 

$(document).on('click', '#whatsnext li a', function(e){  
    
    	eventInfo.id = $(this).attr('data-id');

		if(window.styleMedia.matchMedium("screen and (max-width: 480px)")){
  			$.mobile.changePage( "#event", { transition: "slide", changeHash: false });
    	}
     	else LoadTabletEventData();
    
});
   

var joueurInfo = {
    id : null,
    result : null
}

var eventInfo = {
    id : null,
    result : null
}

var ajax = {  
    parseRank:function(result){ 
    eval(result); 
        joueurInfo.result = result;
        $.each(result, function(i, row) {
            //console.log(JSON.stringify(row));
            
            $rankdelta = "";
            
            if (row.data.delta > 0) $rankdelta = "<img src='img/rank_up.png'/> (+" + row.data.delta + ")" ;
			else if (row.data.delta < 0) $rankdelta = "<img src='img/rank_down.png'/>(" + row.data.delta + ")" ;
              
            $('#joueur-list').append('<li><a href="" data-id="' + row.data.jou_id + '"><img src="' +row.data.jou_photo+'"/>' +  row.data.cur_rank + ". " + row.data.jou_prenom + '<p>'+ $rankdelta +'</p>' + '<span class="ui-li-count">'+row.data.points+' pts</span></a></li>');
        });
        $('#joueur-list').listview('refresh');
      
      //sorting players list for future use by index
      joueurInfo.result.sort(function(a, b){return a.data.jou_id - b.data.jou_id});
    },
    
    parseWNext:function(result){ 
    	
    	eval(result); 
    	eventInfo.result = result;
        var str;
        $.each(result, function(i, row) {
                
            str = '<li data-role="list-divider"> Prochainement : ' +  row.data.ev_date + '</li>'
            str = str.concat('<li><a href="" data-id="'+ row.data.ev_id +'">');
            str = str.concat('<h3>' +  row.data.ev_type + '</h3>');
            str = str.concat('<p><strong>' + row.data.ev_desc + '</strong></p>');
        	str = str.concat('<p>' + 'Les Patriotes sont invités à participer à cet évènement' + '</p>');
            str = str.concat('<p class="ui-li-aside"><strong>'+row.data.ev_heure+'</strong></p>');   
   			str = str.concat('</a></li>');
             
            $('#whatsnext').append(str); 
        });
        $('#whatsnext').listview('refresh');
        
    },
    
    parseVersion:function(result){ 
    	eval(result); 
        var SupportedVersions="";
        $.each(result, function(i, row) {
            SupportedVersions +=  row.data.version + ';';
        });
        
       
         //Si la version est supporté on charge le data et on affiche la homepage
         if(SupportedVersions.indexOf(app.currentversion) > -1)
         {  
			LoadData();
		
			setTimeout(function () {
				$(':mobile-pagecontainer').pagecontainer('change', '#home', {
				transition: 'slideup',
				changeHash: true,
				reverse: false,
				showLoadMsg: true
				});
			  }, 2000);
    	  }
    	  else //Sinon on invite à ce mettre à jour
    	  {
    	   
    	    $(".event.updaterequiered").show();
    	    alert("Veuillez mettre à jour votre application.");
    	  }
        
    },
    
    parseParticipants:function(result){ 
    	eval(result); 
        
         $('#event-players').empty();
          $('#event-players').append('<li data-role="list-divider">Participants ('+ result.length +')</li>');
        
        $.each(result, function(i, row) {
            
             $('#event-players').append('<li class="staticlist"><img src="' +row.data.jou_photo+'"/>' +row.data.jou_prenom+'</li>');
    
        });
        
       $('#event-players').listview('refresh'); 
         
    }
}
 
function LoadTabletJoueurData()
{      
    $('#tabletpanel').empty();
    $.each(joueurInfo.result, function(i, row) {
        if(row.data.jou_id == joueurInfo.id) {
            $('#tabletpanel').append('<li><img src="'+row.data.jou_photo+'"></li>');
            $('#tabletpanel').append('<li>Nom: '+row.data.jou_nom+'</li>');
            $('#tabletpanel').append('<li>Prenom: '+row.data.jou_prenom+'</li>');
            $('#tabletpanel').append('<li>Position : '+row.data.jou_position +'</li>');   
            $('#tabletpanel').append('<li>Points implication : '+row.data.points+'</li>');             
            $('#tabletpanel').append('<li>Progession : '+row.data.delta+'</li>');
            $('#tabletpanel').listview('refresh');            
        }
    });   
}    
function LoadTabletEventData()
{       
     $('#tabletpanel').empty();
    $.each(eventInfo.result, function(i, row) {
        if(row.data.ev_id == eventInfo.id) {
            $('#tabletpanel').append('<li>Date : ' + row.data.ev_date +'</li>');
            $('#tabletpanel').append('<li>Heure : ' + row.data.ev_heure +'</li>');
            $('#tabletpanel').append('<li>Lieu: '+row.data.ev_lieu+'</li>');
            $('#tabletpanel').append('<li>Type: '+row.data.ev_type+'</li>');
            $('#tabletpanel').append('<li>Info : '+row.data.ev_desc +'</li>');   
                         
            $('#tabletpanel').listview('refresh');            
        }
    });   
}

