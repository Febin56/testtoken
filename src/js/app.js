App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../Escrow.json', function(data) {
      // var petsRow = $('#petsRow');
      // var petTemplate = $('#petTemplate');

      // for (i = 0; i < data.length; i ++) {
      //   petTemplate.find('.panel-title').text(data[i].name);
      //   petTemplate.find('img').attr('src', data[i].picture);
      //   petTemplate.find('.pet-breed').text(data[i].breed);
      //   petTemplate.find('.pet-age').text(data[i].age);
      //   petTemplate.find('.pet-location').text(data[i].location);
      //   petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

      //   petsRow.append(petTemplate.html());
      // }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
      // Initialize web3 and set the provider to the testRPC.
      if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
      } else {
          // set the provider you want from Web3.providers
          App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
          web3 = new Web3(App.web3Provider);
      }

    return App.initContract();
  },

  initContract: function() {

      $.getJSON('Escrow.json', function(data) {
          // Get the necessary contract artifact file and instantiate it with truffle-contract.
          var EscrowArtifact = data;
          App.contracts.Escrow = TruffleContract(EscrowArtifact);
    
          // Set the provider for our contract.
          App.contracts.Escrow.setProvider(App.web3Provider);
    
          // Use our contract to retieve and mark the adopted pets.
          //return App.markAdopted();
      });      

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#btn_balance', App.handleBalanceOf);
    $(document).on('click', '#btn_deposit', App.handleDeposit);
    $(document).on('click', '#btn_pay', App.handlePay);
    $(document).on('click', '#btn_refund', App.handleRefund);
  },

  // markAdopted: function(adopters, account) {
  //   /*
  //    * Replace me...
  //    */
  // },

  handleBalanceOf: function () {
      var address = walletAddress.value; //= walletAddress.value;    

      var escrowInstance;

      App.contracts.Escrow.deployed().then(function(instance) {
          escrowInstance = instance;

          return escrowInstance.balanceOf.call(address);
      }).then(function(balance, error){
          if (error) {
              console.log(err.message);
              //window.App.setTransferStatus('Error: ' + error);
          } else {
              // Balance is in wei. If your token doesn't have 18 decimal places,
              // you will need to write your own conversion.
              //var walletToken = web3.fromWei(balance, 'ether');
              balanceLabel.innerText = balance.toString();
          }
      }).catch(function(err) {
          console.log(err.message);
      });
      
  },

  handlePay: function(event) {
      event.preventDefault();

      var stepId = stepPayLabel.value;
      var escrowInstance;
      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
      
          App.contracts.Escrow.deployed().then(function(instance) {
              escrowInstance = instance;
              return escrowInstance.pay(stepId,{from: account});

          }).then(function(result) {
              //return App.markAdopted();
              console.log(result);
          }).catch(function(err) {
              console.log(err.message);
          });        
      });
      
    },

  handleDeposit: function(event) {
      event.preventDefault();

      //var petId = parseInt($(event.target).data('id'));
      var stepId = stepIdLabel.value;
      var fromAddr = fromAddrLabel.value.toString();
      var toAddr = toAddrLabel.value.toString();
      var tokenAmt = tokAmntLabel.value;

      var escrowInstance;
      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }

          var account = accounts[0];
      
          App.contracts.Escrow.deployed().then(function(instance) {
              escrowInstance = instance;
              return escrowInstance.deposit(stepId,fromAddr,toAddr,tokenAmt,{from: account, gas: 3000000});

          }).then(function(result) {
              //return App.markAdopted();
              console.log(result);
          }).catch(function(err) {
              console.log(err.message);
          });        
      });     
  },


  handleRefund: function(event) {
    event.preventDefault();

    //var petId = parseInt($(event.target).data('id'));
    var stepId = stepRfdLabel.value;
    
    var escrowInstance;
    web3.eth.getAccounts(function(error, accounts) {
        if (error) {
            console.log(error);
        }

        var account = accounts[0];
    
        App.contracts.Escrow.deployed().then(function(instance) {
            escrowInstance = instance;
            return escrowInstance.deposit(stepId,{from: account});

        }).then(function(result) {
            //return App.markAdopted();
            console.log(result);
        }).catch(function(err) {
            console.log(err.message);
        });        
    });     
}


};

var walletAddress = document.getElementById('balAddr');
var balanceLabel = document.getElementById('lbl_balance');
var stepIdLabel = document.getElementById('step_id');
var fromAddrLabel = document.getElementById('fromAddr');
var toAddrLabel = document.getElementById('toAddr');
var tokAmntLabel = document.getElementById('tokAmnt');
var stepPayLabel = document.getElementById('step_pay');
var stepRfdLabel = document.getElementById('step_rfd');

$(function() {
  $(window).load(function() {
    App.init();
  });
});
