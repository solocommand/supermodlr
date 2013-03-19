'use strict';

var app = angular.module('supermodlr', ['modelService']);

/* SERVICES */

// angular.module('supermodlr.services', [])
// 	.service('modelORM', function ($http) {

// 		var read = function(model_name, action, pk_id) {

// 			console.log('service read start');
// 			console.log(model_name);
// 			console.log(action);
// 			console.log(pk_id);
// 			console.log('service read done');

// 			return true;
			

// 	// 	$http({
//    //          method: 'get',
//    //          url: 'http://ws.geonames.org/searchJSON?callback=JSON_CALLBACK',
//    //          params: {
//    //              featureClass: "P",
//    //              style: "full",
//    //              maxRows: 12,
//    //              name_startsWith: request.destName
//    //          }
//    //      }).success(function (data, status) {
//    //          console.log(data);
//    //          response($.map(innerMatch(data.geonames), matcher));
//    //      });

// 		};

// 	}
// );

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


/* CONTROLLERS */

app.controller('supermodlrCtrl', function ($scope, ModelService) {

	// Initially populate scope with model name, id, and action
	$scope.model_name = getModel();
	$scope.pk_id 		= getModelId();
	$scope.action 		= getAction();

	$scope.readModel = function() {

		// Get model from modelService service. Force read method, pass model name and ID.

		$scope.action = 'read';
		ModelService.read({
			model_name: $scope.model_name,
			pk_id: 		$scope.pk_id
		}, function(response) { for (var prop in response) { $scope[prop] = response[prop]; } });

	
	}

	$scope.save = function() {
		ModelService.update();
	}

	$scope.readModel();



	

	// Update scope with results from service.
	//$scope.response 	= ModelService[$scope.action]();
	console.log($scope);

});


// app.directive('supermodlrForm', function supermodlrForm($scope) {



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