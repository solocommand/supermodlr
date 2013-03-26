'use strict';

var app = angular.module('supermodlr', ['modelService', 'fieldService', 'ui.directives']);

/* SERVICES */

angular.module('modelService', ['ngResource']).factory('ModelService', function ($resource) {
    return $resource(
    	'/supermodlr/api/:model_name/:action/:pk_id',
    	{ model_name:'@model_name', action : '@action', pk_id: '@pk_id' },
    	{
	      'create': { method: 'POST', params: { action: 'create' } },
	      'read'  : { method: 'GET',  params: { action: 'read'   }, isArray: false },
	      'update': { method: 'POST', params: { action: 'update' } },
	      'delete': { method: 'POST', params: { action: 'delete' } },
	      'query' : { method: 'GET',	 params: { action: 'query', q: '@query' }, isArray: true }
    	}
    );
 });

angular.module('fieldService', ['ngResource']).factory('FieldService', function ($resource) {
    return $resource(
    	'/supermodlr/api/:model_name/field_data/:pk_id/:fieldname',
    	{ model_name:'@model_name', pk_id: '@pk_id', fieldname: '@fieldname' },
    	{}
    );
 });


/* CONTROLLERS */

app.controller('supermodlrCtrl', function ($scope, ModelService, FieldService) {

	// Initially populate scope with model name, id, and action
	$scope.model_name = getModel();
	$scope.pk_id 		= getModelId();
	$scope.action 		= getAction();

	$scope.autocompleteOptions = {

	};

	$scope.data = {};
	$scope.data[$scope.model_name] = {
		fields: {},
	};

	$scope.model 		= {};
	$scope.model 		= ModelService.read({
			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id
	});

	$scope.getFields = function() {
		FieldService.query({
			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id,
			// fieldname:  $scope.fieldname
		}, function(response) { 
			//console.log(response);
			//$scope.model.fields = {};
			for (var field in response) {
				var field_name = response[field].name;
				// for (var key in response[field]) {
				// 	$scope.model.fields[field_name][key] = response[field][key];
				// }
				$scope.data[$scope.model_name].fields[field_name] = response[field];	
			//console.log($scope.model);

			// @todo: Enable field validation rules. $watch element bound to field_name on scope for changes and init validation
			} 
		});
	}

	$scope.save_handler = function (response) {
		
		if (response.status == true) {
			//alert('model saved.');
         $scope.$emit('saved', response);
			window.location = document.referrer;
		} else {
			alert('Unable to save model.');
			$scope.$emit('saved', response);
			$scope.invalid(response);
		}

	}

	$scope.save = function() {
		

		// var save_params = {};
		// var response = {};

		// for (var key in $scope.model) {
		// 	if (key == 'fields') {
		// 		continue;
		// 	}
		// 	save_params[key] = $scope.model[key];
		// }

		// save_params.model_name = $scope.model_name;
		// save_params.pk_id = $scope.pk_id;


		if($scope.supermodlrForm.$valid == true) {

			if ($scope.model._id) {

				var response = $scope.model.$update({
					model_name: $scope.model_name, 
					pk_id: $scope.model._id,
				}, function(response) { $scope.save_handler(response); });

			} else {

				var response = $scope.model.$create({
					model_name: $scope.model_name,
				}, function(response) { $scope.save_handler(response); });

			}

		} else {

			// Validation notices should be displayed by the ng Form_Controller. Nothing to do.

		}


	}

	

	$scope.addField = function(struct, name) {

		console.log('@todo: Add field to model');

		console.log(struct);
		console.log(name);

		// 	function <?=$form_id; ?>__<?=$field->path('_'); ?>__add(obj,label) {

		//     var jq = $('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>');  

		//     //get the angular scope
		//     var scope = angular.element(jq[0]).scope();

		//     var exists = false;
		//     //if the scope value has not been set yet or is null
		//     if (typeof scope.data.<?=$field->get_model_name() ?>.<?=$field->path('.'); ?> == 'undefined' || scope.data.<?=$field->get_model_name() ?>.<?=$field->path('.'); ?> == null) {
		//         //get current data from field__field
		//         var json = jq.val();
		//         if (typeof json != 'array') {
		//             var arr = $.parseJSON(json);
		//         } else {
		//             var arr = json;

		//         }
		//     //if the scope already has a value
		//     } else {
		//         var arr = scope.data.<?=$field->get_model_name() ?>.<?=$field->path('.'); ?>;
		//         for (var fi = 0; fi < arr.length; fi++) {
		//             if (arr[fi]._id == obj._id) {
		//                 exists = true;
		//             }
		//         }   
		//     }
		//     //if the stored data does not parse into a valid json object
		//     if (!arr) {
		//         //create empty object
		//         arr = [];
		//     }

		//     if (!exists) {
		//         //add selected field
		//         arr.push(obj);
		        
		//         //convert field data to string
		//         json = JSON.stringify(arr);

		//         //set the string value to the input
		//         jq.val(json);

		//         //trigger input so angular detects the change
		//         jq.trigger('input');

		//         //set the object as the model.fields value
		//         scope.data.<?=$field->get_model_name() ?>.<?=$field->path('.'); ?> = arr;

		//     }
		//     if ($('#<?=$form_id; ?>__<?=$field->path('_'); ?>__listitem__'+obj._id).length == 0) {
		//         //add the ui element for this field
		//         $('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__list').append('<li id="<?=$form_id; ?>__<?=$field->path('_'); ?>__listitem__'+obj._id+'">'+label+' <a href=\'javascript:<?=$form_id; ?>__<?=$field->path('_'); ?>__remove("'+obj._id+'")\'>x</a></li>');
		//     }
		// }

	}

	$scope.removeField = function(id) {

		console.log('@todo: remove field');


		// function <?=$form_id; ?>__<?=$field->path('_'); ?>__remove(obj_id) {
		//     $('#<?=$form_id; ?>__<?=$field->path('_'); ?>__listitem__'+obj_id).remove();

		//     var jq = $('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>');

		//     var json = jq.val();

		//     var scope = angular.element(jq[0]).scope();
		//     var arr = scope.data.<?=$field->get_model_name() ?>.<?=$field->path('.'); ?>;

		//     var new_arr = [];
		//     //add all fields to array except the removed field
		//     for (var fi = 0; fi < arr.length; fi++) {
		//         if (arr[fi]._id != obj_id) {
		//             new_arr.push(arr[fi]);
		//         }
		//     }   

		//     //convert field data to string
		//     json = JSON.stringify(new_arr);

		//     //set the string value to the input
		//     jq.val(json);

		//     //trigger input so angular detects the change
		//     jq.trigger('input');

		//     //get the angular scope
		//     var scope = angular.element(jq[0]).scope();

		//     //set the object as the field.fields value
		//     scope.data.<?=$field->get_model_name() ?>.<?=$field->path('.'); ?> = new_arr; 


		// }

	}

	$scope.displayDetails = function(field, action, target) {
		
		var parent = $scope;
		var scope = parent.$new();

		var childform = $('.add_form', target);

		console.log(childform);		

		

		// if (typeof scope.data.<?=$field->get_model_name(); ?>._id == 'undefined' || !scope.data.<?=$field->get_model_name(); ?>._id)
		// {
		// 	$('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_form').html('You must save this model before fields can be added.');
		// 	$("#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_container").dialog("open");
		// 	return false;
		// }
		// var id = scope.data.<?=$field->get_model_name(); ?>._id;

		//     //empty existing options
		//     $('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_form').empty();

		//     //preloaded form with model already selected
		//     var data = {"model":{"model":"model","_id":id}};

		//     //modify field parameters before form is loaded @todo make this work on the api side
		//     var fields = {"model": {"hidden": true}};

		//     //add the name to the preloaded form
		//     if (action == 'create') {
		//         data.name = field.name;
		//         var field_id = '*';
		//     } else if (action == 'extend') {
		//         var field_id = field._id;
		//     }

		//     //create a form for this field
		//     $.ajax({
		//         'url': '/supermodlr/api/field/form/'+field_id+'/'+action+'?data='+JSON.stringify(data),
		//     }).done(function(response) {

		//         //load the form
		//         $('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_form').html(response.html);

		//         angular.bootstrap($('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_form .angular_app_container')[0],window[response.form_id+'_angular_modules']);

		//         //force-fix model json @todo why do i have to do this hack?? cannot reproduce this problem on jsfiddle: http://jsfiddle.net/EckUe/
		//         var scope = angular.element($('#'+response.form_id+'__field__name')[0]).scope();
		//         for (prop in scope.data.field) {
		//             if (typeof scope.data.field[prop] == 'string' && scope.data.field[prop].indexOf('{') == 0) {
		//                 //attempt to decode this potential json string
		//                 try {
		//                     var obj = $.parseJSON(scope.data.field[prop]);
		//                     scope.data.field[prop] = obj;
		//                 } catch (e) {

		//                 }
		//             }
		//         }

		//         //hide the submit button
		//         $('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_form .form_submit_button').hide();

		//     }); 

		//     $("#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_container").dialog("open");


		// }

	}





});

