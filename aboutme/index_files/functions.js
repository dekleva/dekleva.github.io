jQuery(function($){
	'use strict';
	

	

	
	/****************************************
	Functions
	****************************************/
	var $body = $('body'),
		$window = $(window),
		$wrap = $('#wrap'),
		$container = $('#container'),
		G_hasAjax = false,
		G_homeTop = 0,
		G_oldUrl = window.location.href.replace(G_SITEURL, ''),
		G_backLink = '/',
		G_hasShistory = $('html').hasClass('no-history');

	$window.scrollTop(0);
	


	/*if ($body.hasClass('home')) {
		var $img1 = $( '<img src="'+$('#header .logo a').attr('href')+'/wp-content/themes/ok-rm/images/play.png">' );
		var $img2 = $( '<img src="'+$('#header .logo a').attr('href')+'/wp-content/themes/ok-rm/images/pulse.png">' );
	}*/

	if (!isMobile()) {
		$('.project-info').hide();
		$('#slider-container').height(window.innerHeight - 120);

		// $('#js-sub-menu-project').css({
		// 	'paddingLeft': $('#menu-main-navi .menu-projects').offset().left - 15
		// });

		// $('#js-sub-menu-about').css({
		// 	'paddingLeft': $('#menu-main-navi .menu-about').offset().left - 15
		// });
	} else {
		$('html').addClass('is-mobile');
	}
	
	/****************************************
	Loading
	****************************************/
	var loadingOpts = {
		lines: 11,
		length: 5,
		width: 2,
		radius: 6,
		corners: 1,
		rotate: 9,
		direction: 1,
		color: '#fff',
		speed: 1,
		trail: 35, 
		shadow: false,
		hwaccel: false,
		className: 'spinner',
		top: 'auto',
		left: 'auto'
	};
	
	var loadingOpts2 = {
		lines: 11,
		length: 5,
		width: 2,
		radius: 6,
		corners: 1,
		rotate: 9,
		direction: 1,
		color: '#000',
		speed: 1,
		trail: 35, 
		shadow: false,
		hwaccel: false,
		className: 'spinner',
		top: 'auto',
		left: 'auto'
	};


	var $loadingDom = $('#loading');
	var loading = new Spinner(loadingOpts).spin($loadingDom[0]);

	var $welcome = $('#welcome'),
		$welcomeBg = $welcome.find('.bg');
		
	var $sliderContainer = $('#slider-container'),
		$slider = $('#slider');
		
	var scrollDiv = document.createElement('div');
		scrollDiv.className = 'scrollbar-measure';
		document.body.appendChild(scrollDiv);

	var home_slider_index = 0;

	
	$('body').on('click', '#header a', function() {
		home_slider_index = 0;
	});

	var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	if (scrollbarWidth === 0) {
		$('html').addClass('noscrollbar');
	}


	if (typeof $welcomeBg !== 'undefined') {
		ReSetFontSize();
		$welcomeBg.addClass('show');
		$sliderContainer.height('auto');
		setTimeout(function () {
			// $container.imagesLoaded( function() {
				loading.stop();
				loading = new Spinner(loadingOpts2).spin($loadingDom[0]);
				$loadingDom.addClass('hide');
				$welcomeBg.height($welcome.height());

				$welcome.css({'position': 'relative','height':$welcome.height()}).animate({
						height: 0
					}, 800, function() {
						$body.addClass('end-loading');
						$welcome.remove();
						if (!isMobile()) {
							$sliderContainer.find('.project-info').fadeIn();
							// $sliderContainer.height('auto');
						}
				});
				
			// });
		}, 2500);
	}

	/****************************************
	Slider
	****************************************/
	function ReSliderSize() {
		//var _w = $sliderContainer.width() * .95;
		//var _h = $sliderContainer.height();

		var _w = window.innerWidth * .95;
		var _h = window.innerHeight - 106

		$('.bx-viewport').height(_h);

		if (_w/_h > 1.78) {
			$sliderContainer.find('.video-js').css({'height':_h,'width': _h*1.78 });
		} else {
			$sliderContainer.find('.video-js').css({'height':_w/1.78,'width':_w });
		}
	}

	$window.on('resize', function(){
		ReSliderSize();
		ReSetFontSize();
	});
	
	
	function SliderInit() {
		var inx = 0;

		if (G_homeTop === 0) {
			$('.cover-content').show();
		}
		
		$('.cover-content').click(function () {
			$(this).fadeOut(300);
		})

		var $readerContent = $('#js-more-content');
		var $sliderTitle = $('.slider-title h1');
		var hasChanges = false;
		$(document).on('click', '#js-reader-more', function () {
			var $but = $(this);
			if (!hasChanges) {
				hasChanges = true;
				if ($readerContent.hasClass('show')) {
					$readerContent.fadeOut(350, function () {
						$but.html('Read More');
						$readerContent.removeClass('show');
						$but.removeClass('show-sc');
						hasChanges = false;
					})
				} else {
					$readerContent.fadeIn(350, function () {
						$but.html('See Images');
						$readerContent.addClass('show');
						$but.addClass('show-sc');
						hasChanges = false;
					})
				}
			}
		})

		$sliderContainer = $('#slider-container'),
		$slider = $('#slider');
		
		var maxSlider = $sliderContainer.data('maxSlider')
		// var hasVideo = true;
		if ($container.find('.slider-title').length !== 0) {
			$container.find('.slider-title').fadeIn();
		}



		if ($('body').hasClass('home')) {
			if (home_slider_index !== 0) {
				$('#current-num').html(home_slider_index+1)
			}

			$slider.find('.item a').off('click');
			$slider.find('.item a').on('click', function() {
				if($(this).attr('href').indexOf(G_SITEURL) !== -1) {
					home_slider_index = ($(this).parents('.item').data('index') - 1);
				}
			});

			inx = home_slider_index;

		}

		$slider.bxSlider({
			mode: 'fade',
			speed: 300,
			//infiniteLoop: false,
			adaptiveHeight: true,
			//hideControlOnEnd: true,
			nextSelector: '#slider-next',
			prevSelector: '#slider-prev',
			nextText: '',
			prevText: '',
			startSlide: inx,
			onSlideAfter: function($slideElement, newIndex) {
				var index = $slideElement.data('index');
				
				
				if ($slideElement.hasClass('video') && !$slideElement.data('autoplay')) {
					$body.addClass('is-video-slide');
				} else {
					$body.removeClass('is-video-slide');
				}
				/*
				if (!$slideElement.hasClass('video') && hasVideo) {
					$sliderContainer.find('.video').each(function(){
						hasVideo = false;
						$(this).find('iframe').attr('src', $(this).find('iframe').attr('src'));
					});
				}
				*/
				
				$sliderContainer.find('.video').each(function(){
					// eval('videoPlayer_' + $(this).data('index')).currentTime(0).pause();
					videoPlayer[$(this).data('index')].currentTime(0).pause();
				});

				if ($slideElement.hasClass('video') && $('#js-video-' + index).data('autoplay') === true) {
					console.log('slider video autoplay');
					videoPlayer[index].play();
					$slideElement.addClass('autovideo');
				}
				
				$('#current-num').html(index);

				if (maxSlider == index) {
					$('#next-project-link').addClass('show-link');
				} else {
					$('#next-project-link').removeClass('show-link');
				}
				// if (current == total) {
				//     $('.bx-next').click(function(){
				// 		parent.history.back();
				// 		return false;
				// 	});
				// } 
			},
			onSliderLoad: function (argument) {
				$container.find('.video').each(function () {
					var index = $(this).data('index');
					videoPlayer[index] = videojs($container.find('#js-video-'+index)[0]);

					if (index !== 0) {
						setTimeout(function () {
							videoPlayer[index].pause();
						}, 1000);
					}
				});
				// console.log('slider reader');
				if (typeof videoPlayer[1] && !$('#js-video-1').data('autoplay')) {
					$body.addClass('is-video-slide');
				}

				if (typeof videoPlayer[1] === 'object' && $('#js-video-1').data('autoplay')) {
					console.log('slider video autoplay');
					setTimeout(function () {
						videoPlayer[1].play();
					}, 1000);
					
				}
			}
		});
		
		ReSliderSize();
	}
	
	SliderInit();
	
	var theEnd = false;
	
	$(document).on('click', '#slider-next a', function(){
		if (theEnd) {
			//alert('end')
			$('.slider-title > .noSet').trigger('click');
			theEnd = false;
		} else {
			if ($(this).hasClass('disabled')) {
				theEnd = true;
			}
		}
	});
	
	var isa = false;
	$(document).on('click', '.menu-item-archive', function() {
		if ($('body').hasClass('term-70')) {
			if (!isa) {
				isa = true;
				if ($('body').hasClass('active-image-menu')) {
					$('body').removeClass('active-image-menu');
					$('.sub-sub-menu-image').fadeOut(200, function() {
						$('.project-list').fadeIn(200, function(){
							isa = false;
						});
					});
				} else {
					$('body').addClass('active-image-menu');
					$('.project-list').fadeOut(200, function() {
						$('.sub-sub-menu-image').fadeIn(200, function(){
							isa = false;
						});
					});
				}
			}
		}
	});
	/****************************************
	Functions
	****************************************/
	function TestUrl(s) {
		return s.charAt(0) != "#"
			&& s.charAt(0) != "/"
			&& ( s.indexOf("//") == -1 
				|| s.indexOf("//") > s.indexOf("#")
				|| s.indexOf("//") > s.indexOf("?")
		);
	}
	
	function GetAjaxContent(ajaxurl) {
		G_oldUrl = ajaxurl;

		jQuery.ajax({ 
			url: ajaxurl + '?ajax=true', 
			type: 'GET', 
			dataType: 'html', 
			beforeSend: function() { 
				$loadingDom.fadeIn(); 
				/*
				$slider.find('img').each(function(){
					$(this).attr('src', '').hide();
				});
				*/
				
				/*
				if(window.stop !== undefined) {
					window.stop();
				}
				else if(document.execCommand !== undefined) {
					document.execCommand('Stop', false);
				}
				*/
			},
			success: function(data) { 
				HandleContent(data);
			}
		});
	}
	/*
	function GetVideo(videoId) {
		jQuery.ajax({ 
			url: 'https://api.vimeo.com/me/videos/'+ videoId +'/?access_token=d04a3bcde1600a405cc90377c90384a9',
			type: 'GET',
			beforeSend: function() {
			},
			success: function(data) { 
				// console.log (data.files[0].link)
				var $video = $('<video class="vjs-tech" poster="'+data.pictures[1].link+'"><source type="video/mp4" src="'+data.files[0].link+'"></source></video>')
			}
		});
	}
	
	
	GetVideo('107450556');*/
	
	function HandleContent(data) {
		var $html = $(data);

		$html.find('.js-go-back').attr('href', G_backLink);
		
		$('.sub-sub-menu-image').removeAttr('style');


		

		$container.fadeOut(500, function(){
			
			$body.attr('class','').addClass($html.data('bodyClass') + ' end-loading');
			UpdateCurrentMenuClass();

			if ($('body').hasClass('home')) {
				if (home_slider_index !== 0) {
					$html.find('#current-num').html(home_slider_index+1);
					$html.find('#js-item-' + (home_slider_index+1)).addClass('current');
				}
					
			}
			
			if ($body.hasClass('single-type_slide')) {
				$loadingDom.fadeOut();
			}
			
			$container.html($html).fadeIn(500, function() {
				
				/*if ($body.hasClass('single-type_slide')) {
					$container.find('.video').each(function () {
						//var videoPlayer_ = videojs("js-video-'.$index.'");
						var index = $(this).data('index');
						videoPlayer[index] = videojs($container.find('#js-video-'+index)[0]);
						if (index !== 0) {
							setTimeout(function () {
								videoPlayer[index].pause();
							}, 1000);
						}
					});
				}*/
				/*
				if ($body.hasClass('single-type_project')) {
					$container.find('.video').each(function(){
						var vindex = $(this).data('index');
						videoPlayer[vindex] = videojs($container.find('#js-video-'+vindex)[0]);
						
						if ($('#js-video-' + vindex).data('autoplay') === true) {
							videoPlayer[vindex].play();
						}
					});
				}
				*/
				SliderInit();
				$('body,html').animate({scrollTop : G_homeTop}, 300);
				G_hasAjax = false;
				$loadingDom.fadeOut(500, function () {
					if ($body.hasClass('home') && $container.find('video').length !== 0) {
						$container.find('video').each(function () {
							$(this)[0].play();
						});
					}
				});
				
			});
			
			if ($body.hasClass('single-type_project')) {
				$container.find('.video').each(function(){
					var vindex = $(this).data('index');
					videoPlayer[vindex] = videojs($container.find('#js-video-'+vindex)[0]);
					
					if ($('#js-video-' + vindex).data('autoplay') === true) {
						videoPlayer[vindex].play();
					}
				});
			}
		});
	}
	
	function UpdateCurrentMenuClass() {
		// jQuery('a[href="' + window.location.href + '"]').addClass('current-menu-item');
		$('.current-menu-item').removeClass('current-menu-item');
		if (G_oldUrl === '/') {
			$('.menu-case-studies').addClass('current-menu-item');
		} else {
			$('a[href="' + G_SITEURL + G_oldUrl + '"]').parents('.menu-item').addClass('current-menu-item');
		}
		
	}

	function isMobile() {
		var userData = navigator.userAgent,
		opts = /iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle/i;

		return opts.test(userData);
	}
	
	function iosResize() {
		var orientation = window.orientation;

		// Landscape mode
		if (orientation === 90 || orientation === -90){
			$sliderContainer.find('.video-js').css({'height':$slider.height(),'width':$slider.height()*1.78});
		} 
		// Portrait mode.
		else {
			setTimeout(function () {
				$sliderContainer.find('.video-js').css({'height':$slider.width()/1.78,'width':$slider.width()});
			}, 1000);
		}
	}
	
	function ReSetFontSize() {
		$welcomeBg.css("font-size", ($(window).width() ) / (30 * 1.2) + 'px');
	}
/*
	function ReSetFontSize() {
		$welcomeBg.css("font-size", ($(window).width() ) / (21 * 1.2) + 'px');
	}
*/
	/****************************************
	Bind Events
	****************************************/
	

	$(document).on('click', 'a', function() {
		
		// Scroll Top
		if ($(this).hasClass('back-to-top')) {
			$('body,html').animate({scrollTop : 0}, 500);
			return false;
		}
		
		if ($(this).hasClass('setTop')) {
			G_homeTop = $(this).offset().top;
		} else if ($(this).hasClass('noSet') || $(this).hasClass('bx-prev') || $(this).hasClass('bx-next')/* || $(this).attr('rel') === 'next'*/) {
			G_homeTop = G_homeTop;
		} else {
			G_homeTop = 0;
		}
		
		// Ajax
		var currentUrl = $(this).attr('href');


		if (!TestUrl(currentUrl) || (currentUrl.toLowerCase().indexOf(G_SITEURL) >= 0)) {
			
			if (TestUrl(currentUrl)) {
				currentUrl = currentUrl.replace(G_SITEURL, '');
			}
			
			if (G_oldUrl !== (G_SITEURL + currentUrl) && !G_hasAjax) {

				
				History.pushState({
					state: 1, 
					url: G_SITEURL + currentUrl
				}, 'OK-RM' , (G_SITEURL + currentUrl) );
				
				
				G_hasAjax = true;
			}
			return false;
		}



	});


	$(document).on('click', '.next-project-link', function(){
		$('.js-go-back').trigger('click');
		return false;
	})

	/****************************************
	Bind to State Change
	****************************************/
	History.Adapter.bind(window, 'statechange', function(){
		// console.log(History.getState().data.url)
		var u = History.getState().data.url;
		if (typeof u === 'undefined') {
			u = G_SITEURL;
		}

		G_backLink = G_oldUrl;
		// console.log(G_backLink)
		
		
		GetAjaxContent (u);
	});
	
	/****************************************
	Announcements
	****************************************/

	
	/****************************************
	Hacks
	****************************************/
	//Old IE
	if (G_hasShistory) {
		History.pushState(null, null, '/');
	}
	
	// IOS Resize
	if (isMobile()) {
		iosResize();

		setTimeout(function () {
			iosResize();
		}, 1000);
	}
	
	window.onorientationchange = function(){
		iosResize();
	}
});

window.paceOptions = {
	ajax: false, // disabled
	document: false, // disabled
	eventLag: false, // disabled
	elements: {
		selectors: ['#ajax-content']
	}
}

