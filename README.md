COTTAGE

It is an online decentrzlized marketplace to buy and sell products which requires no middle-man/broker for transactions to take place.
Once the marketplace has been deployed, use metamask and ganache-cli to switch into accounts 1, 2 respectively so as to buy and sell products.
Every transactions will be exposed in the events section once executed through metamask

This project will be improved gradually so as it is adaptable to other environments and with more advanced features such as uPort, IPFS and infura.

In case visitors found something that can improve this project, you are most welcomed to clone and download it for polishing it.






This box has been based from [pet-shop-box](https://github.com/truffle-box/pet-shop-box).

Software version
Truffle -v4.0.7
NPM - v6.5.0
node - v11.7.0

## Installation

1. Install Truffle globally.
    ```javascript
    npm install -g truffle
    ```

2. Download the box. This also takes care of installing the necessary dependencies.
    ```javascript
    truffle unbox chainskills/chainskills-box
    ```

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    ```

5. Run the `liteserver` development server (outside the development console) for front-end hot reloading. Smart contract changes must be manually recompiled and migrated.
    ```javascript
    // Serves the front-end on http://localhost:3000
    npm run dev
 
 6 Run ganache-cli in project directory so as to import seed phrase to Metamask (together with your personal password as usual) and play with the BUY button to buy and sell products through Metamask by switching into account( private, Ropsten)
 ALl the transactions will be displayed in the EVENT section on the left hand side of the screen.
```run ganache-cli 
   switch to Metamask to buy and sell products
 
 
    ```
