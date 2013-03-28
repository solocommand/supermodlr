'use strict';

var app = angular.module('supermodlr', ['modelService', 'fieldService']);

/* SERVICES */

/**
 * modelService (ModelService, model-service, model_service)
 * Forwards CRUD operations to supermodlr API
 *
 * @param: @model_name (bound @ to $scope.model_name): class_name of model to access
 * @param: @action (bound @ to $scope.action): CRUD action to pass through to API
 * @param: @pk_id (bound @ to $scope.pk_id): _id of model to load
 * @param: @query (bound @ to $scope.query): [Optional] json_encoded string passed as
 * 					an extra parameter to the API call (+?q={...})
 */
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


/**
 * fieldService (FieldService, field-service, field_service)
 * Reads field meta data from field_data supermodlr API method
 * validation, values, datatype, etc.
 *
 * @param: @model_name (bound @ to $scope.model_name): class_name of model to access
 * @param: @pk_id (bound @ to $scope.pk_id): _id of model to load
 * @param: @fieldname (bound @ to $scope.fieldname): [Optional] specific field to load. If 
 * 					omitted, returns array of all fields avaiable from the context of model_name
 */
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
	// @todo: allow these to be set by the form somehow so the form can be 
	// called anywhere, regardless of the uri.
	$scope.model_name = getModel();
	$scope.pk_id 		= getModelId();
	$scope.action 		= getAction();

	// Model meta info is stored in data under $scope.data[$model_name].
	// Fields are loaded via the $scope.getFields method.
	$scope.data = {};
	$scope.data[$scope.model_name] = {
		fields: {},
	};

	// Initialize an empty model and then update bindings via modelService API call
	$scope.model 		= {};
	$scope.model 		= ModelService.read({
			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id
	});

	// Gets field meta info from the field_data API method.
	$scope.getFields = function() {

		FieldService.query({

			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id,

		}, function(response) { 

			for (var field in response) {

				// Add returned fields to data.$model.fields
				var field_name = response[field].name;
				$scope.data[$scope.model_name].fields[field_name] = response[field];	

				// @todo: Enable field validation rules. $watch element bound to field_name on scope for changes and init validation
			} 

		});

	}

	// Handles $scope.save() call

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


	// save() method called by ng Form_Controller submit
	$scope.save = function() {
		
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
		var childcontainer = $('.container', target.parent());

		if (action == 'create') {

			data.name = field.name;
			var field_id = '*';

		} else if (action == 'extend') {

			var field_id = field._id;
		}

		var form = $('<div></div>');
		form.attr('id', field_id+'_ngForm');
		form.appendTo($('body'));


		if (typeof scope.model._id == 'undefined' || !scope.model._id)
		{
			console.log('must save');
			form.html('You must save this model before fields can be added.');
			$(childcontainer).dialog({height: 210, modal: true, buttons: {Ok: function() { $(this).dialog("close"); } } }).dialog("show");
			return false;
		}

		
			// Initialize and display modal
			form.css('display', 'inherit').dialog({
	    		autoOpen: true,
	    		height: 600,
			   width: 600,
			   modal: true,
			   buttons: {

			   	"Add Field": function() {

			   		alert('adding field');

		            // var jq = $('#<?=$form_id; ?>__field__name');

			            // //get the angular scope
			            // var scope = angular.element(jq[0]).scope();

			            // if (typeof scope.data.<?=$field->get_model_name() ?>._id == 'undefined' || !scope.data.<?=$field->get_model_name() ?>._id)
			            // { 
			            //     $("#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_container").dialog( "close" );   
			            //     return false;       
			            // }

			            // var sub_field_scope = angular.element($("#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_container div.ng-scope")[0]).scope();
			            // sub_field_scope.modal_form = true;
			            // //when the sub field is saved
			            // sub_field_scope.$on('saved',function(e,response) {
			            //     //push the new id into the scope
			            //     //sub_field_scope.data.field.fields.push(response._id);
			            //     if (typeof response.data.label != 'undefined') {
			            //         var label = response.data.label;
			            //     } else if (typeof response.data.name != 'undefined') {
			            //         var label = response.data.name;
			            //     } else {
			            //         var label = response.data._id;
			            //     }
			                
			            //     <?=$form_id; ?>__<?=$field->path('_'); ?>__add({"_id": response.data._id,"model": "field"},label);    
			                            
			            //     //close the dialog
			            //     $("#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__add_container").dialog( "close" );
			            // });

			            // //submit the sub form
			            // sub_field_scope.submit();

		            $(this).dialog("close");

	        		}
	    		},
			});


		// Reference parent model _id
		var id = scope.model._id;

		// Preload form with model already selected
		var data = {"model":{"model":"model","_id":id}};

		// Modify field parameters before form is loaded
		// @todo: make this work on the api side ??
		var fields = {"model": {"hidden": true}};

		// Add the name to the preloaded form


		// @todo: Build new form in angular. For now, pull from field api

		$.ajax({
		  'url': '/supermodlr/api/field/form/'+field_id+'/'+action+'?data='+JSON.stringify(data),
		}).done(function(response) {

			console.log('Child Model Init');


			form.html(response.html);

			// Do ang init shit

			var childScope = $scope.$new(true);

			// // // Compile the child ng App
			// // var fnLink = $compile(form);

			// // // Link child ng App
			// // fnLink(childScope);

			console.log('bootstrapping');

			$injector = angular.bootstrap($('.angular_app_container', form), ['modelService', 'fieldService']);

			console.log('done bootstrapping');



			
				//angular.bootstrap($('.angular_app_container', childform)[0], window[response.form_id+'_angular_modules']);

				// //force-fix model json @todo why do i have to do this hack?? cannot reproduce this problem on jsfiddle: http://jsfiddle.net/EckUe/
			 //  	var scope = angular.element($('#'+response.form_id+'__field__name')[0]).scope();
			 //  	for (prop in scope.data.field) {
			 //      if (typeof scope.data.field[prop] == 'string' && scope.data.field[prop].indexOf('{') == 0) {
			 //         //attempt to decode this potential json string
			 //         try {
			 //   	         var obj = $.parseJSON(scope.data.field[prop]);
			 //      	      scope.data.field[prop] = obj;
			 //         } catch (e) {

			 //         	console.log('Unable parse form JSON');
			 //         	console.log(e);

			 //         }
			 //      }
			 //  }

			  //hide the submit button
			  // $('.form_submit_button', childform).hide();

		}); 

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


// Handles autocomplete directive for model_fields, field_fields, extends, and traits
app.directive('autocomplete', function($http, $rootScope) {

	return function ($scope, element, attrs) {

		$scope.$watch('model.' + attrs.name, function(value) {

			// Append custom jQueryUI autocomplete widget
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

            	// console.log('selected');
            	// console.log(ui.item.action);

					if (ui.item.action == 'extend' || ui.item.action == 'create') {

						// console.log('extending');

						$scope.displayDetails(ui.item.field, ui.item.action, element);

						// console.log('done extending');

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