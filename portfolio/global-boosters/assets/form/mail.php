<?php
 
// Get values from form
$name=$_POST['name'];
$surname=$_POST['surname'];
$country=$_POST['country'];
$phone=$_POST['phone'];
$email=$_POST['email'];
$message=$_POST['message'];
 
$to = "leann.muzzu@gmail.com" . " lean._muzzu@hotmail.com";
$subject = "Global Boosters";
$messaged = " Name: " . $name . "\r\n Surname: " . $surname . "\r\n Country: " . $country . "\r\n Phone: " . $phone . "\r\n Email: " . $email . "\r\n Message: " . $message;
 
 
$from = "prueba";
$headers = "From:" . $from . "\r\n";
$headers .= "Content-type: text/plain; charset=UTF-8" . "\r\n"; 
 
if(@mail($to,$subject,$messaged,$headers))
{
    echo" Your message has been sent";
}else{
  echo "Error! Please try again.";
}
 
 
 
?>