
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


	// methods for contact us form
	// captcha generation
	
	var generate = function(len) {
		var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
		var output = '';
		for(var i=0; i<len; i++) {
		   	output = output + '' + charset.charAt( Math.floor(Math.random()*charset.length) );
		}
	    return output;
	};

	$('.modal .close').on('click', function() {
		$('body').removeClass('modal-show');
		$('.modal').hide();
	});

	$('.contactus .content').load( "contact.html?rn=" + Math.random()*100, function() {
		//var contact_content = $('#contact-content').html();

		$('.contact-us').on('click', function() {
			$('body').addClass('modal-show');
			$( '.form1' ).parsley();
			captcha = generate(5).toUpperCase();
			$('.modal').show();
		});

		captcha = generate(5).toUpperCase();

		$('.captcha').html(captcha);

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

		$('.btn-image').bind('click', function() {
			
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
			  }
			}
			return false;
		});


		/*
		$('.contactus').html('');

		$(".contact-us").fancybox({
			'content' : contact_content,
			'transitionIn' : 'none',
			'transitionOut' : 'none',
			'type' : 'html',
			afterShow: function(current, previous) {

				
			}
		});
		*/
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
		} else {
			$('.top-nav ul').hide();
		}
	});

	$('.section').each(function() {
		var section = $(this);
		var section_position = $(this).position();

		$(this).scrollspy({
			min: section_position.top,
			max: section_position.top + $(this).height(),
			onEnter : function(element, position) {
				var anchor = $(section).find('a').attr('name');
				if (anchor == undefined) {
					anchor = $(section).prev().find('a').attr('name');
				}
				console.log(anchor);

				$('.sticky-nav .active').removeClass('active');
				$('.sticky-nav a[href="#' + anchor + '"]').addClass('active');

				$('.top-nav .active').removeClass('active');
				$('.top-nav a[href="#' + anchor + '"]').parent().addClass('active');
			},
			onLeave : function(element, position) {

			}
		});
	})

	$('.top-nav li a, .sticky-nav li a').on('click', function(e) {
		$('.top-nav li.active').removeClass('active');

		if ($(this).attr('href')!='faqs.html' && !$(this).hasClass('contact-us')) {

			
			$(this).parent().addClass('active');

			$('html, body').animate({
		        scrollTop: $('a[name="' + $(this).attr('href').replace('#', '') + '"]').offset().top - 70
		    }, {
		    	duration: 500,
		    	specialEasing: 'easeInOutQuint'
		    });

		    e.preventDefault();
		}
		// scroll to the sections
	});

	$('.faq-category li a').on('click', function(e) {
		
		$('html, body').animate({
	        scrollTop: $('a[name="' + $(this).attr('href').replace('#', '') + '"]').offset().top - 50
	    }, {
	    	duration: 500,
	    	specialEasing: 'easeInOutQuint'
	    });

	    e.preventDefault();
		// scroll to the sections
	});

	$('.back-to-top').on('click', function(e) {
		$('html, body').animate({
	        scrollTop: 0
	    }, {
	    	duration: 500,
	    	specialEasing: 'easeInOutQuint'
	    });

	    e.preventDefault();
		// scroll to the sections
	});

});