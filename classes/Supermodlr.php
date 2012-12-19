<?php defined('SYSPATH') or die('No direct script access.');

//complied file generated at installation/configuration.  
//	sets framework name and default database drivers
//	includes all files related to all fields and datatypes so that autoload isn't needed


abstract class Supermodlr extends Supermodlr_Core {
	public static $__scfg = array(
		'drivers_config' => array(
				array(
						'name'     => 'mongo',
						'driver'   => 'Supermodlr_Mongodb',
						'host'     => '127.0.0.1',
						'port'     => '27017',
						'user'     => '',
						'pass'     => '',
						'dbname'   => 'supermodlr',
						'replset'  => FALSE,
						'safe'     => TRUE,
						'fsync'    => FALSE,
				)
		),		
		'framework_name' => 'Kohana',
		
	);

}