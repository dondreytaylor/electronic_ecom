<?php

class OrderController
{
	public $app; 
	public $DB; 

	public function __construct(\Slim\Slim $app)
	{
		$this->app = $app;
		$this->DB = new DB();  
	}

	public function get()
	{
	}

	public function place()
	{
		$data = json_decode($this->app->request->getBody(),TRUE); 
		 
		 
		// Create Customer (billing)
		$cid = $this->DB->instance->insert('it490_customer',array(
			'firstname' => isset($data['billing']['firstname']) ? $data['billing']['firstname'] : "",
			'middlename' => isset($data['billing']['middlename']) ? $data['billing']['middlename'] : "",
			'lastname' => isset($data['billing']['lastname']) ? $data['billing']['lastname'] : "",
			'email' => isset($data['billing']['name']) ? $data['billing']['name'] : "",
			'address1' => isset($data['billing']['address1']) ? $data['billing']['address1'] : "",
			'address2' => isset($data['billing']['address2']) ? $data['billing']['address2'] : "",
			'city' => isset($data['billing']['city']) ? $data['billing']['city'] : "",
			'state' => isset($data['billing']['state']) ? $data['billing']['state'] : "",
			'zipcode' => isset($data['billing']['zipcode']) ? $data['billing']['zipcode'] : "",
			'tel' => isset($data['billing']['tel']) ? $data['billing']['tel'] : "",
			'mobile' => isset($data['billing']['mobile']) ? $data['billing']['mobile'] : "",
		)); 

		// Create Order 
		$oid = $this->DB->instance->insert('it490_order',array(
			'customer_id' => $cid,
			'total_amount' => 0,
			'order_status' => 'pending'
		)); 

		$response = array('order_id'=> $oid .'-' . time() );

		return $this->sendBackData($response);
	}

	public function sendBackData($data)
	{
		$this->app->contentType('application/json');
	    $this->app->response()->write(json_encode($data));
	}
}