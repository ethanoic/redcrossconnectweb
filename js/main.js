
$(document).ready(function() {

	// mobile menu
	$('.menu').on('click', function(e) {
		if ($('.top-nav ul:visible').size() > 0)
			$('.top-nav ul').hide();
		else {
			$('.top-nav ul').show();
		}
		e.preventDefault();
	});

	// hide on click event in the menu
	$('.top-nav ul li a').on('click', function(e) {
		if ($('.for-mobile:visible').size() > 0)
			$('.top-nav ul').hide();
	});

	// faq expand answer
	$('.faqlist li label').on('click', function() {
		if ($(this).parent().find('div:visible').size() == 0)
			$(this).parent().find('div').show();
		else
			$(this).parent().find('div').hide();
	});

	// fancybox for contact us form
	// jQuery 1.9 has removed the `$.browser` property, fancybox relies on
	// it, so we patch it here if it's missing.
	// This has been copied from jQuery migrate 1.1.1.
	if ( !jQuery.browser ) {
	  var uaMatch = function( ua ) {
	    ua = ua.toLowerCase();

	    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
	      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
	      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
	      /(msie) ([\w.]+)/.exec( ua ) ||
	      ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
	      [];

	    return {
	      browser: match[ 1 ] || "",
	      version: match[ 2 ] || "0"
	    };
	  };

	  matched = uaMatch( navigator.userAgent );
	  browser = {};

	  if ( matched.browser ) {
	    browser[ matched.browser ] = true;
	    browser.version = matched.version;
	  }

	  // Chrome is Webkit, but Webkit is also Safari.
	  if ( browser.chrome ) {
	    browser.webkit = true;
	  } else if ( browser.webkit ) {
	    browser.safari = true;
	  }

	  jQuery.browser = browser;
	};

	// google map initialization
	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var click = 0;
	var start;
	var end;
	var markers = new Array();
	var infoWindow;
	var current_marker;

	var sgcenter = new google.maps.LatLng(1.378308,103.807899);
	
	var locations = [
		{ lat : 1.2809352, lng : 103.8375668 },
		{ lat : 1.4359454, lng : 103.7861284 },
		{ lat : 1.3001956, lng : 103.8477121 }
	];

	var mapProp = {
		center:sgcenter,
		zoom:11,
		panControl:true,
		zoomControl:true,
		mapTypeControl:true,
		scaleControl:true,
		overviewMapControl:true,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};

	var contentInfo1 =
	'<div class="info-content">'+
	'<div class="pull-left">'+
	'<img src="img/logo-sgredcross.png">'+
	'</div>'+
	'<div class="infowindow pull-right">'+
	'<p><b>Bloodbank@HSA</b><br/>'+
	'<br>Blood Services Group'+
	'<br>Health Sciences Authority (opposite Outram Park MRT Station)'+
	'<br>11 Outram Road'+
	'<br>Singapore 169078'+
	'</p>'+
	'</div>'+
	'</div>';

	var contentInfo2 =
	'<div class="info-content">'+
	'<div class="pull-left">'+
	'<img src="img/logo-sgredcross.png">'+
	'</div>'+
	'<div class="infowindow pull-right">'+
	'<p><b>Bloodbank@Woodlands</b><br/>'+
	'<br>900 South Woodlands Drive'+
	'<br>#05-07 Woodlands Civic Centre (opposite Causeway Point)'+
	'<br>Singapore 730900'+
	'</p>'+
	'</div>'+
	'</div>';

	var contentInfo3 =
	'<div class="info-content">'+
	'<div class="pull-left">'+
	'<img src="img/logo-sgredcross.png">'+
	'</div>'+
	'<div class="infowindow pull-right">'+
	'<p><b>Bloodbank@Dhoby Ghaut</b><br/>'+
	'<br>Dhoby Xchange'+
	'<br>11 Orchard Road'+
	'<br>#B1-05 to 09'+
	'<br>Singapore 238826'+
	'</p>'+
	'</div>'+
	'</div>';

	var setMarker = function (bank, map, contentInfo){
	  var marker = new google.maps.Marker({
	    position:bank,
	    icon:'img/red-cross.png'
	  });

	  marker.setMap(map);
	  markers.push(marker);

	  marker.infowindow = new google.maps.InfoWindow({
	    content: contentInfo,
	    maxWidth: 256
	  });

	  google.maps.event.addListener(marker, 'click', function() {
	    if (current_marker) {
	      current_marker.infowindow.close();
	    }
	    current_marker = marker;
	    marker.infowindow.open(map,marker);
	  });
	}

	var initialize = function ()
	{
	  directionsDisplay = new google.maps.DirectionsRenderer();

	  //var elementmap = $('.for-mobile:visible').size() != 0 ? document.getElementById("mobilemap") : document.getElementById("desktopmap");

	  map = new google.maps.Map(document.getElementById("mobilemap") ,mapProp);
	  directionsDisplay.setMap(map);

	  setMarker(new google.maps.LatLng(locations[0].lat, locations[0].lng), map, contentInfo1);
	  setMarker(new google.maps.LatLng(locations[1].lat, locations[1].lng), map, contentInfo2);
	  setMarker(new google.maps.LatLng(locations[2].lat, locations[2].lng), map, contentInfo3);

	  map = new google.maps.Map(document.getElementById("desktopmap") ,mapProp);
	  directionsDisplay.setMap(map);

	  setMarker(new google.maps.LatLng(locations[0].lat, locations[0].lng), map, contentInfo1);
	  setMarker(new google.maps.LatLng(locations[1].lat, locations[1].lng), map, contentInfo2);
	  setMarker(new google.maps.LatLng(locations[2].lat, locations[2].lng), map, contentInfo3);
	}

	google.maps.event.addDomListener(window, 'load', initialize);

	var zoomtoplace = function () 
	{
		if (current_marker) {
	      current_marker.infowindow.close();
	    }
		var i = parseInt($('#bloodbanklist').val());
		var selected_location = new google.maps.LatLng(locations[i].lat, locations[i].lng)
		map.setCenter(selected_location);
		current_marker = markers[i];
  		markers[i].infowindow.open(map, markers[i]);

	};

	$('#bloodbanklist').on('change', function() {
		zoomtoplace();
	});

	// methods for contact us form
	// captcha generation
	charset = "abcdefghijklmnopqrstuvwxyz0123456789";
	var generate = function(len) {
		var output = '';
		for(var i=0; i<len; i++) {
		   output += charset[ Math.floor(Math.random()*charset.length) ];
		}
	    return output;
	};

	captcha = generate(5).toUpperCase();
	$('.captcha').html(captcha);

	$('.contactus').load( "contact.html", function() {
		var contact_content = $('#contact-content').html();
		$('.contactus').html('');

		$(".contact-us").fancybox({
			'content' : contact_content,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'type' : 'html',
			afterShow: function(current, previous) {
				console.log('form open');
				captcha = generate(5).toUpperCase();

				$('.captcha').html(captcha);

				// Contact Form
				$( '.form1' ).parsley();

				$('.btn-reload').bind('click', function() {
					captcha = generate(5).toUpperCase();
					$('.captcha').html(captcha);
				});

				$("#contact-verify").focusout(function(){
					var verify_code = $("#contact-verify").val();
					if (verify_code.toUpperCase() == captcha ) {
						$('#verify_fail').hide();
						$('#contact-verify').removeClass('parsley-error').addClass('parsley-success');
					} else {
					  	$('#verify_fail').show();
					  	$('#contact-verify').addClass('parsley-error').removeClass('parsley-success');
					}
				});

				$('.btn-image').bind('click', function(){
					
					console.log('test');

					$( '.form1' ).parsley( 'validate' );
					var verify_code = $("#contact-verify").val();
					
					if (verify_code.toUpperCase() == captcha ) {
					  var name = $("#contact-name").val();
					  var email = $("#contact-email").val();
					  var phone = $("#contact-phone").val();
					  var subject = $("#contact-subject").val();
					  var message= $("#contact-message").val();
					  var dataString = 'name=' + name + '&email=' + email + '&phone=' + phone + '&subject=' + subject + '&message=' + message;

					  if ($( '.form1' ).parsley( 'validate' )) {
					    $.ajax({
					      type: "POST",
					      url: "app/app.php",
					      data: dataString,
					      success: function(data){
					      	console.log(data);
					      	if (data == 'result=0') {
					      		$('.success').fadeIn(1000);
					      		$( '.form1 input' ).val('');
					      		$( '.form1 textarea' ).val('');
					      	} else
					      	{

					      	}
					      }
					    });
					    //$.fancybox.close();
					  }
					}
					return false;
				});
			}
		});
	});

	// where to donate - view all donation schdules
	$(".view-all").fancybox({
	   'width' : '75%',
	   'height' : '75%',
	   'autoScale' : false,
	   'transitionIn' : 'none',
	   'transitionOut' : 'none',
	   'type' : 'iframe'
	});

	if ($('.for-mobile:visible').size() != 0)
	{
		$('.fb-facepile').attr('data-width', 300);
	}

	// blood stat
	maxwidth = $('html').css('max-width');
	if (maxwidth == '767px') {
		var chartsize = 70;
		var lineChartWidth = 8;
	} else {
		var chartsize = 110;
		var lineChartWidth = 15;
	}

	var setbloodstat_text = function(bloodpercent) {
		var text = '';
		switch (bloodpercent) {
			case '25' : 
				text = 'very<br/>low';
				break;
			case '50' : 
				text = 'low';
				break;
			case '75' : 
				text = 'healthy';
				break;
		}
		return text;
	};

	$.ajax({
	    type:"GET",
	    url: "app/app.php?method=bloodstat",
	    success: function(data){
	    	var bloodstat = data.split('-');

	    	// hard code for now until the php to google spreadsheet is fixed
	    	bloodstat[0] = '50';
	    	bloodstat[1] = '50';
	    	bloodstat[2] = '75';
	    	bloodstat[3] = '25';

	        $('.blood-a .chart').attr('data-percent', bloodstat[0]);
	        $('.blood-b .chart').attr('data-percent', bloodstat[1]);
	        $('.blood-o .chart').attr('data-percent', bloodstat[2]);
	        $('.blood-ab .chart').attr('data-percent', bloodstat[3]);

	        $('.blood-a .status label').html( setbloodstat_text(bloodstat[0]) );
	        $('.blood-b .status label').html( setbloodstat_text(bloodstat[1]) );
	        $('.blood-o .status label').html( setbloodstat_text(bloodstat[2]) );
	        $('.blood-ab .status label').html( setbloodstat_text(bloodstat[3]) );

	        $('.blood-a .chart').addClass( setbloodstat_text(bloodstat[0]).replace('<br/>','-') );
	        $('.blood-b .chart').addClass( setbloodstat_text(bloodstat[1]).replace('<br/>','-') );
	        $('.blood-o .chart').addClass( setbloodstat_text(bloodstat[2]).replace('<br/>','-') );
	        $('.blood-ab .chart').addClass( setbloodstat_text(bloodstat[3]).replace('<br/>','-') );

			$('.chart').easyPieChart({
				animate: 2000,
				lineWidth: lineChartWidth,
				barColor: '#c1272c',
				trackColor:'#e1e1e1',
				scaleColor: false,
				size: chartsize
			});


	    }
	});
	
	var path_parts = window.location.pathname.split('/');
	var path = '/';
	if (path_parts.length >= 2)
		path = path_parts[path_parts.length-2] + '/';

	var image_path = $('.site-share .st_sharethis_custom').attr('st_image');
	$('.site-share .st_sharethis_custom').attr('st_image', 'http://' + window.location.host + '/' + path + image_path);

	$( window ).resize(function() {
		// 768px breakpoint
		if ($(window).width() >= 768) {
			$('.top-nav ul').show();
		}
	});

});