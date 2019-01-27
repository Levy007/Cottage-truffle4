App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();

    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account) {
      if(err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, "ether") + " ETH");
          }
        })
      }
    });
  },

  initContract: function() {
    $.getJSON('Cottage.json', function(cottageArtifact) {
      // get the contract artifact file and use it to instantiate a truffle contract abstraction
      App.contracts.Cottage = TruffleContract(cottageArtifact);
      // set the provider for our contracts
      App.contracts.Cottage.setProvider(App.web3Provider);
      //listen to events
      App.listenToEvents();
      // retrieve the product from the contract
      return App.reloadProducts();
    });
  },

  reloadProducts: function() {
    // avoid reentry
        if(App.loading) {
          return;
        }
        App.loading = true;


    // refresh account information because the balance might have changed
    App.displayAccountInfo();

    var cottageInstance;


    App.contracts.Cottage.deployed().then(function(instance) {
          cottageInstance = instance;
          return cottageInstance.getProductsForSale();
        }).then(function(productIds) {
         // retrieve the product placeholder and clear it
            $('#productsRow').empty();

            for(var i = 0; i < productIds.length; i++) {
                   var productId = productIds[i];
                   cottageInstance. products( productId.toNumber()).then(function( product){
                     App.displayProduct(product[0], product[1], product[3], product[4], product[5]);
                   });
                 }
                 App.loading = false;
   }).catch(function(err) {
     console.error(err.message);
     App.loading = false;
   });
 },

 displayProduct: function(id, seller, name, description, price) {
   var productsRow = $('#productsRow');

   var etherPrice = web3.fromWei(price, "ether");

   var productTemplate = $("#productTemplate");
   productTemplate.find('.panel-title').text(name);
   productTemplate.find('.product-description').text(description);
   productTemplate.find('.product-price').text(etherPrice + " ETH");
   productTemplate.find('.btn-buy').attr('data-id', id);
   productTemplate.find('.btn-buy').attr('data-value', etherPrice);

   // seller
   if (seller == App.account) {
     productTemplate.find('.product-seller').text("You");
     productTemplate.find('.btn-buy').hide();
   } else {
     productTemplate.find('.product-seller').text(seller);
     productTemplate.find('.btn-buy').show();
   }

   // add this new product
   productsRow.append(productTemplate.html());
 },

 sellProduct: function() {
   // retrieve the detail of the product
   var _product_name = $('#product_name').val();
   var _description = $('#product_description').val();
   var _price = web3.toWei(parseFloat($('#product_price').val() || 0), "ether");

   if((_product_name.trim() == '') || (_price == 0)) {
     // nothing to sell
     return false;
   }

   App.contracts.Cottage.deployed().then(function(instance) {
     return instance.sellProduct(_product_name, _description, _price, {
       from: App.account,
       gas: 500000
     });
   }).then(function(result) {

   }).catch(function(err) {
     console.error(err);
   });
 },

 // listen to events triggered by the contract
 listenToEvents: function() {
   App.contracts.Cottage.deployed().then(function(instance) {
     instance.LogSellProduct({}, {}).watch(function(error, event) {
       if (!error) {
         $("#events").append('<li class="list-group-item">' + event.args._name + ' is now for sale</li>');
       } else {
         console.error(error);
       }
       App.reloadProducts();
     });

     instance.LogBuyProduct({}, {}).watch(function(error, event) {
       if (!error) {
         $("#events").append('<li class="list-group-item">' + event.args._buyer + ' bought ' + event.args._name + '</li>');
       } else {
         console.error(error);
       }
       App.reloadProducts();
     });
   });
 },

 buyProduct: function() {
   event.preventDefault();

   // retrieve the product
   var _productId = $(event.target).data('id');
   var _price = parseFloat($(event.target).data('value'));

   App.contracts.Cottage.deployed().then(function(instance){
     return instance.buyProduct(_productId, {
       from: App.account,
       value: web3.toWei(_price, "ether"),
       gas: 500000
     });
   }).catch(function(error) {
     console.error(error);
   });
 }
};

$(function() {
 $(window).load(function() {
   App.init();
 });
});
