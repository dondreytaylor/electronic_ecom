<?php

require 'vendor/medoo/medoo.php'; 

class DB
{  
	public $instance;
	public $connected; 

	public function __construct() 
	{
		try
		{
			$this->instance = new medoo(array(
			
				// required
				'database_type' => 'mysql',
				'database_name' => 'ddt7',
				'server' => 'sql.njit.edu',
				'username' => 'ddt7',
				'password' => 'BQTy8MPKY',

				// optional
				'port' => 3306,
				'charset' => 'utf8',
			
			));

			$this->connected = true;
		}
		catch(Exception $e)
		{
			$this->connected = false;
		}
	}
}