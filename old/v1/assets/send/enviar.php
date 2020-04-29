<?php
date_default_timezone_set('Etc/UTC');
require 'class.smtp.php';
require 'class.phpmailer.php';

$mail = new PHPMailer();

$mail->FromName = "Nombre";
$mail->AddReplyTo($_POST["email"],$_POST["nombre"]);

$mail->AddAddress("mail@mail.com");

$mail->WordWrap = 50;
$mail->IsHTML(true);
$mail->ContentType = "text/html";
$mail->CharSet = "UTF-8";

$mail->AddAttachment( $_FILES['curriculum']['tmp_name'], $_FILES['curriculum']['name'] );

$mail->Subject = "Mensaje de ".$_POST["nombre"]." - Enviado desde nombreweb.com";
$mail->Body    = "<font face=Verdana, Arial, Helvetica, sans-serif color=#666666 size=2>
<strong>Nombre: </strong>"  .$_POST["nombre"] . " " . $_POST["apellido"] . "<br>
<strong>Email: </strong>" . $_POST["email"] . "<br>
<strong>Telefono: </strong>" . $_POST["telefono"] . "<br>
<strong>Mensaje: </strong>" . $_POST["mensaje"] . "<br>
</font>";

if(!$mail->Send()) { echo "NOK";
} else { echo "OK"; }
?>