/**
* Field Controller
* Provides access to FieldService module
*
*/
app.controller('fieldCtrl', function ($scope, FieldService) {

	$scope.field = [];
	$scope.field.name = 'test';

	console.log('fieldname scope prop');
	console.log($scope.field.name);

	//$scope.readField();

});


/* DIRECTIVES */

// angular.directive('initFields', function () {

// 	return function (scope, element, attrs) {
// 		console.log('here');
// 	}

// });

app.directive('fieldInit', function () {
   return function ($scope, element, attrs) {
   	
   	//$scope.getModel();
   	$scope.getFields();

   	console.log($scope.model);

   }
});

app.directive('fieldExtends', function() {

	return function ($scope, element, attrs) {

		$scope.$watch(element, function(value) {
			console.log(value);
		});

		console.log('@todo: handle extends in fieldExtends directive.');
		console.log(attrs);

	}

});

app.directive('autocomplete', function($http, $rootScope) {

	return function ($scope, element, attrs) {

		console.log('@todo: Clear autocomplete field on init');

		$scope.$watch('model.' + attrs.name, function(value) {

			element.autocomplete({
				minLength: 2,
				source: function(request, response) {

					var url = getAPIPath() + '/field/query/?q=' + '{"where":{"name":{"\$regex":"/^' + request.term + '.*/i"},"$or":[{"model":null},{"model._id":"' + $scope.model._id + '"}]}}';

					$http.get(url).success( function(data) {

						// Store UI values in ui_data to be returned to autocompleter.
						var ui_data = [];

						// Add 'add' option to list of options.
						ui_data.push({'_id': null,'label': 'Add '+request.term, 'field': {'name': request.term}, 'action': 'create'});

						var arr = $scope.data[$scope.model_name].fields;
						
						// if the stored data does not parse into a valid json object create an empty object
						if (!arr) {

						   arr = [];
						}

						for (var i = 0; i < data.length; i++) {

						   //ensure that this value isn't already set as a field

						   for (var fi = 0; fi < arr.length; fi++) {
						       if (arr[fi]._id == data[i]._id) {
						           continue;
						       }
						   }
						   if (data[i].model == null) {
						       //add this field as a valid selection to the autocomplete select options
						       ui_data.push({'_id': data[i]._id,'label': 'Extend '+data[i].name, 'field': data[i], 'action': 'extend'});                          
						   } else if (typeof data[i].model == 'object') {
						       ui_data.push({'_id': data[i]._id,'label': 'Use '+data[i].name, 'field': data[i], 'action': 'use'});                            
						   }

						}

						response(ui_data);

					});

				},
            select: function( event, ui ) {

            	console.log('selected');
            	console.log(ui.item.action);

					if (ui.item.action == 'extend' || ui.item.action == 'create') {

						console.log('extending');

						$scope.displayDetails(ui.item.field, ui.item.action, element);

						console.log('done extending');

                } else if (ui.item.action == 'use') {

                  $scope.addField({"model": "field", "_id": ui.item.field._id},ui.item.field.name);

                }

                return false;

            }
			});

		});

		// element.autocomplete({
		// 	minLength: 2,
			
		// 	source: function (request, response) {

		// 		var url = getAPIPath() + '/field/query/?q={"where":{"name":{"\$regex":"/^' + request.term + '.*/i"},"$or":[{"model":null},{"model._id":"' + id + '"}]}}';

		// 		$http.get(url).success( function(data) {

					// // Add 'add' option
					// data.push({'_id': null,'label': 'Add '+request.term, 'field': {'name': request.term}, 'action': 'create'});



		// 			response(data.results);

  //           });

		// 	},

		// 	focus:function (event, ui) {
  //               // element.val(ui.item.label);
  //               // return false;
  //        },

  //        select:function (event, ui) {
  //   //      	console.log('selected ' + ui.item.value);

		// 		// scope.myModelId.selected = ui.item.value;
		// 		// scope.$apply;
		// 		// return false;
  //        },

  //        change:function (event, ui) {
  //               // if (ui.item === null) {
  //               //     scope.myModelId.selected = null;
  //               // }
  //        }

		// });

		// element.data("uiAutocomplete")._renderItem = function (ul, item) {

		// 	return $("<li></li>")
		// 		.data("item.autocomplete", item)
		// 		.append("<a>" + item.label + "</a>")
		// 		.appendTo(ul);
		// };

		// $scope.$watch(element, function(value) {
		// 	console.log(value);
		// });



		console.log('@todo: Handle fields autocompleter.')
	}

});




