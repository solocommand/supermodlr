<!-- @todo echo all possible field messages for so angular validator can display errors -->

<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.server">{{ serverError.<?=$field->path('.') ?> }}</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.maxlength">Field value too long.</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.required">Required Field</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.number">Please enter a valid number.</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.email">Please enter a valid email.</span>

