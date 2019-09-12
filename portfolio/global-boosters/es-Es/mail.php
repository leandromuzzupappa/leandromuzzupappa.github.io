<?php $name = $_POST['name'];
$surname = $_POST('surname');
$country = $_POST('country');
$phone = $_POST('phone');
$email = $_POST['email'];
$message = $_POST['message'];
$formcontent="From: $name \n Message: $message";

$recipient = "leann.muzzu@gmail.com";
$subject = ' mail from Global Boosters';
$mailheader = "From: $email \r\n";
mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");
echo "Thank You!" . " -" . "<a href='index.html' style='text-decoration:none;color:#ff0099;'> Return Home</a>";
?>