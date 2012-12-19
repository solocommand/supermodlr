<?php defined('SYSPATH') or die('No direct script access.');
class Field_Supermodlrcore__Id extends Field 
{
	public $name = '_id';
	public $datatype = 'string';
	public $multilingual = FALSE;
	public $charset = 'UTF-8';
	public $storage = 'single';
	public $required = TRUE;
	public $unique = TRUE;
	public $searchable = FALSE;
	public $filterable = TRUE;
	public $nullvalue = FALSE;
	public $hidden = TRUE;
	public $private = FALSE;
	public $readonly = TRUE;

}