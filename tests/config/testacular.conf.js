basePath = '../../';

files = [
  JASMINE,
  JASMINE_ADAPTER,
  'lib/angularjs/angular.js',
  'lib/angularjs/angular-*.js',
  //lib/angular/angular-mocks.js',
  'views/supermodlr/default/web/js/*.js',
  'tests/*.js'
];

exclude = [
	'lib/angularjs/angular-scenario.js'
];

autoWatch = true;

browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
