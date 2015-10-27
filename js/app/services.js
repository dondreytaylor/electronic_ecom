'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource'])
	
	.service('Product',['$resource',function($resource)
	{
		return $resource('?endpoint=Product',
				     {
				     	id:'@id'
				     }, 
				     {
				     	add: {method:'POST'},
				     	update: {method: 'PUT'}
					}
				);
	}])

	.service('Shipping',['$resource',function($resource)
	{
		return $resource('?endpoint=Shipping',
				     {
				     	id:'@id'
				     }, 
				     {
				     	findAirport:   { method: 'GET',  params: { findAirport: true } },
				     	findFlight:    { method: 'GET',  params: { findFlight: true } },
				     	assignFlight:  { method: 'GET',  params: { assignFlight: true } },
				     	trackShipment: { method: 'GET',  params: { trackShipment: true } }
					}
				);
	}])

	.service('Order',['$resource',function($resource)
	{
		return $resource('?endpoint=Order',
				     {
				     	id:'@id'
				     }, 
				     {
				     	place:   { method: 'POST',  params: { place: true } },
				     	find:   { method: 'GET',  params: { find: true } },
				     }
				);
	}]);