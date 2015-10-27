<?php
// Initialize a Session
session_cache_limiter(false);
session_start();


define('APP_PATH','/afs/cad.njit.edu/u/d/d/ddt7/public_html/it490/app/'); 
define('APP_PATH_ROOT','/afs/cad.njit.edu/u/d/d/ddt7/public_html/it490/'); 

// Composer Autoloader
require APP_PATH_ROOT."vendor/autoload.php";

// Define Current Environment Properties
if (TRUE)
{
	ini_set('display_errors', 1); // Show all errors in development
	error_reporting(E_ALL);
} 
else 
{
	// Hide all errors on live
	ini_set('display_errors', 0);
	error_reporting(0);
}

// Define Constants
require 'constants.php';

// Register the Auto Loader
spl_autoload_register(function($class)
{
	if (!class_exists($class))
	{
		$class = str_replace('\\', '/', $class); // Namespace-to-directory
		
	
		// Search Models
		if (is_dir(APP_PATH.'models/'.$class)) if (file_exists(APP_PATH.'models/'.$class.'/_class.php')) $file = APP_PATH.'models/'.$class.'/_class.php';
		if (file_exists(APP_PATH.'models/'.$class.'.php')) $file = APP_PATH.'models/'.$class.'.php';

		// Search Controllers
		if (file_exists(APP_PATH.'controllers/'.$class.'.php')) $file = APP_PATH.'controllers/'.$class.'.php';

		// Search Init
		if (file_exists(APP_PATH.'init/'.$class.'.php')) $file = APP_PATH.'init/'.$class.'.php';

		// Load File or Die
		if (isset($file) && file_exists($file)) 
		{
			include $file;
		}
	}
});


// Starting Slim Framework
$app = new \Slim\Slim(
	array(
		'debug' => true,
		'templates.path' => APP_PATH . 'views'
	)
);


// Load & Run the routes
require APP_PATH . "init/routes.php";


$app->run();




