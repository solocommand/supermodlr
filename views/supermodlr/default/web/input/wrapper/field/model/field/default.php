<?php

/**
* Field model input wrapper
* 
* Defines wrapper logic for display of angular form fields based on field inheritance and properties.
* Loads field label, field, error, and conditions templates.
* 
*/

    $inherited = NULL;
    
    if (!$field->value_isset() && $model->loaded() && isset($model->extends) && $model->extends === NULL || $field->hidden)
    {
        $style = 'display: none;';
    } 
    else
    {
        $style = '';
    }

?>

<dl class="dl-horizontal" style="<?= $style ?>">
    <!-- field.hidden || (model.hasOwnProperty('extends') && typeof(model.extends) == null && field.value == 'Supermodlr_FIELD_VALUE_NOT_SET') -->

    <?= $view->get('label',$field); ?>

    <dd>

<?php 

    if (in_array($field->name, $model->cfg('inherited')) && $model->loaded())
    {
        $inherited = TRUE;
    }

    // start field inheritance logic
    if (!$field->hidden && !in_array($field->name, $model->cfg('uninherited')))
    { 

        // Hide on field create
        if ($model->is_new() || $model->extends === NULL)
        {
            $inherit_style = 'display: none';
        }
        else
        {
            $inherit_style = '';
        }

        if ($inherited || (!isset($field->value) && $model->loaded()))
        {
            $inherit_checked = ' checked="checked"';
        }
        else
        {
            $inherit_checked = '';
        }
    
?>
        <div id="<?=$form_id; ?>__field__<?=$field->path('_'); ?>__inherit" class='<?=$form_id; ?>inherit_container inherit_container' style="<?= $inherit_style; ?>">
            <label class="checkbox">
                <input id="<?=$form_id; ?>__field__<?=$field->path('_'); ?>__inheritcb" type="checkbox" <?= $inherit_checked; ?> inherit-checkbox="<?=$field->path('_'); ?>" />
                Inherit <?= $field->name; ?>?
            </label>
        </div>


        <script type="text/javascript">
        $('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__inheritcb').on('change',function(){
            if ($(this).is(':checked')) {

                // Hide field so it cannot be edited
                $(this).closest('dd').next('.field').hide();

            } else {

                // Show field so it can be edited
                $(this).closest('dd').next('.field').show();

                // Unset the scope value
                /** 
                * var scope = angular.element($('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>')[0]).scope();
                * delete (scope.data.<?php echo $field->get_model_name(); ?>.<?php echo $field->path('.'); ?>);
                */
                console.log('@todo: unset scope value');
                console.log('@todo: create directive for field inheritance.')

            }

        });

        </script>

<?php

    } // end field inheritance logic

?>

    </dd>

    <dd class="field" <?php if ($inherited === TRUE) echo 'style="display:none;"'; ?> ><?= $view->get('field',$field); ?></dd>

    <?= $view->get('errors',$field); ?>
    <?= $view->get('conditions',$field); ?>

</dl>
