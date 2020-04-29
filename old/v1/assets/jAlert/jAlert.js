$(document).ready(function () {	
	$( "body" ).prepend("<div id='jAlert'><div class='table'><div class='cell'>\
								<div class='alert'>\
									<div class='texto'></div>\
									<div class='botonOK'>OK</div>\
									<div class='botonCerrar'></div>\
								</div>\
							</div></div></div>" );
	$("#jAlert .alert .botonOK, #jAlert .alert .botonCerrar").click(function(){
		$("#jAlert").css("opacity","0");
		$("#jAlert").css("visibility","hidden");
	});
});

function jAlert(texto, botonActivado, cerrarActivado, width ) {
	if (width) {
		$( "#jAlert .alert" ).css( "max-width", width+"px" );
	} else {
		$( "#jAlert .alert" ).css( "max-width", "400px" );
	}
	$("#jAlert .alert .botonOK").css("display","block");
	if ( botonActivado==false ) {
		$("#jAlert .alert .botonOK").css("display","none");
	}
	$("#jAlert .alert .botonCerrar").css("display","block");
	if ( cerrarActivado==false ) {
		$("#jAlert .alert .botonCerrar").css("display","none");
	}
	$( "#jAlert .alert .texto" ).html(texto);
	$("#jAlert").css("visibility","visible");
	$("#jAlert").css("opacity","1");
}