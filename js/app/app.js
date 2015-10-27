'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
])

.config(['$routeProvider', function($routeProvider) {
  
  $routeProvider.when('/', {templateUrl: 'views/home/home.html'});
  $routeProvider.when('/404', {templateUrl: 'views/statics/404.html'});
  $routeProvider.when('/comingsoon/:feature', {templateUrl: 'views/statics/coming-soon.html'});
  $routeProvider.when('/shop', {templateUrl: 'views/shop/shop.html'});
  $routeProvider.when('/cart', {templateUrl: 'views/shop/cart.html'});
  $routeProvider.when('/track', {templateUrl: 'views/account/track.html'});
  $routeProvider.when('/login', {templateUrl: 'views/account/login.html'});
  $routeProvider.when('/register', {templateUrl: 'views/account/register.html'});
  $routeProvider.when('/account', {templateUrl: 'views/account/account.html'});
  $routeProvider.when('/checkout', {templateUrl: 'views/shop/checkout.html'});
  $routeProvider.when('/product/:id', {templateUrl: 'views/shop/view.html'});
  $routeProvider.when('/admin', {templateUrl: 'views/admin/home/home.html', controller: 'Admin'});
  $routeProvider.when('/admin/products/add', {templateUrl: 'views/admin/products/add.html', controller: 'AdminProductAdd'});
  $routeProvider.when('/admin/products/list', {templateUrl: 'views/admin/products/list.html', controller: 'AdminProductList'});
  $routeProvider.when('/admin/products/edit/:id', {templateUrl: 'views/admin/products/edit.html', controller: 'AdminProductEdit'});
  $routeProvider.otherwise({redirectTo: '/404'});   

}])

.run(['$rootScope', function($rootScope)
{
	$rootScope 

		.$on('$routeChangeStart', function()
		{
			$rootScope.showLoadingIndicator = true;
		})

	$rootScope

		.$on('$routeChangeSuccess', function()
		{
			$rootScope.showLoadingIndicator = false;
		})

	$rootScope

		.$on('$routeChangeError', function()
		{
		});
}]);
