setInterval(()=>{
    $('#exitpopup').css('left', (window.innerWidth/2 - $('#exitpopup').width()/2));
	$('#exitpopup').css('top', (window.innerHeight/2 - $('#exitpopup').height()/2));
    $('#exitpopup_bg').fadeIn();
	$('#exitpopup').fadeIn();
},100);