function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
function isEmpty(str) {
    return str.replace(/^\s+|\s+$/g, '').length == 0;
}

function validarcampo(elemento) {
    mensaje=$(elemento).parent().find(".mensaje");
    mensaje.css("display","none");
    if ( !$(this).hasClass("opcional") ) {
        if ( isEmpty($(elemento).val()) ) {
            mensaje.html("Este campo es obligatorio")
            mensaje.css("display","block");            
        } else if ( ( $(elemento).prop('type')=="email" ) && ( !isEmail( $(elemento).val() ) ) ) {
            mensaje.html("Debes ingresar un email valido")
            mensaje.css("display","block");
        }
    }
}

function setearForm(nombreForm) {
    $(nombreForm+" input[type=text], "+nombreForm+" input[type=email]").each(function( index ) {
        $(this).parent().append("<div class='mensaje'></div>");
    });
    
    $(nombreForm+" button").click(function(){
        var validacionok=true;
        
        
        $(nombreForm+" input[type=text], "+nombreForm+" input[type=email]").each(function( index ) {
            if ( !$(this).hasClass("opcional") ) {
                if ( isEmpty($(this).val()) ) {
                    validacionok=false;
                } else if ( ( $(this).prop('type')=="email" ) && ( !isEmail( $(this).val() ) ) ) {
                    validacionok=false;
                }
            }
        });        
        
        if ( validacionok ) {
            $("#loading").css("opacity","1");
			$("#loading").css("display","block");
            var datos =new FormData( $(nombreForm).get(0) );
			$.ajax( {
				url: $(nombreForm).attr("action"),
				type: 'POST',
				data: datos,
				processData: false,  // tell jQuery not to process the data
				contentType: false   // tell jQuery not to set contentType
			} ).done(function( data ) {
				jAlert("Ya estas registrado! Muchas gracias.",true,false);
				$("#loading").css("display","none");
                $(nombreForm)[0].reset();
			} ).fail(function() {
                jAlert("Hubo un error al enviar el formulario. Por favor intenta mas tarde.",true,false);
                $("#loading").css("display","none");
            });
            
        } else {
            $(nombreForm+" input[type=text], "+nombreForm+" input[type=email]").each(function( index ) {
                validarcampo($(this));
                jAlert("Hay errores en algunos de los campos. Por favor revisa el formulario para poder continuar.",true,false);
                
                $(nombreForm+" input[type=text], "+nombreForm+" input[type=email]").unbind();
                $(nombreForm+" input[type=text], "+nombreForm+" input[type=email]").blur(function(){
                    validarcampo($(this));
                });
                
            });
        }
        
        console.log(validacionok);
        
    });
    
}

