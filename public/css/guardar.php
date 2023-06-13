<?php
 $host ="localhost";
 $user ="root";
 $pass ="";
 $db="datos_formulario";

 //funcion llamada conexion con (dominio,usuarios,contraseña,base_de_datos)
 $con = mysqli_connect($host,$user,$pass,$db)or die("Problemas al Conectar");
 mysqli_select_db($con,$db)or die("problemas al conectar con la base de datos");

	//conectar con variables del formulario
	$documento=$_POST['documento'];
	$nombre=$_POST['nombre'];
	$telefono=$_POST['telefono'];
	$direccion=$_POST['direccion'];
	$correo=$_POST['correo'];
	$clave=$_POST['password'];
	
	//sentencia de sql
	$sql="INSERT INTO datos VALUES('$documento',
									'$nombre',
									'$telefono',
									'$direccion',
									'$correo',
									'$clave')";
	//ejecutar la sentencia sql
 	$ejecutar=mysqli_query($con,$sql);
	// verificación de los datos gurdados
	if(!$ejecutar){
		echo"hubo algun error";
	}else{
		echo"Datos guardados correctamente<br> <br><a href='../login.html'>LOGIN</a>";
	}
?>