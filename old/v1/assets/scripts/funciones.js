function onEnterFrame() {
	t = setTimeout(function(){ onEnterFrame() }, 25);
}

function onResize() {
}

var popupAbierto=false;

function abrirPopup(id) {
	$(".popupContainer").css("display", "block");
	$(".popupContainer").css("opacity", "0");
	$(".popupContainer").scrollTop(0);
	TweenLite.to( $(".popupContainer"), 0.5, { opacity:1 });
	$(".popupContainer .popup").css("display", "none");
	$(id).css("display", "inline-block");	
	TweenLite.to( $(id), 0, { scale:0.5, opacity:0 });
	TweenLite.to( $(id), 0.5, { delay:0.3, scale:1, opacity:1, ease: Power2.easeOut });
	$("body").css("overflow-y","hidden");
	popupAbierto=true;
}

function cerrarPopup() {
	TweenLite.to( $(".popupContainer .popup"), 0.3, { scale:0.5, opacity:0, ease: Power2.easeIn });
	TweenLite.to( $(".popupContainer"), 0.5, { delay:0.3, opacity:0, onComplete:function(){
		$(".popupContainer").css("display","none");
	} });
	$("body").css("overflow-y","auto");	
	popupAbierto=false;	
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/*
function scrollEvents() {
	if ( $(window).scrollTop()>300 ) {
		if ( !$("#menuFlotante").hasClass("activo") ) {
			$("#menuFlotante").addClass("activo");
		}
	} else {
		if ( $("#menuFlotante").hasClass("activo") ) {
			$("#menuFlotante").removeClass("activo");
		}
	}

	$(".botonScroll").each(function( index ) {
		var seccion=$(this).data("anchor");
		
		if ( $("#menuFlotante").css("display")=="block" ) {
			var menuAlto=$("#menuFlotante").outerHeight();
		} else {
			var menuAlto=0;
		}
		
		if ( $(this).data("offset") ) {
			var inicio=$(seccion).offset().top+$(this).data("offset")-2-menuAlto;
		} else {
			var inicio=$(seccion).offset().top-2-menuAlto;
		}
		if ( $( ".botonScroll:eq("+(index+1)+")" ).data("offset") ) {
			var final=$(seccion).offset().top+$(seccion).outerHeight()+$( ".botonScroll:eq("+(index+1)+")" ).data("offset") -10-menuAlto;
		} else {
			var final=$(seccion).offset().top+$(seccion).outerHeight() -10-menuAlto;
		}
		
		if ( ($(window).scrollTop()>inicio) && ($(window).scrollTop()<final)  ) {
			$(this).addClass("activo");
		} else {
			$(this).removeClass("activo");
		}
	});
}
*/

function scrollEvents() {
	if ( $(window).scrollTop()>300 ) {
		if ( !$("#menuFlotante").hasClass("activo") ) {
			$("#menuFlotante").addClass("activo");
		}
	} else {
		if ( $("#menuFlotante").hasClass("activo") ) {
			$("#menuFlotante").removeClass("activo");
		}
	}

	$(".botonScroll").each(function( index ) {
		var seccion=$(this).data("anchor");
		
		if ( $("#menuFlotante").css("display")=="block" ) {
			var menuAlto=$("#menuFlotante").outerHeight();
		} else {
			var menuAlto=0;
		}
		
		if ( $(this).data("offset") ) {
			var inicio=$(seccion).offset().top+$(this).data("offset")-2-menuAlto;
		} else {
			var inicio=$(seccion).offset().top-2-menuAlto;
		}
		if ( $( ".botonScroll:eq("+(index+1)+")" ).data("offset") ) {
			var final=$(seccion).offset().top+$(seccion).outerHeight()+$( ".botonScroll:eq("+(index+1)+")" ).data("offset") -10-menuAlto;
		} else {
			var final=$(seccion).offset().top+$(seccion).outerHeight() -10-menuAlto;
		}
		
		if ( ($(window).scrollTop()>inicio) && ($(window).scrollTop()<final)  ) {
			$(this).addClass("activo");
		} else {
			$(this).removeClass("activo");
		}
	});
}

$(document).ready(function () {
	
	// Eventos Loading
	var animLoading = new TimelineMax({ repeat:-1 });
	animLoading.add( TweenLite.to( "#loading .lineaFrente", 2, { "stroke-dashoffset":-640, ease:Power0.easeNone } ) );
	
	// Eventos Responsive
	$( window ).resize(function() {
		onResize();
	});
	onResize();
	$("#desplegableMobile").html( $(".menu .botonera").html() );
	TweenLite.to( "#desplegableMobile", 0, { y:"-100%", ease: Power4.easeIn });
	$("#menuMobile .botonMenu, #desplegableMobile .boton").click(function(){
		if ( $("#menuMobile .botonMenu").hasClass("activo") ) {
			$("#menuMobile .botonMenu").removeClass("activo");
			TweenLite.to( "#desplegableMobile", 0.5, { y:"-100%", ease: Power4.easeIn });
		} else {
			$("#menuMobile .botonMenu").addClass("activo");
			TweenLite.to( "#desplegableMobile", 1, { y:"0%", ease: Power4.easeOut });
		}
	});	
	
	// FORMULARIO ENVIO
	/* $(".botonEnviar").click(function(){
		enviarForm("#formContacto", "../send/enviar.php");
	}); */
	
	// Eventos Popup
	$(".popupContainer .popup .cerrar, .popupContainer .overlay").click(function(){
		cerrarPopup();
	});
	
	// Eventos Scroll en botones
	$(".botonScroll").click(function(){
		var seccion=$(this).data("anchor");

		if ( $("#menuFlotante").css("display")=="block" ) {
			var menuAlto=$("#menuFlotante").outerHeight();
		} else {
			var menuAlto=0;
		}
		if ( $(this).data("offset") ) {
			var posicionNueva=$(seccion).offset().top+$(this).data("offset")-menuAlto;
		} else {
			var posicionNueva=$(seccion).offset().top-menuAlto;
		}
		if (seccion=="header") {
			var posicionNueva=0;
		}
		$("html, body").stop().animate( { scrollTop: posicionNueva }, 1000, "easeInOutQuint");
		
		scrollPagina=posicionNueva;
	});
	
	// Eventos Scroll
	$(window).scroll(function(event) {
		scrollEvents();
	});
	scrollEvents();
	
	
	$("#boton-menu-mobile").click(function(){
		if ( $("#boton-menu-mobile").hasClass("activo") ) {
			$("#menu-mobile").removeClass("activo");
			$("#boton-menu-mobile").removeClass("activo");
		} else {
			$("#menu-mobile").addClass("activo");
			$("#boton-menu-mobile").addClass("activo");
		}
	});


	$('.menu .items a').click(function() {
		$('a').removeClass();
		$(this).addClass('active');
		if ( $('.menu .menu-portfolio a').hasClass('active') ) {
			$('#secciones #portfolio').addClass('animated slideInUp dblock');
			$('#secciones #sobremi').removeClass();
			$('#secciones #contacto').removeClass();
		}
		if ( $('.menu .menu-sobremi a').hasClass('active') ) {
			$('#secciones #sobremi').addClass('animated slideInUp dblock');
			$('#secciones #portfolio').removeClass();
			$('#secciones #contacto').removeClass();
		}
		if ( $('.menu .menu-contacto a').hasClass('active') ) {
			$('#secciones #contacto').addClass('animated slideInUp dblock');
			$('#secciones #portfolio').removeClass();
			$('#secciones #sobremi').removeClass();
		}
	});

	// Abrir link sportfolio
	$('#mobile-summit').click(function() {
		window.open('http://mobilesummit.com.ar/');
	});
	$('#email-summit').click(function() {
		window.open('http://emailsummit.org/');
	});
	$('#rh-oc').click(function() {
		window.open('https://www.redhat.com/es/open-culture/home');
	});
	$('#vidt').click(function() {
		window.open('http://www.vidt.com.ar/');
	});
	$('#rh-ss').click(function() {
		window.open('https://www.redhat.com/es/campaign/smart-start-consulting');
	});
	$('#sabbcaff').click(function() {
		window.open('http://www.scabogados.com.ar/');
	});
	$('#airpostcard').click(function() {
		window.open('http://airpostcard.com/');
	});
	$('#delusarreta').click(function() {
		window.open('http://delusarreta.com.ar/');
	});
	$('#globalboosters').click(function() {
		window.open('http://globalboosters.com/');
	});
	$('#massive').click(function() {
		window.open('https://massive.ag/');
	});
	$('#performancesrl').click(function() {
		window.open('http://www.performancesrl.com.ar/');
	});
	$('#dema').click(function() {
		window.open('https://www.dema-ortopedia-mayorista.com/');
	});

});

$( window ).load(function() {
	
	// LOADING
	TweenLite.to( $("#loading"), 0.5, { opacity:0, delay:0.2,
		onComplete:function(){
			$("#loading").css("display","none");
		}
	});
	
	onEnterFrame();
	
});