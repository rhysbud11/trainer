
function isMobile() {
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return true;
	}
	else {
		return false;
	}
}

jQuery(document).ready(function ($) {
	
	// STORY ELEMENTS SCROLL/FIX
	
	$(window).scroll(function() {
		dittoStoryFix();
	});
	
	$(window).resize(function() {
		dittoStoryFix();
	});
	
	function dittoStoryFix() {
		
		var dittoStory = $('#ditto-story');
		var dittoStoryOffsetTop = dittoStory.offset().top;
		var dittoStoryOffsetBottom = dittoStory.offset().top + dittoStory.height();
		
		var windowTop = $(window).scrollTop();
		
		var diffTop = dittoStoryOffsetTop - windowTop;
		var diffBottom = dittoStoryOffsetBottom - windowTop - $(window).height();
		
		if (diffTop <= 0) {
			$('#ditto-story-content').addClass('fixed');
			
			if (diffBottom <= 0) {
				$('#ditto-story-content').removeClass('fixed');
				$('#ditto-story-content').addClass('absolute'); 
			}
			else {
				
				if (diffBottom >= 0) {
					$('#ditto-story-content').addClass('fixed');
					$('#ditto-story-content').removeClass('absolute');
				}
				
			} 
		}
		else {
			$('#ditto-story-content').removeClass('fixed');
		}
		
		return true;
		
	}
	
	// BACKGROUND COLOR CHANGER
	
	var scroll_pos = 0;
	var cPos = new Array();
	var cColor = new Array();
	
	function setColorScroll() {
		cPos[1] = 0;
			cColor[1] = new $.Color( 'rgb(224,223,224)' );
		cPos[2] = $('#storysection1').offset().top;
			cColor[2] = new $.Color( 'rgb(224,223,224)' );
		cPos[3] = $('#storysection2').offset().top;
			cColor[3] = new $.Color( 'rgb(49,49,49)' );
		cPos[4] = $('#storysection3').offset().top;
			cColor[4] = new $.Color( 'rgb(224,223,224)' );
		cPos[5] = $('#storysection4').offset().top;
			cColor[5] = new $.Color( 'rgb(49,49,49)' );
	}
	$( window ).resize(function() {
		if ($('#homepage').exists()) {
			setColorScroll();
		}
	});
	
	$(window).load(function() {
		if ($('#homepage').exists()) {
			setColorScroll();
		}
	});
	if ($('#homepage').exists()) {
		setColorScroll();
	}
	
	function setColor(color1,color2,scrolled) {
		var newColor = color1 + ( ( color2 - color1 ) * scrolled );
		return newColor;
	}
	function updateColors() {
		
		scroll_pos = $(document).scrollTop(); 
		var didUpdate = false;
		for (var i=1;i<=cPos.length;i++) {
			if (scroll_pos >= cPos[i] && scroll_pos <= cPos[i+1] ) { 
				var perScrolled = (scroll_pos - cPos[i]) / ( cPos[i+1] - cPos[i] );
				var newColor = new $.Color( 
					setColor(cColor[i].red(),cColor[i+1].red(),perScrolled), 
					setColor(cColor[i].green(),cColor[i+1].green(),perScrolled), 
					setColor(cColor[i].blue(),cColor[i+1].blue(),perScrolled )
				);
				$('#ditto-story').animate({ backgroundColor: newColor }, 0);
				didUpdate = true;
			}
		}
		if (!didUpdate) {
			if ( scroll_pos > cPos[cPos.length - 1] ) { //
			 $('#ditto-story').animate({ backgroundColor: cColor[cColor.length - 1] }, 0);
			} else if ( scroll_pos < cPos[1] ) {
				 $('#ditto-story').animate({ backgroundColor: cColor[1] }, 0);
			}
		}
	}
	
	$(document).scroll(function() {
		updateColors();
	});
	
	
	// STORY HOVER
	
	/*
	$("li.story-trigger").on({
		mouseenter: function () {
			$(this).addClass('hover' , 800);
		},
		mouseleave: function () {
			$(this).removeClass('hover' , 800);
		}
	});
	*/
	
			
	// TRIGGER RESIZE
	
	$(window).trigger('resize'); 
	
	function dittoResize() {
		$('.ditto-story-spacer').height($(window).height());  
		$('.full-screen').height($(window).height()); 
		setColorScroll();
	}
	
	$(window).resize(function() {
		dittoResize();
	});
	
	// STORY CONTENT TOGGLE
	
	var globalActive = '';
	
	function storySectionToggle() {
				
		var diffArr = new Array();
		var identifierArr = new Array();
		
		$('.ditto-story-spacer').each(function() {
			
			var topOffset = $(this).offset().top;
			var scrollOffset = $(window).scrollTop();
			
			diffArr.push(scrollOffset - topOffset);
			identifierArr.push($(this).attr('page-slide'));
			
		});
		
		// FIND ONE CLOSEST TO TOP OF WINDOW
		
		var holdDiff = 5000;
		var makeActive = '';
		var newMakeActive = '';
		
		for (i=0; i<diffArr.length; i++) { 
			
			newDiff = Math.abs(diffArr[i] - 0);
			
			if (newDiff < holdDiff) {
				holdDiff = newDiff;
				makeActive = identifierArr[i];
			}
			
		}
		
		if (makeActive != '') {
			
			$(".story-content-section[content-section='" + makeActive + "']").addClass('active');
			$(".story-content-section:not([content-section='" + makeActive + "'])").removeClass('active');
			
			$(".story-destination[page-slide='" + makeActive + "']").addClass('active');
			$(".story-destination:not([page-slide='" + makeActive + "'])").removeClass('active');
			
			$(".story-navigation li[page-slide='" + makeActive + "']").addClass('active');
			$(".story-navigation li:not([page-slide='" + makeActive + "'])").removeClass('active');
			
			globalActive = makeActive;
			
		}
		
	}
	
	$(window).scroll(function() {
		storySectionToggle();
	});
	
	$(window).load(function() {
		
		storySectionToggle();
		
		if (dittoStoryFix()) {
			
			// DETERMINE IF INSIDE FIXED AREA
			
			if ($('#ditto-story-content').hasClass('fixed')) {
				
				var scrollPosIni = $('.story-destination.active').offset().top;
				
				htmlbody.stop().animate({scrollTop: scrollPosIni}, 1000, 'easeInOutQuint', function(){
					allowDelta = true;
				});
			}
		}
		
	});

	storySectionToggle();
	
	
	// AUTO SCROLL FUNCTIONALITY
	
	var totalDelta = 0;
	var allowDelta = true;
	var deltaOffset = 200;
	var allowMovement = false;
	
	$(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function(event) {
		
		if ($('#ditto-story-content').hasClass('fixed')) {
			
			if (!allowMovement) {
				event.preventDefault();
			}
			else {
				allowMovement = false;
			}
			
			if (allowDelta) {
				
				var newDelta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
				totalDelta += newDelta;
			
				if (newDelta > 0) {
					
					// RESET/CHANGE DIRECTION
					if (totalDelta < 0) { totalDelta = 0; }
					
					if (totalDelta > deltaOffset) {
						allowDelta = false;
						moveStoryPosition('up');
						totalDelta = 0;
					}
					
				}
				else {
					
					// RESET/CHANGE DIRECTION
					if (totalDelta > 0) { totalDelta = 0; }
					
					if (totalDelta < (deltaOffset * -1)) {
						allowDelta = false;
						moveStoryPosition('down');
						totalDelta = 0;
					}
					
				}
			}
		}
		
	});
	
	function moveStoryPosition(direction) {
		
		if (direction == 'up') {
			if ( $('.story-destination.active').prev('.story-destination').exists()) {
				var scrollPos = $('.story-destination.active').prev('.story-destination').offset().top;
				htmlbody.stop().animate({scrollTop: scrollPos}, 1000, 'easeInOutQuint', function(){
					allowDelta = true;
				});
			}
			else {
				allowDelta = true;
				allowMovement = true;
			}
		}
		else if (direction == 'down') {
			if ( $('.story-destination.active').next('.story-destination').exists()) {
				var scrollPos = $('.story-destination.active').next('.story-destination').offset().top;
				htmlbody.stop().animate({scrollTop: scrollPos}, 1000, 'easeInOutQuint', function(){
					allowDelta = true;
				});
			}
			else {
				allowDelta = true;
				allowMovement = true;
			}
		}
		
	}
	
	
});
