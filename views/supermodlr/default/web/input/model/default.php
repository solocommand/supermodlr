<?=$view->get_view('js/controller'); ?>

<div class="angular_app_container" ng-app="supermodlr" ng-controller="supermodlrCtrl" run-ready>
	<div id="form_container__supermodlr">
		<form class="simple-form" ng-submit="save()" name="supermodlrForm" field-init>

			<!--<fieldset ng-repeat="field in model.fields">-->

			<?php 
			foreach ($fields as $field)
			{
				if ($field->hidden) continue;
				$view->set('field',$field);
				echo $view->get('wrapper',$field);
				
			}

			?>

			<!--</fieldset>-->

			
			<button class="btn" ng-model="invalid" ng-disabled="{{$invalid}}">{{ action | uppercase }} {{model_name | uppercase}}</button>

		</form>
	</div>
</div>

