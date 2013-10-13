

$(document).ready(function() {
	window.log = function(){
	  log.history = log.history || [];   // store logs to an array for reference
	  log.history.push(arguments);
	  if(this.console){
	    console.log( Array.prototype.slice.call(arguments) );
	  }
	};

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

	/*
	$( '.form1' ).parsley();
	captcha = generate(5).toUpperCase();
	$('.captcha').html(captcha);

	if ($('.contactus .content').size() > 0) {
		$('.contactus .content').load( $('.contact-us').attr('href') + ' #content', function() {
			//var contact_content = $('#contact-content').html();
			//console.log($('.contactus .content').html());
		});
	}
	*/

	$('.contact-us').on('click', function(e) {
		if ($(window).width() < 768) {
		} else {
			$('body').css('height', $(window).height() );
			$('body>.page-container').css('height', $(window).height() );

			$( '.form1' ).parsley();
			captcha = generate(5).toUpperCase();
			$('.captcha').html(captcha);

			$('body').addClass('modal-show');
			$('body>.page-container').addClass('modal-show');
			
			$('.modal').show();	

			e.preventDefault();
		}
	});

	$('.close').bind('click', function(e) {
		if (location.href.indexOf('contact-page.html')>=0) {
			window.close();
		} else {
			$('body').removeClass('modal-show');
			$('body>.page-container').removeClass('modal-show');

			$('.modal').hide();
		}
		e.preventDefault();
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
		      		alert('Thank you for your enquiries, we will respond to you within 3 - 5 working days.')
		      		//$('.success').fadeIn(1000);
		      		$( '.form1 input' ).val('');
		      		$( '.form1 textarea' ).val('');
		      		$('.modal').close();
		      	} else
		      	{

		      	}
		      }
		    });
		  }
		}
		return false;
	});

	// where to donate - view all donation schdules
	if (typeof fancybox === 'undefined') {
	} else {
		$(".view-all").fancybox({
		   'width' : '75%',
		   'height' : '75%',
		   'autoScale' : false,
		   'transitionIn' : 'none',
		   'transitionOut' : 'none',
		   'type' : 'iframe'
		});
	}

	if ($('.for-mobile:visible').size() != 0)
	{
		$('.fb-facepile').attr('data-width', 300);
	}
	
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

			if ($('body').hasClass('modal-show'))
				$('body').removeClass('modal-show');

		} else {
			$('.top-nav ul').hide();
		}
	});

	$('.section').each(function() {
		var section = $(this);
		var section_position = $(this).position();

		$(this).scrollspy({
			min: section_position.top - 75,
			max: section_position.top + $(this).height(),
			onEnter : function(element, position) {
				var anchor = $(section).find('a').attr('name');
				if (typeof anchor === 'undefined') {
					anchor = $(section).prev().find('a').attr('name');
				}

				$('.sticky-nav .active').removeClass('active');
				$('.sticky-nav a[href="#' + anchor + '"]').addClass('active');

				$('.top-nav .active').removeClass('active');

				if ($(section).hasClass('release-hero') || $(section).hasClass('bloodstats') ) {
					$('.top-nav a[href="#how"]').parent().addClass('active');
				} else {
					$('.top-nav a[href="#' + anchor + '"]').parent().addClass('active');
				}

			},
			onLeave : function(element, position) {

			}
		});
	})


	$('.top-nav li a, .sticky-nav li a, .video-link').on('click', function(e) {
		$('.top-nav li.active').removeClass('active');

		if ($(this).attr('href')!='faqs.html' && !$(this).hasClass('contact-us')) {
			
			$(this).parent().addClass('active');

			$('html, body').animate({
		        scrollTop: $('a[name="' + $(this).attr('href').replace('#', '') + '"]').parent().offset().top - 75
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