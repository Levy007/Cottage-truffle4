var Cottage = artifacts.require("./Cottage.sol");

// test suite
contract('Cottage', function(accounts){
  var cottageInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var productName1 = "product 1";
  var productDescription1 = "Description for product 1";
  var productPrice1 = 10;
  var productName2 = "product 2";
  var productDescription2 = "Description for product 2";
  var productPrice2 = 20;
  var sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  var buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

  it("should be initialized with empty values", function() {
    return Cottage.deployed().then(function(instance) {
       cottageInstance = instance;
   return cottageInstance.getNumberOfProducts();
    }).then(function(data) {
      assert.equal(data.toNumber(), 0, "number of products must be zero");
      return cottageInstance.getProductsForSale();
      }).then(function(data){
        assert.equal(data.length, 0, "there shouldn't be any product for sale");
      });
    });

    // sell a first product
       return Cottage.deployed().then(function(instance){
         cottageInstance = instance;
         return cottageInstance.sellProduct(
           productName1,
           productDescription1,
           web3.toWei(productPrice1, "ether"),
           {from: seller}
         );
       }).then(function(receipt){
         // check event
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogSellProduct", "event should be LogSellProduct");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "id must be 1");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, productName1, "event product name must be " + productName1);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(productPrice1, "ether"), "event product price must be " + web3.toWei(productPrice1, "ether"));

      return cottageInstance.getNumberOfProducts();
    }).then(function(data) {
      assert.equal(data, 1, "number of products must be one");

      return cottageInstance.getProductsForSale();
    }).then(function(data) {
      assert.equal(data.length, 1, "there must be one product for sale");
      assert.equal(data[0].toNumber(), 1, "product id must be 1");

      return cottageInstance.products(data[0]);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 1, "product id must be 1");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], productName1, "product name must be " + productName1);
      assert.equal(data[4], productDescription1, "product description must be " + productDescription1);
      assert.equal(data[5].toNumber(), web3.toWei(productPrice1, "ether"), "product price must be " + web3.toWei(productPrice1, "ether"));
    });
  });

  // sell a second product
  it("should let us sell a second product", function() {
    return Cottage.deployed().then(function(instance){
      cottageInstance = instance;
      return cottageInstance.sellProduct(
        productName2,
        productDescription2,
        web3.toWei(productPrice2, "ether"),
        {from: seller}
      );
    }).then(function(receipt){
      // check event
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogSellProduct", "event should be LogSellProduct");
      assert.equal(receipt.logs[0].args._id.toNumber(), 2, "id must be 2");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._name, productName2, "event product name must be " + productName2);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(productPrice2, "ether"), "event product price must be " + web3.toWei(productPrice2, "ether"));

      return cottageInstance.getNumberOfProducts();
    }).then(function(data) {
      assert.equal(data, 2, "number of products must be two");

      return cottageInstance.getProductsForSale();
    }).then(function(data) {
      assert.equal(data.length, 2, "there must be two products for sale");
      assert.equal(data[1].toNumber(), 2, "product id must be 2");

      return cottageInstance.products(data[1]);
    }).then(function(data) {
      assert.equal(data[0].toNumber(), 2, "product id must be 2");
      assert.equal(data[1], seller, "seller must be " + seller);
      assert.equal(data[2], 0x0, "buyer must be empty");
      assert.equal(data[3], productName2, "product name must be " + productName2);
      assert.equal(data[4], productDescription2, "product description must be " + productDescription2);
      assert.equal(data[5].toNumber(), web3.toWei(productPrice2, "ether"), "product price must be " + web3.toWei(productPrice2, "ether"));
    });
  });

  // buy the first product
  it("should buy a product", function(){
    return Cottage.deployed().then(function(instance) {
      cottageInstance = instance;
      // record balances of seller and buyer before the buy
      sellerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();
      return cottageInstance.buyProduct(1, {
        from: buyer,
        value: web3.toWei(productPrice1, "ether")
      });
    }).then(function(receipt){
      assert.equal(receipt.logs.length, 1, "one event should have been triggered");
      assert.equal(receipt.logs[0].event, "LogBuyProduct", "event should be LogBuyProduct");
      assert.equal(receipt.logs[0].args._id.toNumber(), 1, "product id must be 1");
      assert.equal(receipt.logs[0].args._seller, seller, "event seller must be " + seller);
      assert.equal(receipt.logs[0].args._buyer, buyer, "event buyer must be " + buyer);
      assert.equal(receipt.logs[0].args._name, productName1, "event product name must be " + productName1);
      assert.equal(receipt.logs[0].args._price.toNumber(), web3.toWei(productPrice1, "ether"), "event product price must be " + web3.toWei(productPrice1, "ether"));

      // record balances of buyer and seller after the buy
      sellerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller), "ether").toNumber();
      buyerBalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer), "ether").toNumber();

      // check the effect of buy on balances of buyer and seller, accounting for gas
      assert(sellerBalanceAfterBuy == sellerBalanceBeforeBuy + productPrice1, "seller should have earned " + productPrice1 + " ETH");
      assert(buyerBalanceAfterBuy <= buyerBalanceBeforeBuy - productPrice1, "buyer should have spent " + productPrice1 + " ETH");

      return cottageInstance.getProductsForSale();
    }).then(function(data){
      assert.equal(data.length, 1, "there should now be only 1 product left for sale");
      assert.equal(data[0].toNumber(), 2, "product 2 should be the only product left for sale");

      return cottageInstance.getNumberOfProducts();
    }).then(function(data){
      assert.equal(data.toNumber(), 2, "there should still be 2 products in total");
    });
  });
});
