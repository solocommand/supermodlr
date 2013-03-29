<input class="hidden" name="<?=$field->path('_'); ?>" type="hidden" ng-model="model.<?=$field->path('_'); ?>" />
<input class='input' name="<?=$field->path('_'); ?>_autocomplete" type="text" autocomplete="<?=$field->path('_'); ?>" />

<input type="text" ng-model="modal_form_key" />

<ul ng-model="model.<?=$field->path('_'); ?>">
    <li ng-repeat="field in model.<?=$field->path('_'); ?>" class="field">{{ field._id }} <a remove-item="{{ field }}">remove</a>
</ul>

<div class="container" modal-form>
    <div class="form"></div>
</div>