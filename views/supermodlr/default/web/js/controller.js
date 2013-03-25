'use strict';

var app = angular.module('supermodlr', ['modelService', 'fieldService']);

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

	$scope.model 		= {
		name: '',
		datatype: '',
		storage: '',
		required: false,
		unique: false,
		searchable: false,
		filterable: false,
		nullvalue: false,
		fields: {},
	};

	$scope.model 		= ModelService.read({
			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id
	});

	// $scope.getModel = function() {

	// 	// Get model from modelService service. Force read method, pass model name and ID.

	// 	$scope.model = ModelService.read({
	// 		model_name: $scope.model_name,
	// 		pk_id: 		$scope.pk_id
	// 	}, function(response) { 
	// 		//for (var prop in response) { $scope.model[prop] = response[prop]; } });
	// 	});

	// }


	$scope.getFields = function() {
		FieldService.query({
			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id,
			// fieldname:  $scope.fieldname
		}, function(response) { 
			//console.log(response);
			$scope.model.fields = {};
			for (var field in response) {
				var field_name = response[field].name;
				// for (var key in response[field]) {
				// 	$scope.model.fields[field_name][key] = response[field][key];
				// }
				$scope.model.fields[field_name] = response[field];	
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



		//console.log(response);

		// console.log(response);
		// console.log(response.status);
		// console.log(response.teaser);

		// if (response.status) {
		// 	alert('model was saved.');
		// } else {
		// 	alert('model was not saved.');
		// }

	}

	// Update scope with results from service.
	//$scope.response 	= ModelService[$scope.action]();
	//console.log($scope);

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

	// Get field data from FieldService module and set the data property on the scope.
	$scope.readField = function() {
		FieldService.query({
			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id,
			fieldname:  $scope.fieldname
		}, function(response) { for (var prop in response) { $scope.data[prop] = response[prop]; } });

	}

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