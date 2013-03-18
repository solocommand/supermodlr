'use strict';

/* jasmine specs for controllers go here */
describe('supermodlrCtrl', function() {

  beforeEach(function() {

  });

  it('should pass', function() {

    expect(true).toBe(true);

  });



});


describe('modelService', function() {

  beforeEach(angular.module('modelService'));

  describe('read', function() {

    it('should return true', function() {

      var res = modelService.read('field', 'read', 'Field_Supermodlrcore_Useraccesstags');

      expect(res).toContain('_id');

    });
      

  });
});