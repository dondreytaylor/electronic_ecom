<?php

$app->config(array(
    'templates.path' => './views'
));


$app->map('/', function () use ($app)
{
    $request = $app->request(); 

    if (!is_null($request->get('endpoint')))
    { 
        switch ($request->get('endpoint'))
        {
             case 'Order':
                if ($request->get('place'))
                {
                    (new OrderController($app))->place();
                }
                else
                {
                    (new OrderController($app))->place();
                }
                break;

             case 'Shipping':
                (new ShippingController($app))->route();
                break;

            case 'Uploader':
                (new UploaderController($app))->upload();
                break;
                
            case 'Product':
                $method = strtolower($request->getMethod()); 
                $productController = (new ProductController($app)); 
                if (method_exists($productController, $method))
                {
                    $productController->$method(); 
                }
                break;
        }
    }
    else
    {
         $app->render('base/base.html');
    }

})->via('GET','POST','PUT','DELETE'); 