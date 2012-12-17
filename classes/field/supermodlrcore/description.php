<?php defined('SYSPATH') or die('No direct script access.');
class Field_Supermodlrcore_Description extends Field 
{
	public $name = 'Description';
	public $datatype = 'string';
	public $multilingual = TRUE;
	public $charset = 'UTF-8';
	public $storage = 'single';
	public $required = FALSE;
	public $unique = FALSE;
	public $searchable = TRUE;
	public $filterable = FALSE;
	public $nullvalue = FALSE;
	public $hidden = FALSE;
	public $private = FALSE;
	public $readonly = FALSE;
	public $core = TRUE;

}