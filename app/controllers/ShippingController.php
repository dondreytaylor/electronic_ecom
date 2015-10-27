<?php

class ShippingController
{
	public $app; 
	public $DB; 

	public function __construct(\Slim\Slim $app)
	{
		$this->app = $app;
		$this->DB = new DB();  
	}

	public function route()
	{
		$request = $this->app->request(); 

		switch (TRUE)
		{
			case $request->get('findAirport'):
				return $this->findAirport();
				break;

			case $request->get('findFlight'):
				return $this->findFlight(); 
				break;

			case $request->get('assignFlight'):
				return $this->assignFlight();
				break;

			default:
			case $request->get('trackShipment'):
				return $this->trackShipment();
				break;
		}
	}

	private function sendAPIRequest($endpoint, $params)
	{
		$urlifiedParams = http_build_query($params);

		$data = array(); 

		// Get cURL resource
		$curl = curl_init();
		
		// Set some options - we are passing in a useragent too here
		curl_setopt_array($curl, array(
		    CURLOPT_RETURNTRANSFER => 1,
		    CURLOPT_URL => $endpoint . $urlifiedParams,
		    CURLOPT_USERAGENT => 'API REQUEST'
		));
		
		// Send the request & save response to $resp
		$resp = curl_exec($curl);
		
		$stdobj  = new stdClass;
		$stdobj->data = !isset($params['flightid']) ? json_decode($resp,TRUE) : $resp;

		// Close request to clear up some resources
		curl_close($curl);
		

		$this->app->contentType('application/json');
	    $this->app->response()->write(json_encode($stdobj));
	}


	private function findAirport()
	{
		$api = "http://royhp.net/it490/track/orderCreation/findAirportCode/?";
		
		$params = array(
			'city' => $this->app->request()->get('city')
		);

		$this->sendAPIRequest($api,$params);
	}

	private function findFlight()
	{
		$api = "http://royhp.net/it490/track/orderCreation/findFlight/?";
		
		$params = array(
			'fromAirport' => $this->app->request()->get('fromAirport'),
			'toAirport'   => $this->app->request()->get('toAirport')
		);

		$this->sendAPIRequest($api,$params);
	}

	private function assignFlight()
	{
		$api = "http://royhp.net/it490/track/orderCreation/ship/?";
		
		$params = array(
			'flightid' => $this->app->request()->get('id'), 
			'weight' => $this->app->request()->get('weight')
		);

		$this->sendAPIRequest($api,$params);
	}


	private function trackShipment()
	{
		$api = "http://royhp.net/it490/track/trackingLookup/search?"; 
		
		$params = array(
			'id' => $this->app->request()->get('id')
		); 

		$this->sendAPIRequest($api,$params);
	}
}