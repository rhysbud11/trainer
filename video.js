jQuery(document).ready(function ($) {

	function isMobile() {
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			return true;
		}
		else {
			return false;
		}
	}
	
	/* Video */
	
	$('#play-button').on('click', function(e) {
		
		var videoContainer = $('#video-container');
		
		videoContainer.prepend('<iframe src="https://player.vimeo.com/video/122085409?autoplay=1&title=0&byline=0&portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
		
		resizeToCover();
		
		videoContainer.css({'z-index':'9999','background':'#101010'}).fadeIn(300);
		
		
		$('#ditto-mobile').hide();
		$('#video-controls').fadeIn(900);
		$('#center-control').fadeOut(700);
		$('#down-arrow-container').css('z-index','999');
		e.preventDefault();
	});
	
	function bringCanvas() {
		$('#video-controls').fadeOut(300);
		$('#video-container').fadeOut(400, function() {
			$(this).html('').css({'z-index':-9999,'display':'none','background':'transparent'});
		});
		
		var windowWidth = $(window).width();
		
		$('#down-arrow-container').css('z-index','99999');
		
		if (windowWidth > 690) {
			$('#ditto-mobile').hide();
		}
		else {
			$('#ditto-mobile').fadeIn(200);
		}
	}
	$('#close-video').on('click', function(e) {
		bringCanvas();
		$('#center-control').fadeIn(200);
	});
	
	jQuery(function() { // runs after DOM has loaded
		
		jQuery(window).resize(function () { resizeToCover(); });
		jQuery(window).trigger('resize');
		
		//window.addEventListener("orientationchange", function() {resizeToCover();}, false);
	});

	function resizeToCover() {
		
		// Window Height - Nav
		if ($('.menu').css('display')!='none') {
			var menuHeight = $('.menu').height();
		}
		else {
			var menuHeight = $('.menu-mobile').height();
		}
		
		var targetHeight = jQuery(window).height() - menuHeight;
		
		// set the video viewport to the window size
		jQuery('#video-container').width(jQuery(window).width());
		jQuery('#video-container').height(targetHeight);
		
		var videoContainer = $('#video-container');
		var videoEmbed = videoContainer.find('iframe');
		
		if (videoEmbed.exists()) {
			videoEmbed.width(videoContainer.width())
			videoEmbed.height(videoContainer.height());
		}
	}
	
});

function resizeToCover() {
	
	var vidContainer = $(window);
	// set the video viewport to the window size
	jQuery('#vid-container').width(vidContainer.width());
	jQuery('#vid-container').height(vidContainer.height());
	
	// use largest scale factor of horizontal/vertical
	var scale_h = vidContainer.width() / vid_w_orig;
	var scale_v = vidContainer.height() / vid_h_orig;
	var scale = scale_h > scale_v ? scale_h : scale_v;
	//var scale = scale_h;
	
	// don't allow scaled width < minimum video width
	//if (scale * vid_w_orig < min_w) {scale = min_w / vid_w_orig;};
	
	// now scale the video
	jQuery('video').width(scale * vid_w_orig);
	jQuery('video').height(scale * vid_h_orig);
	
	jQuery('.video-filter').width(scale * vid_w_orig);
	jQuery('.video-filter').height(scale * vid_h_orig);
	
	// and center it by scrolling the video viewport
	jQuery('.vid-container').scrollLeft((jQuery('video').width() - vidContainer.width()) / 2);
	jQuery('.vid-container').scrollTop((jQuery('video').height() - vidContainer.height()) / 2);
	
};

function supportsVideo() {
	var elem = document.createElement('video'),
		bool = false;

	// IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
	try {
		if ( bool = !!elem.canPlayType ) {
			bool      = new Boolean(bool);
			bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"');

			// Workaround required for IE9, which doesn't report video support without audio codec specified.
			//   bug 599718 @ msft connect
			var h264 = 'video/mp4; codecs="avc1.42E01E';
			bool.h264 = elem.canPlayType(h264 + '"') || elem.canPlayType(h264 + ', mp4a.40.2"');

			bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"');
		}

	} catch(e) { }

	return bool;
}

// VIDEO BACKGROUND
function videoBG() {
	
	var video = $('.slide-video');
	if ($('.slide-video').exists()) {
		if (supportsVideo()) {
			video.get(0).play();
		}
		jQuery(function() { // runs after DOM has loaded
			
			$('#debug').append("<p>DOM loaded</p>");
			
			vid_w_orig = parseInt(jQuery('video').attr('width'));
			vid_h_orig = parseInt(jQuery('video').attr('height'));
			
			jQuery(window).resize(function () { resizeToCover(); });
			jQuery(window).trigger('resize');
			
			//window.addEventListener("orientationchange", function() {resizeToCover();}, false);
		});
	
	}

}

$(window).load(function() {
	videoBG();
});