<!-- @todo echo all possible field messages for so angular validator can display errors -->

<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.server">{{ serverError.<?=$field->path('.') ?> }}</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.maxlength">Field value too long.</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.minlength">Field value too short.</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.required"><?= $field::$default_messages['required']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.number"><?= $field::$default_messages['datatype.int']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.email">Please enter a valid email.</span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.invalues"><?= $field::$default_messages['invalues']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.nullvalue"><?= $field::$default_messages['nullvalue']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.unique"><?= $field::$default_messages['unique']; ?></span>

<!-- Storage Errors -->
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.storageSingle"><?= $field::$default_messages['storage.single']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.storageArray"><?= $field::$default_messages['storage.array']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.storageKeyedArray"><?= $field::$default_messages['storage.keyed_array']; ?></span>

<!-- Datatype Errors -->
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeString"><?= $field::$default_messages['datatype.string']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeInt"><?= $field::$default_messages['datatype.int']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeFloat"><?= $field::$default_messages['datatype.float']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeTimestamp"><?= $field::$default_messages['datatype.timestamp']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeDatetime"><?= $field::$default_messages['datatype.datetime']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeBoolean"><?= $field::$default_messages['datatype.boolean']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeRelationship"><?= $field::$default_messages['datatype.relationship']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeBinary"><?= $field::$default_messages['datatype.binary']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeResource"><?= $field::$default_messages['datatype.resource']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeObject"><?= $field::$default_messages['datatype.object']; ?></span>
<span class="error" ng-show="supermodlrForm.<?=$field->path('_') ?>.$error.datatypeMixed"><?= $field::$default_messages['datatype.mixed']; ?></span>
