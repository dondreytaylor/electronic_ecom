<?php

class UploaderController
{

	public $app; 
	
	public function __construct(\Slim\Slim $app)
	{
		$this->app = $app;
	}

	public function upload() 
	{
		// If you want to ignore the uploaded files, 
		// set $demo_mode to true;

		$demo_mode = false;
		$upload_dir = constants::$APP_PATH_ROOT.'storage/products/';
		$allowed_ext = array('jpg','jpeg','png','gif','JPEG');


		if($this->app->request->getMethod() !== 'POST')
		{
			$this->exit_status('Error! Wrong HTTP method!');
			return;
		}


		if(array_key_exists('pic',$_FILES) && $_FILES['pic']['error'] == 0 )
		{
			
			$pic = $_FILES['pic'];
			$extension = $this->get_extension($pic['name']); 

			if(!in_array($extension,$allowed_ext))
			{
				$this->exit_status('Only '.implode(',',$allowed_ext).' files are allowed!');
				return;
			}	

			if($demo_mode)
			{
				
				// File uploads are ignored. We only log them.
				//$line = implode('		', array( date('r'), $_SERVER['REMOTE_ADDR'], $pic['size'], $pic['name']));
				//file_put_contents('log.txt', $line.PHP_EOL, FILE_APPEND);
				
				$this->exit_status('Uploads are ignored in demo mode.');
				return;
			}
			
			
			// Move the uploaded file from the temporary 
			// directory to the uploads folder:
			
			$file = md5( $pic['name'] . time() ).'.'.$extension; 

			if(move_uploaded_file($pic['tmp_name'], $upload_dir.$file))
			{
				$this->exit_status(array('file' => 'storage/products/'.$file ));
				return;
			}
			
		}

		$this->exit_status('Something went wrong with your upload!');
		return;
	}

	public function exit_status($str)
	{
		$this->app->contentType('application/json');
		$this->app->response()->write(json_encode(array('status'=>$str)));
		return $this;
	}

	public function get_extension($file_name)
	{
		$ext = explode('.', $file_name);
		$ext = array_pop($ext);
		return strtolower($ext);
	}


}