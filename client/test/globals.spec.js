before(function() {
  Neno.CAApp.start();
});


describe('modules definitions', function() {

  it('should have "caapp.app" module defined', function() {
    expect(angular.module('caapp.app')).to.be.an('object');
  });

  it('should have "caapp.common" module defined', function() {
    expect(angular.module('caapp.common')).to.be.an('object');
  });

  it('should have "caapp.home" module defined', function() {
    expect(angular.module('caapp.home')).to.be.an('object');
  });

  it('should have "caapp.location" module defined', function() {
    expect(angular.module('caapp.location')).to.be.an('object');
  });

  it('should have "caapp.location.deadlines" module defined', function() {
    expect(angular.module('caapp.location.deadlines')).to.be.an('object');
  });

  it('should have "caapp.location.citizenRights" module defined', function() {
    expect(angular.module('caapp.location.citizenRights')).to.be.an('object');
  });

  it('should have "caapp.location.news" module defined', function() {
    expect(angular.module('caapp.location.news')).to.be.an('object');
  });
});
