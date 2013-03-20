<?php
if (!$field->hidden)
{ ?>
	<dt class="label" ng-bind="field.name" title='<?=$field->description; ?>'></dt><?php
}