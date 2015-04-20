// module.exports = function() {

    //var express = require('express');
    //var bodyParser = require('body-parser');
    var stripe = require('stripe')('sk_test_9qmjiRvHcwDWX3zzZpRktd8y');

    //var app = express();
    //app.use(bodyParser());

    //app.post('/charge', function(req, res) {
    //var stripeToken = req.body.stripeToken; will need to place token gotten from Stripe.js here!!
    //var amount = 1000;


    // source is the token sent from the frontend for the customer
    // description is a string with the customer's name
    // email is the string of their email
    // cardsource is the token sent from the frontend for the card
    // errfunction is what to do in the case of an error
    // RETURNS the string containing the customer's id
    exports.createCustomer = function (email, cardsource, person, callback) {

        // create the customer, only email address as identifying information
        stripe.customers.create ({
            email: email,
            // currency: 'usd'
            //...
        }, 
        function (err, customer) {
            if (err) {
                console.log(err.message)
                //console.log('line 30, stripe')
            }
            else { 

                // keep this id in the database for future reference
                person = customer.id

                // add a card to this customer
                if (typeof cardsource != undefined) {
                    stripe.customers.createSource(person, {source: cardsource.id}, function (err, card) {
                        if (err) 
                            console.log(err.message)
                        else {
                            callback(person)
                            // make sure to make a callback available that stores someone in the database!!!!
                            // console.log(cardsource)
                        }
                    }) 
                } 
            } 

        });
        
    }

    // getter for description (customer name)
    // RETURNS a string 
    /* function getCustomerDescription (id) {

        var person = stripe.customers.retrieve(id, function (err, obj) {

        });
        return person.description;

    } */

    // getter for email address
    // RETURNS a string
    
    exports.getCustomerEmail = function (id, callback) {

        var person = stripe.customers.retrieve(id, function (err, obj) {
            if (err)
                console.log(err.message)
            else 
                callback(obj.email)
        });
        
    } 

    // getter for account_balance (stored in cents)
    // RETURNS an int (value in cents)

    exports.getCustomerAccountBalance = function (id, callback) {

        stripe.customers.retrieve(id, function (err, obj) {
            if (err)
                console.log(err.message)
            else 
                callback(obj.account_balance)
        });
        //return person.account_balance;
        
    }

    // update a customer
    // id is a string returned by createCustomer
    // account_balance is an int, pass in -1 if you do not wish to update it
    // description is a string, pass in 'none' if you do not wish to update it
    // email is a string, pass in 'none' if you do not wish to update it
    // source is a token sent from the frontend, only pass in if you wish to update the card

    exports.updateCustomer = function (id, account_balance, description, email, source, callback) {

        // change this!!
        stripe.customers.retrieve(id, function (err, person) {

            if (err)
                console.log(err.message)
            else {

                // adjust only the necessary changes, set everything else to its original status
                if (account_balance == -1)
                    account_balance = person.account_balance
                if (description == 'none')
                    description = person.description
                if (email == 'none')
                    email = person.email

                // make changes
                if (typeof source == undefined) {
                    stripe.customers.update(id, {account_balance: account_balance, description: description, email: email}, 
                        function (err, customer) {
                            if (err)
                                console.log(err.message)
                            else 
                                callback(customer)
                    })
                }
                else {
                    stripe.customers.update(id, {account_balance: account_balance, description: description, email: email, source: source}, 
                            function (err, customer) {
                                if (err)
                                    console.log(err.message)
                                else
                                    callback(customer)
                    })
                }
            }
        });

    }

    exports.chargeCustomer = function (id, amount, description, callback) {

        stripe.charges.create({ 
            customer: id,
            currency: 'usd',
            amount: amount,
            description: description
            // can add receipt email if different
            // can add a destination if we want the money to go to a different account than our own
            // or can add a application fee to charge some money
        }, function (err, charge) {
            if (err) {
                console.log('problems with charging')
                console.log(err.message)
            }
            else {
                console.log('successfully charged', charge.amount)
                callback(charge)
            }
        });

        // can add receipt email, destination (if we don't want it passing through us), description, statement_descriptor
        // should it return anything?

    }

    // additional methods we can add: list all charges, retrieve a charge, capturing charges (keeping part of it until authorized, 
    // which must happen within 7 days), refunds


    //app.use(express.static(__dirname));
    //app.listen(process.env.PORT || 3000);
// }