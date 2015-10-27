<?php

class ProductController
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
		$limit = 10;
		$id = $this->app->request->get('id'); 
		$condition = 'LIKE';
		$conditionFilter = 'AND'; 
		$filtersSet = is_string($this->app->request->get('filters')) ? json_decode($this->app->request->get('filters'),TRUE) : array();
		
		if (!is_array($filtersSet)) 
		{
			$filtersSet = array(); 
		}

		if (is_null($id))
		{
			// Filters
			$filters = array(); 

			// Set Filters
			if (!is_null($filtersSet))
			{
				// Brand
				if (isset($filtersSet['brand']))
				{
					$filters['brand'] = $filtersSet['brand'];
				}

				// Category
				if (isset($filtersSet['category']))
				{
					$filters['category'] = $filtersSet['category'];
				}

				// Brand
				if (isset($filtersSet['price']))
				{
					$filters['price[<>]'] = explode(',',$filtersSet['price']);
				}

				if (isset($filtersSet['query']) && $filtersSet['query'] !== '')
				{
					$filters['name'] = $filtersSet['query'];
					$filters['description'] = $filtersSet['query'];
					$filters['price'] = $filtersSet['query'];
					$filters['sale'] = $filtersSet['query'];
					$filters['category'] = $filtersSet['query'];
					$filters['keypoints'] = $filtersSet['query'];
					$filters['colors'] = $filtersSet['query'];
					$filters['brand'] = $filtersSet['query'];
					$conditionFilter = 'OR';
				}
			}

			
			// GET Multiple Products
			$data = $this->DB->instance->select(
				'it490_item',
				'*', 
				(count($filters) > 0 ? 
						array($condition=>array($conditionFilter=>$filters)) 
					: 
						$filters
				), 
				array('LIMIT' => $limit)
			); 
		

			if ($data === false)
			{
				$data = array('list' => array()); 
			}
			else
			{
				foreach($data as $id => $entry)
				{
					if (isset($entry['colors']))
					{
						$entry['colors'] = explode(',',$entry['colors']);
					}
					
					if (isset($entry['keypoints']))
					{
						$entry['keypoints'] = explode(',',$entry['keypoints']);
					}

					if (isset($entry['previews']))
					{
						$entry['previews'] = explode(',',$entry['previews']);
					}

					$data[$id] = $entry;
				}
				
				$data = array('list' => $data);
			}

			$this->app->contentType('application/json');
	        $this->app->response()->write(json_encode($data));
		}
		else
		{
			// GET Single Product
			$data = $this->DB->instance->get('it490_item','*',array('item_id'=>$id)); 
		
			if ($data === false)
			{
				$data = array('data' => array()); 
			}
			else
			{
				
				if (isset($data['colors']))
				{
					$data['colors'] = explode(',',$data['colors']);
				}
				
				if (isset($data['keypoints']))
				{
					$data['keypoints'] = explode(',',$data['keypoints']);
				}
				
				if (isset($data['previews']))
				{
					$data['previews'] = explode(',',$data['previews']);
				}
				

				$data = array('data' => $data);
			}

			$this->app->contentType('application/json');
	        $this->app->response()->write(json_encode($data));
	    }
    }

	public function put()
	{
		$data = json_decode($this->app->request->getBody(),TRUE); 
		 
		// Add Product
		$id = $this->DB->instance->update('it490_item',array(
			'name' => isset($data['data']['name']) ? $data['data']['name'] : "",
			'code' => isset($data['data']['name']) ? $data['data']['name'] :  "",
			'description' => isset($data['data']['description']) ? $data['data']['description'] :  "",
			'price' => isset($data['data']['price']) ? $data['data']['price'] :  "",
			'sale' => isset($data['data']['sale']) ? $data['data']['sale'] :  "",
			'brand' => isset($data['data']['brand']) ? $data['data']['brand'] :  "",
			'category' => isset($data['data']['category']) ? $data['data']['category'] :  "",
			'quantity_limit' => isset($data['data']['qty']) ? (int)$data['data']['qty'] :  "",
			'colors' => isset($data['data']['colors']) && is_array($data['data']['colors']) ? implode(',', $data['data']['colors']) : "",
			'keypoints' => isset($data['data']['keypoints']) ? implode(',', $data['data']['keypoints']) : "",
			'previews' => isset($data['data']['previews']) ? implode(',', $data['data']['previews']) : "",
		), array('item_id' => $data['data']['item_id'] )); 

		$this->app->contentType('application/json');
        $this->app->response()->write(json_encode($data + array('id'=>$id)));
    }

	public function post()
	{
		$data = json_decode($this->app->request->getBody(),TRUE); 
		 
		// Add Product
		$id = $this->DB->instance->insert('it490_item',array(
			'name' => isset($data['data']['name']) ? $data['data']['name'] : "",
			'code' => isset($data['data']['name']) ? $data['data']['name'] :  "",
			'description' => isset($data['data']['description']) ? $data['data']['description'] :  "",
			'price' => isset($data['data']['price']) ? $data['data']['price'] :  "",
			'sale' => isset($data['data']['sale']) ? $data['data']['sale'] :  "",
			'brand' => isset($data['data']['brand']) ? $data['data']['brand'] :  "",
			'category' => isset($data['data']['category']) ? $data['data']['category'] :  "",
			'quantity_limit' => isset($data['data']['qty']) ? (int)$data['data']['qty'] :  "",
			'colors' => isset($data['data']['colors']) && is_array($data['data']['colors']) ? implode(',', $data['data']['colors']) : "",
			'keypoints' => isset($data['data']['keypoints']) ? implode(',', $data['data']['keypoints']) : "",
			'previews' => isset($data['data']['previews']) ? implode(',', $data['data']['previews']) : "",
		)); 

		$this->app->contentType('application/json');
        $this->app->response()->write(json_encode($data + array('id'=>$id)));
    }

}