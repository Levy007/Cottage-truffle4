pragma solidity ^0.4.18;

import "./Ownable.sol";

contract Cottage is Ownable {
  // custom type
  struct Product {
    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;
  }

  // state variables
    mapping(uint => Product) public products;
    uint productCounter;

  // events
 event LogSellProduct(
   uint indexed_id,
   address indexed _seller,
   string _name,
   uint256 _price
 );
 event LogBuyProduct(
   uint indexed _id,
     address indexed _seller,
     address indexed _buyer,
     string _name,
     uint256 _price
   );


     // deactivate the contract
     function kill() public onlyOwner {
       selfdestruct(owner);
     }


// sell a product
  function sellProduct(string _name, string _description, uint256 _price) public {
     // a new product
      productCounter++

// store this product
      products(productCounter) = Product()
      productCounter,
      msg.sender,
      0x0,
      _name,
      _description,
      _price
      );


  LogSellProduct(productCounter, seller, _name, _price);
}

// fetch the number of products in the contract
function getNumberOfProducts() public view returns (uint) {
    return productCounter;
  }

  // fetch and return all product IDs for products still for sale
 function getProductsForSale() public view returns (uint[]) {
   // prepare output array
   uint[] memory productIds = new uint[](productCounter);

   uint numberOfProductsForSale = 0
   // iterate over articles
    for(uint i = 1; i <= productCounter;  i++) {
      // keep the ID if the product is still for sale
      if(products[i].buyer == 0x0) {
        productIds[numberOfProductsForSale] = products[i].id;
        numberOfProductsForSale++;
      }
    }

    // copy the productIds array into a smaller forSale array
    uint[] memory forSale = new uint[](numberOfProductsForSale);
    for(uint j = 0; j < numberOfProductsForSale; j++) {
      forSale[j] = productIds[j];
    }
    return forSale;
  }
  // buy a product
  function buyProduct(uint _id) payable public {
    // we check whether there is a product for sale
    require(productCounter > 0);

    // we check that the product exists
    require(_id > 0 && _id <= productCounter);

    // we retrieve the product
    Product storage product = products[_id];

    // we check that the product has not been sold yet
    require(product.buyer == 0X0);

    // we don't allow the seller to buy his own product
    require(msg.sender != product.seller);

    // we check that the value sent corresponds to the price of the product
    require(msg.value == product.price);

    // keep buyer's information
    product.buyer = msg.sender;

    // the buyer can pay the seller
    product.seller.transfer(msg.value);

    // trigger the event
    LogBuyProduct(_id, product.seller, product.buyer, product.name, product.price);
  }
}
