'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

  .controller('Site', ['Order','$scope','Product', '$routeParams', '$timeout', '$rootScope', '$location','Shipping', function(Order, $scope, Product, $routeParams, $timeout, $rootScope, $location, Shipping ) {
  		
  		// Order
  		$scope.order = 
  		{
  			number: "", 

  			shipping: { method: 1 }, 
  			billing:  {},

  			flights:  [],
			airports: [],

			tracking:
			{
				number: ""
			}, 

			selected:
			{
				flightCode   : '',
				toAirport    : '',
				fromAirport  : 'EWR'
			},

			actions:
			{

				hideCardNumber: function(number)
				{
					return "*************" + String(number).split('').slice(-4).join('');
				}
			}
  		};

  		$scope.$watch('order.shippingSameAsBilling',function(value)
  		{
  			if (value) $scope.order.shipping = $scope.order.billing;
  			else $scope.order.shipping = {};
  		});

  		$scope.$watch('order.selected.toAirport', function(value)
  		{
  			var flights  = Shipping.findFlight(
			{
				toAirport: $scope.order.selected.toAirport,
				fromAirport: $scope.order.selected.fromAirport
			},

			function()
			{
				$scope.order.flights = flights.data;
			});	
  		});

  		$scope.$watch('order.selected.flightid', function(value)
  		{
  			var track  = Shipping.assignFlight(
			{
				id: value,
				weight: 12
			},

			function()
			{
				$scope.order.tracking.number = track.data;
			});	
  		});


  		// Tracking
  		$scope.tracking = 
  		{
  			number: "", 

  			results: "", 

  			actions:
  			{
  				reset: function()
  				{
  					$scope.tracking.number = "";
  					$scope.tracking.results = ""; 
				}, 

  				track: function()
  				{
  					if (!$scope.tracking.number) 
  					{
  						alert('Please provide a tracking number');
  						return;
  					}

  					var track = Shipping.trackShipment(
  					
  					{id: $scope.tracking.number},

  					function()
  					{
  						var data = track.data; //JSON.parse(track.data);

  						$scope.tracking.results = data;
  						
  					});
  				}
  			}
  		};


  		// Checkout
  		$scope.checkout = 
  		{
  			option: 1,

  			actions:
  			{
				submit: function()
				{
					
					var place = Order.place({order: $scope.order}, function()
					{
						var checkout = $scope.checkout;
						checkout.option = 6;
						
						$scope.order.number = place.order_id;
					}); 

					
				}, 
  			}
  		};

  		$scope.$watch('checkout.option',function(value)
  		{
  			if (value === 4) 
  			{
  				var airports  = Shipping.findAirport(
  				
  				{city: $scope.order.shipping.city},
  				
  				function()
  				{
  					for(var index in airports.data)
	  				{	
	  					for(var index2 in airports.data[index])
	  					{
	  						airports.data[index]['code'] = airports.data[index][index2];
	  						airports.data[index]['city'] = index2;
	  					}
	  				}
	  				
	  				$scope.order.airports = airports.data;
  				});
			}
  		});


  		// Shopping Cart 
  		$scope.cart = 
  		{
  			cache: {}, 

  			items: {}, 

  			actions:
  			{
  				getItemCount: function()
  				{
  					var items = $scope.cart.items;
  					return Object.keys(items).length;
  				}, 

  				getFinalItemPrice: function(item)
  				{
  					return (item.sale > 0) ? parseFloat(item.sale) * item.qty : parseFloat(item.price) * item.qty;
  				}, 

  				getTotal: function()
  				{
  					var index;
  					var total = 0; 
  					var items = $scope.cart.items;

  					for(index in items)
  					{
  						if (!isNaN(index))
  						{
  							total +=  this.round( this.getFinalItemPrice(items[index]) , 2);
  						}
  					}

  					return total;
  				}, 

  				add: function(item)
  				{
  					var items = $scope.cart.items;
  					var cache = $scope.cart.cache;

  					if (typeof item === 'object')
  					{
  						items[item.item_id] = item;
  						items[item.item_id].price = this.round(parseFloat(items[item.item_id].price), 2);
  						items[item.item_id].sale = this.round(parseFloat(items[item.item_id].sale), 2);
  						items[item.item_id].qty = cache.qty ? cache.qty : 1;
  						items[item.item_id].color = cache.color ? cache.color : 'default';
  					}

  					cache.qty = 1;
  					cache.color = 'default'; 

  					if ($routeParams.id != item.item_id) 
  					{
  						$location.path('/product/'+item.item_id);
  					}

  					return this;
				},

				remove: function(id)
  				{
  					var items = $scope.cart.items;
  					
  					if (typeof items[id] === 'object')
  					{
  						delete items[id];
  					}

  					return this;
				},

				round: function(value, exp) {
				  if (typeof exp === 'undefined' || +exp === 0)
				    return Math.round(value);

				  value = +value;
				  exp  = +exp;

				  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
				    return NaN;

				  // Shift
				  value = value.toString().split('e');
				  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

				  // Shift back
				  value = value.toString().split('e');
				  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
				}
  			}
  		}


  		// Filters
  		$scope.filters = {brand:""};
  		$scope.sorts = {show: 5}; 

  		// Product Categories
  		$scope.categories = {
  			'mobile': {label:'Mobile',name:'mobile'},
  			'tablet': {label:'Tablet',name:'tablet'},
  			'camera': {label:'Camera',name:'camera'},
  			'accessory': {label: 'Accessories',name:'accessory'},
  			'computer': {label: 'Computer',name:'computer'}
  		};
  		
  		// Product Listing
  		$scope.branding = {};
  		$scope.products = Product.get({}, function()
	  	{ 
	  		var index; 
	  		var index2;
	  		var product;

	  		for(index in $scope.products.list)
	  		{
	  			product = $scope.products.list[index];  
	  			
	  			if (!$scope.branding[product.brand])
	  			{
	  				$scope.branding[product.brand] = {products: [product], categories: [], name: product.brand}; 
				}
	  			else
	  			{
	  				$scope.branding[product.brand].products.push(product); 
	  			}
	  		}

	  		for(index in $scope.branding)
	  		{
	  			for(index2 in $scope.branding[index].products)
	  			{
	  				if ($scope.branding[index].categories.indexOf($scope.branding[index].products[index2].category) === -1)
	  				{
	  					$scope.branding[index].categories.push($scope.branding[index].products[index2].category);
	  				}
	  			}
	  		}

	  		$scope.productsFound = $scope.products.list;
		});
		
		// Prouct View
		$scope.$on('$routeChangeSuccess', function()
		{
			if ($routeParams.feature)
			{
				$scope.comingsoon = $routeParams.feature;
  			}

			if ($routeParams.id)
			{
				var item = Product.get({id:$routeParams.id},function()
				{
					$scope.item = item.data;
				});
			}
		});

		// ADetermine what brand is a part of each category
		$scope.isCategoryInBrand = function(brand, category)
		{
			if ($scope.branding[brand])
			{
				return $scope.branding[brand].categories.indexOf(category) > -1;
			}
		};

		// Carry out search
		$scope.search = function()
		{
			$rootScope.showLoadingIndicator = true; 

			$scope.searchResults = Product.get({filters:$scope.filters}, function()
			{
				$scope.productsFound = $scope.searchResults.list;
				
				$timeout(function()
				{
					$rootScope.showLoadingIndicator = false; 
				
				},800); 

			});
		};

		// Set Default Search Filters
		$scope.setFilter = function(filter, value)
		{
			if ($scope.filters[filter] === value)
			{
				$scope.filters[filter] = "";
			}
			else
			{
				$scope.filters[filter] = value;
			}

			$scope.search();
		}; 
  }])

  .controller('Admin', ['$scope','Product','$routeParams', function($scope, Product, $routeParams) {
  }])

  .controller('AdminProductAdd', ['$scope','Product',function($scope, Product) {

  		var product;

  		$scope.addpage = 1; 
	  	$scope.admin = {product: {}}; 
	  	$scope.admin.product.add = 
	  	{
	  		
	  		data: 
	  		{
	  			colors: [],
	  			keypoints: [],
	  			previews: []
	  		}, 

	  		actions: 
	  		{
	  			post: function()
	  			{
	  				$scope.admin.product.add.data.previews = $scope.media;
	  				$scope.addpage = 7; 
	  				
	  				product = new Product(); 
	  				product.data = $scope.admin.product.add.data; 
	  				product.$save();
	  				
	  			},

	  			addKeyPoint: function()
	  			{
	  				if ($scope.admin.product.add.data.keypoints.indexOf($scope.temp.keypoint) === -1)
 					{
 						$scope.admin.product.add.data.keypoints.push($scope.temp.keypoint);
	  				}

	  				$scope.temp.keypoint = ""; 
				},

	  			removeKeyPoint: function(index)
	  			{
	  				$scope.admin.product.add.data.keypoints.splice(index,1);
	  			},

	  			addColor: function()
	  			{
	  				if ($scope.admin.product.add.data.colors.indexOf($scope.temp.color) === -1)
 					{
 						$scope.admin.product.add.data.colors.push($scope.temp.color);
	  				}
	  				$scope.temp.color = ""; 
				},

	  			removeColor: function(index)
	  			{
	  				$scope.admin.product.add.data.colors.splice(index,1);
	  			}
	  		}
	  	};
  }])


  .controller('AdminProductList', ['$scope','Product',function($scope, Product) {

  		$scope.products = Product.get({}, function()
	  	{
	  	});
  }])


  .controller('AdminProductEdit', ['$scope','Product','$routeParams', function($scope, Product, $routeParams) {


  		$scope.admin = {product: {}}; 
  		$scope.admin.product.edit = 
  		{
  			data: 
	  		{
	  			colors: [],
	  			keypoints: [],
	  			previews: []
	  		}, 

  			actions: 
	  		{
	  			addKeyPoint: function()
	  			{
	  				if ($scope.admin.product.edit.data.keypoints.indexOf($scope.temp.keypoint) === -1)
 					{
 						$scope.admin.product.edit.data.keypoints.push($scope.temp.keypoint);
	  				}

	  				$scope.temp.keypoint = ""; 
				},

	  			removeKeyPoint: function(index)
	  			{
	  				$scope.admin.product.edit.data.keypoints.splice(index,1);
	  			},

	  			addColor: function()
	  			{
	  				if ($scope.admin.product.edit.data.colors.indexOf($scope.temp.color) === -1)
 					{
 						$scope.admin.product.edit.data.colors.push($scope.temp.color);
	  				}
	  				$scope.temp.color = ""; 
				},

	  			removeColor: function(index)
	  			{
	  				$scope.admin.product.edit.data.colors.splice(index,1);
	  			}
	  		}
  		}; 

  		var product = Product.get({id:$routeParams.id}, function()
  		{
  			$scope.product = product;
  			$scope.media = product.data.previews || [];
  		});

  		$scope.update = function()
  		{
  			product.data.previews = $scope.media;
  			product.$update();
  			$scope.editpage = 7; 
  		};
  }]);

