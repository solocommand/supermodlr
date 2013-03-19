<dl class="dl-horizontal" id="<?=$form_id; ?>__field__<?=$field->path('_'); ?>__container"<?php
    if (!$field->value_isset() && $model->loaded() && isset($model->extends) && $model->extends === NULL || $field->hidden)
        {
            echo ' style="display: none"';
        } 

        ?> >

        <?= $view->get('label',$field); ?>

    <dd>

<?php 
$inherited = NULL;
if (in_array($field->name, $model->cfg('inherited')) && $model->loaded())
{
    $inherited = TRUE;
}

if (!$field->hidden && !in_array($field->name, $model->cfg('uninherited'))) { 
    ?><div id="<?=$form_id; ?>__field__<?=$field->path('_'); ?>__inherit" class='<?=$form_id; ?>inherit_container inherit_container'<?php
    //hide on field create
    if ($model->is_new() || $model->extends === NULL) {
        echo " style='display: none'";
    }?>>Inherit <?php echo $field->name; ?> <input id="<?=$form_id; ?>__field__<?=$field->path('_'); ?>__inheritcb" type="checkbox" <?php
        if ($inherited || (!isset($field->value) && $model->loaded()))
            {
                echo ' checked="checked"';
            }
        ?> /></div>
<script type="text/javascript">
$('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>__inheritcb').on('change',function(){
    if ($(this).is(':checked')) {
        //show field so it can be edited
        $(this).closest('dd').next('.field').hide();
    } else {
        //hide field so it cannot be edited
        $(this).closest('dd').next('.field').show();

        //unset the scope value
        var scope = angular.element($('#<?=$form_id; ?>__field__<?=$field->path('_'); ?>')[0]).scope();
        delete (scope.data.<?php echo $field->get_model_name(); ?>.<?php echo $field->path('.'); ?>);

    }

});

</script><?php
} 
?>

    </dd>

    <dd class="field" <?php if ($inherited === TRUE) echo 'style="display:none;"'; ?> ><?= $view->get('field',$field); ?></dd>

    <?= $view->get('errors',$field); ?>
    <?= $view->get('conditions',$field); ?>

</dl>
