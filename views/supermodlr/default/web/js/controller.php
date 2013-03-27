<?php

    $controller->js('supermodlr/lib/angularjs/angular.min.js','headertags'); 
    $controller->js('supermodlr/lib/angularui/build/angular-ui.min.js','headertags');  
    $controller->js('supermodlr/lib/angularjs/angular-resource.min.js','headertags');  
    //$controller->js('supermodlrlib/select2/select2.js','headertags');
    $controller->js('supermodlr/lib/crypto-js/md5.js','headertags');   

    $controller->js('supermodlr/lib/jqueryui/js/jquery-1.8.2.js');
    $controller->js('supermodlr/lib/jqueryui/js/jquery-ui-1.9.2.custom.min.js');

    $controller->css('/modules/supermodlr/lib/select2/select2.css');
    $controller->css('/modules/supermodlr/lib/jqueryui/css/base/minified/jquery-ui.min.css');   

    $controller->css('/modules/supermodlr/lib/jqueryui/css/ui-lightness/jquery.ui.theme.css');

    //capture the text below
    ob_start();

    echo file_get_contents(realpath(null).'/modules/supermodlr/views/supermodlr/default/web/js/controller.js');

    $controller_js = ob_get_contents(); ob_end_clean();

    $controller->js($controller_js,'headerinline');