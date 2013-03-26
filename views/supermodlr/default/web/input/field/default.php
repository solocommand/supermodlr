<?php

// Set up validation rules for angular

$angular_validation = '';

if ($field->storage === 'single')
{
    $maxlen_added = FALSE;
    //add max length
    if ($field->maxlength !== NULL && is_numeric($field->maxlength))
    {
        $angular_validation .= ' ng-maxlength="' . $field->maxlength . '"';
        $maxlen_added = TRUE;
    }

    //add step. set to any if this should be a decimal number
    if ($type === 'number' && $field->datatype === 'float')
    {
        $angular_validation .= " step='any'";
    }

    //loop through validation to add client side validation where possible
    if (is_array($field->validation)) 
    {
        foreach ($field->validation as $rule)
        {
            //add min/max value
            if (is_array($rule) && isset($rule[0]) && $rule[0] === 'range' && isset($rule[1]) && is_numeric($rule[1]) && isset($rule[2]) && is_numeric($rule[2]))
            {
                $angular_validation .= " min='".$rule[1]."' max='".$rule[2]."'";
            }
            //add min length
            else if (is_array($rule) && isset($rule[0]) && ($rule[0] === 'min_length' || $rule[0] === 'exact_length') && isset($rule[1]) && is_numeric($rule[1]))
            {
                $angular_validation .= " ng-minlength='".$rule[1]."'";
            }
            //add max value
            else if ($maxlen_added === FALSE && is_array($rule) && isset($rule[0]) && ($rule[0] === 'max_length' || $rule[0] === 'exact_length') && isset($rule[1]) && is_numeric($rule[1]))
            {
                $angular_validation .= " ng-maxlength='".$rule[1]."'";
            }
            //add regexp
            else if (is_array($rule) && isset($rule[0]) && $rule[0] === 'regex' && isset($rule[1][1]))
            {               
                $angular_validation .= ' ng-pattern="'.str_replace('"',"&quot;",$rule[1][1]).'"';
            }
        }
    }

}
//check for required
if ($field->required || (is_array($field->validation) && in_array(array('not_empty'),$field->validation))) 
{ 
   $angular_validation .= ' ng-required="true"';
} 

//check for readonly
if ($field->readonly && $field->value_isset()) 
{ 
    $angular_validation .= ' ng-readonly="true"';
} 



// Input type template detection

if (isset($field->values) && is_array($field->values) && count($field->values) > 0)
{

    $input_type = 'select';

    $template = <<<EOT
        <select name="{$field->path('_')}" ng-model="model.{$field->path('_')}" ng-options="value for value in model.fields.{$field->path('_')}.values" {$angular_validation} >
        </select>
EOT;

}
else
{

    
    if ($field->storage === 'single')
    {

        //if this field needs to be a number
        if ($field->datatype === 'int' || $field->datatype === 'float' || $field->datatype === 'timestamp' || (is_array($field->validation) && (in_array(array('numeric'),$field->validation) || in_array(array('decimal'),$field->validation) || in_array(array('digit'),$field->validation)))) 
        {
            $input_type = 'number';
        }
        //check for email
        else if (is_array($field->validation) && in_array('email',$field->validation) )
        {
            $input_type = 'email';
        }
        //check for url 
        else if (is_array($field->validation) && in_array('url',$field->validation) )
        {
            $input_type = 'url';
        }
        else if ($field->name == 'password') //@todo better way to decide this or just make a password template
        {
            $input_type = 'password';
        }   
        //default to text
        else
        {
            $input_type = 'text';
        }

    }

    //arrays and objects should have their own custom templates and are hidden if they end up using this template
    else
    {

        $input_type = 'hidden';

    }


    $template = <<<EOT

        <input name="{$field->path('_')}" type="{$input_type}" ng-model="model.{$field->path('_')}" {$angular_validation} />

EOT;

}

echo $template;