// });

	
// function supermodlrCtrl($scope, $resource, $http) {
//     $scope.form_id = '<?=$form_id ?>';
//     $scope.model_name = '<?=$model->get_name() ?>';
//     $scope.server = $resource('<?=$controller->api_path()?><?=$model->get_name() ?>/<?=$action ?>/<?=$model->pk_value() ?>');
//     $scope.$http = $http;
//     $scope.data = {};
//     $scope.data[$scope.model_name] = <?php if ($model->to_array() === array()) { echo '{}'; } else { echo json_encode($model->to_array(TRUE,TRUE)); } ?>;
//     $scope.submit = form_submit;
//     $scope.serverError = {};
//     $scope.modal_form = false;

//     $scope.invalid = form_invalid;
    
//     $scope.validate = form_validate;

//     $scope.fbl = fbl;   

//     $scope.ready = function() {
//         if (typeof window[$scope.form_id+'_readyfunctions'] != 'undefined') {
//             for (var i = 0; i < window[$scope.form_id+'_readyfunctions'].length; i++) {
//                 window[$scope.form_id+'_readyfunctions'][i]();
//             }    
//         }
//     }
    
// }

// window.supermodlr_angular_modules = ['ngResource','ui','supermodlr'];
// supermodlr = angular.module('supermodlr', window.supermodlr_angular_modules);


