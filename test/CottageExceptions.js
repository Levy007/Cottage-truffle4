// contract to be tested
var Cottage = artifacts.require("./Cottage.sol");

// test suite
contract("Cottage", function(accounts){
  var cottageInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var productName = "product 1";
  var productDescription = "Description for product 1";
  var productPrice = 10;

  // no product for sale yet
  it("should throw an exception if you try to buy a product when there is no product for sale yet", function() {
    return Cottage.deployed().then(function(instance) {
      cottageInstance = instance;
      return cottageInstance.buyProduct(1, {
        from: buyer,
        value: web3.toWei(productPrice, "ether")
      });
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return cottageInstance.getNumberOfProducts();
    }).then(function(data) {
      assert.equal(data.toNumber(), 0, "number of products must be 0");
    });
  });

  // buy a product that does not exist
  it("should throw an exception if you try to buy a product that does not exist", function(){
    return Cottage.deployed().then(function(instance){
      cottageInstance = instance;
      return cottageInstance.sellProduct(productName, productDescription, web3.toWei(productPrice, "ether"), { from: seller });
    }).then(function(receipt){
      return cottageInstance.buyProduct(2, {from: seller, value: web3.toWei(productPrice, "ether")});
    }).then(assert.fail)
    .catch(function(error) {
      assert(true);
    }).then(function() {
      return cottageInstance.products(1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "product id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], productName, "product name must be " + productName);
      assert.equal(data[4], productDescription, "product description must be " + productDescription);
      assert.equal(data[5].toNumber(), web3.toWei(productPrice, "ether"), "product price must be " + web3.toWei(productPrice, "ether"));
    });
  });

  // buying a product you are selling
  it("should throw an exception if you try to buy your own product", function() {
    return Cottage.deployed().then(function(instance){
      cottageInstance = instance;

      return cottageInstance.buyProduct(1, {from: seller, value: web3.toWei(productPrice, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return cottageInstance.products(1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "product id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], productName, "product name must be " + productName);
      assert.equal(data[4], productDescription, "product description must be " + productDescription);
      assert.equal(data[5].toNumber(), web3.toWei(productPrice, "ether"), "product price must be " + web3.toWei(productPrice, "ether"));
    });
  });

  // incorrect value
  it("should throw an exception if you try to buy a product for a value different from its price", function() {
    return Cottage.deployed().then(function(instance){
      cottageInstance = instance;
      return cottageInstance.buyProduct(1, {from: buyer, value: web3.toWei(productPrice + 1, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return cottageInstance.products(1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "product id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], productName, "product name must be " + productName);
      assert.equal(data[4], productDescription, "product description must be " + productDescription);
      assert.equal(data[5].toNumber(), web3.toWei(productPrice, "ether"), "product price must be " + web3.toWei(productPrice, "ether"));
    });
  });

  // product has already been sold
  it("should throw an exception if you try to buy a product that has already been sold", function() {
    return Cottage.deployed().then(function(instance){
      cottageInstance = instance;
      return cottageInstance.buyProduct(1, {from: buyer, value: web3.toWei(productPrice, "ether")});
    }).then(function(){
      return cottageInstance.buyProduct(1, {from: web3.eth.accounts[0], value: web3.toWei(productPrice, "ether")});
    }).then(assert.fail)
    .catch(function(error){
      assert(true);
    }).then(function() {
      return cottageInstance.products(1);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "product id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], buyer, "buyer must be " + buyer);
      assert.equal(data[3], productName, "product name must be " + productName);
      assert.equal(data[4], productDescription, "product description must be " + productDescription);
      assert.equal(data[5].toNumber(), web3.toWei(productPrice, "ether"), "product price must be " + web3.toWei(productPrice, "ether"));
    });
  });
});
