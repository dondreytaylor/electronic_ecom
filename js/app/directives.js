'use strict';

/* Directives */


angular.module('myApp.directives', [])
  	
  	.directive('appVersion', ['version', function(version) {
	    return function(scope, elm, attrs) {
	      elm.text(version);
	    };
 	}])




  	.directive('comingsoon', [function()
  	{
  		return { 
  			restrict: 'E',
  			replace: true, 
  			transclude: true,
  			template: '<div id="coming-soon" ng-transclude></div>',
  			link: function()
  			{
			}
		};
  	}])

  	.directive('loadingindicator', function()
  	{
  		return { 
  			restrict: 'E',
  			replace: true,
  			template: '<div class="loading-indicator" ng-show="showLoadingIndicator"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div></div></div>',
  			link: function(scope, element, attrs)
  			{
  			}
  		}; 
  	})

 	.directive('jqinit', function($timeout)
 	{
 		
 		return { 
 			restrict: "A",
 			link: function(scope, element, attrs)
 			{	
 				// DOM CACHE
 				var $htmlbody = $('html,body'); 

 				// Make sure jQuery has been loaded
 				if (typeof $ === 'function' && typeof jQuery === 'function')
 				{
 					$(function()
 					{ 
	 					$timeout(function()
	 					{
		 					//FLEXISLIDER
							if ($.fn.flexslider)
							{ 
								$('.flexslider').flexslider({
									animation: "slide",
									start: function(slider){
									  $('body').removeClass('loading');
									}
								});
							}
							
							//JCAROUSEL
							if ($.fn.jcarousel)
							{

								$('.first-and-second-carousel').jcarousel();
							}
							
							//SLIDE TOGGLE
							if ($.fn.toggle)
							{
								$(".minicart_link").toggle(
									function() 
									{
									 		$('.cart_drop').slideDown(300);	
									}, 
									function()
									{
									 	$('.cart_drop').slideUp(300);		 
									}
								);	
							}
							
							//FORM ELEMENTS
							if ($.fn.uniform)
							{

								$("select").uniform(); 
							}

						},1000); 
					}); 
				}

				scope.$on('$routeChangeSuccess', function()
				{
					$htmlbody.stop().delay(500).animate({scrollTop:0},1000);
				}); 
 			}
 		}; 
	})

	.directive('filedrop', ['$timeout',function($timeout)
	{
		return { 
			restrict: 'A',
			link: function(scope, element, attrs)
			{

				scope.media = [];

				var dropbox = $(element);
				var message = $('.message', dropbox);
				var template = '<div class="preview">'+
							'<span class="imageHolder">'+
								'<img />'+
								'<span class="uploaded"></span>'+
							'</span>'+
							'<div class="progressHolder">'+
								'<div class="progress"></div>'+
							'</div>'+
						'</div>'; 
				
				function createImage(file)
				{

					var preview = $(template), 
						image = $('img', preview);
						
					var reader = new FileReader();
					
					image.width = 100;
					image.height = 100;
					
					reader.onload = function(e){
						
						// e.target.result holds the DataURL which
						// can be used as a source of the image:
						
						image.attr('src',e.target.result);
					};
					
					// Reading the file as a DataURL. When finished,
					// this will trigger the onload function above:
					reader.readAsDataURL(file);
					
					message.hide();
					preview.appendTo(dropbox);
					
					// Associating a preview container
					// with the file, using jQuery's $.data():
					
					$.data(file,preview);
				}

				function showMessage(msg)
				{
					message.html(msg);
				}


				$timeout(function()
				{
					if (typeof dropbox.filedrop === 'function')
					{
						dropbox.filedrop(
						{
							// The name of the $_FILES entry:
							paramname:'pic',
							
							maxfiles: 5,
					    	maxfilesize: 2,
							url: '?endpoint=Uploader',
							
							uploadFinished:function(i,file,response)
							{
								var $element = $.data(file).addClass('done');
								// response is the JSON object that post_file.php returns
								
								scope.$apply(function()
								{
									scope.media.push(response.status.file);
								}); 
							},
							
					    	error: function(err, file) 
					    	{
								switch(err) {
									case 'BrowserNotSupported':
										showMessage('Your browser does not support HTML5 file uploads!');
										break;
									case 'TooManyFiles':
										alert('Too many files! Please select 5 at most! (configurable)');
										break;
									case 'FileTooLarge':
										alert(file.name+' is too large! Please upload files up to 2mb (configurable).');
										break;
									default:
										break;
								}
							},
							
							// Called before each upload is started
							beforeEach: function(file)
							{
								if(!file.type.match(/^image\//)){
									alert('Only images are allowed!');
									
									// Returning false will cause the
									// file to be rejected
									return false;
								}
							},
							
							uploadStarted:function(i, file, len)
							{
								createImage(file);
							},
							
							progressUpdated: function(i, file, progress) 
							{
								$.data(file).find('.progress').width(progress);
							}
				    	});
					}
				
				},1); 
			}
		}
	}]);