// supermodlr.directive('runReady', function() {
//   return function($scope, element, attrs) {
//     $scope.ready();
//   };
// });


// function form_submit() {
//     $scope = this;
//     //submit form
//     save_response = $scope.server.save($scope.data[$scope.model_name],function() {
//         //if save worked
//         if (save_response.status == true) {
//             $scope.$emit('saved',save_response);
//             if (!$scope.modal_form) {
//                 //redirect user to previous page (@todo or close modal window)
//                 <?php
//                 if (isset($controller->form_redirect))
//                 {
// ?>                  window.location.href = '<?=$controller->form_redirect ?>';<?php
//                 } 
//                 else
//                 {
// ?>                  window.location.href = document.referrer;<?php
//                 } ?>

//             }
//         //if save failed
//         } else {
//             $scope.invalid(save_response);
//         }
//     },
//     function() {
//         $scope.invalid(save_response);
//     });

// }

// function form_invalid(save_response) {
//     $scope = this;  
//     //get form object
//     var form = $scope[$scope.form_id+'Form'];

//     //invalidate form
//     form.$setValidity('server',false);

//     //invalidate all invalid fields
//     if (save_response && typeof save_response.data != 'undefined') {
//         for (field in save_response.messages) {
//             //if this message is attached to a specific field
//             if (typeof $scope.data[$scope.model_name][field] != 'undefined') {

//             }
//         }
//     }

// }

// function form_validate(field_name) {
    
//     $scope = this;  
//     $scope.$http.post(getAPIPath()+'/'+$scope.model_name+'/validate_field/*/'+field_name,$scope.data[$scope.model_name]).
//         success(function(data, status, headers, config) {
//             var form = $scope[$scope.form_id+'Form'];
//             delete($scope.serverError[field_name]);             
//             form['field__'+field_name].$setValidity('server',true);
//         }).
//         error(function(data, status, headers, config) {
//             var form = $scope[$scope.form_id+'Form'];
//             $scope.serverError[field_name] = data.message;      
//             form['field__'+field_name].$setValidity('server',false);
//         });
// }

// function fbl(o)
// {
//     console.log(o);
// }

function getModel() {
    return document.location.pathname.split('/')[2];
}

function getModelId() {
    return document.location.pathname.split('/')[4];
}

function getAPIPath() {
    return '/supermodlr/api';
}

function getAction() {
	return document.location.pathname.split('/')[3];
}