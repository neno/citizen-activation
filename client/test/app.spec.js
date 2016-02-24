describe('Neno.CAApp', function() {

  it('is defined', function() {
    expect(Neno.CAApp).to.be.an('object');
  });

  it('returns the ng module named "caapp.app" on start()', function() {
    var module = Neno.CAApp.start();
    expect(module).to.be.an('object');
    expect(module.name).to.equal('caapp.app');
  });
});
