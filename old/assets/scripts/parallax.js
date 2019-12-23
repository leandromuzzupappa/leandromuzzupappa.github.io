var mouseX=0;
var mouseY=0;
var scrollPagina;

function onEnterFrameParallax() {
	if ( !esMobile ) {
		var posicionNuevaX = -( mouseX - $(window).width()/2 );
		var posicionNuevaY = -( mouseY - $(window).height()/2 ) ;
		TweenLite.to( ".parallax, .parallax2" , 4, { x:posicionNuevaX/35, y:(posicionNuevaY/50), ease:Power2.easeOut });
	}
	t = setTimeout(function(){ onEnterFrameParallax() }, 25);
}

function scrollEventsParallax() {
	if ( browser!="safari" ) {
		$( ".parallax" ).each(function( index ) {
			var porcentaje=10*$(this).height()/100;
			var posicionYglobal=$(this).parent().offset().top+porcentaje;
			var alto=$(this).height();
			if ( $(this).data("offset") ) {
				var offset=$(this).data("offset");
			} else {
				var offset=0;
			}
			var yNueva= ( $(window).scrollTop() - posicionYglobal ) / 1.5 +offset ;
			$(this).css("top", ( yNueva )+"px");
		});
		$( ".parallax2" ).each(function( index ) {
			var porcentaje=10*$(this).height()/100;
			var posicionYglobal=$(this).parent().offset().top+porcentaje;
			var alto=$(this).height();
			if ( $(this).data("offset") ) {
				var offset=$(this).data("offset");
			} else {
				var offset=0;
			}
			var yNueva= ( $(window).scrollTop() - posicionYglobal ) / 2.5 +offset ;
			$(this).css("top", ( yNueva )+"px");
		});
	}	
}

$(document).ready(function () {
	
	/* SCROLL EVENTS */
	scrollPagina=$(window).scrollTop();
	if ( !esMobile ) {
		
		$(window).scroll(function(event) {
			event.preventDefault();
			scrollEventsParallax();
		});
			
			$("html, body").mousewheel(function(event) {
				if (!popupAbierto) {
					var sumar=event.deltaY*event.deltaFactor;
					event.preventDefault();
					scrollPagina = scrollPagina-sumar;
					if ( scrollPagina-sumar<0 ) {
						scrollPagina=0;
					}
					if ( scrollPagina>( $(document).height()-$(window).height() ) ) { 		
						scrollPagina=$(document).outerHeight()-$(window).outerHeight();
					}
					$("html, body").stop().animate( { scrollTop: scrollPagina }, 500, "easeOutQuint");
				}
			});
			$("html, body").mousedown(function(){ $("html, body").stop(); });
			$("html, body").mouseup(function(){ scrollPagina=$(window).scrollTop(); });
		
			
			/*$("html, body").mousedown(function(){ $("html, body").stop(); });
			$("html, body").mouseup(function(){ scrollPagina=$(window).scrollTop(); });*/
			
		
			$( "body" ).mousemove(function( event ) {
				mouseX=event.pageX; mouseY=event.pageY-$(window).scrollTop();
			});
		
	}
	
	if ( !esMobile ) {
		scrollEventsParallax();
	}
	onEnterFrameParallax();
		
});