// **************** Configure Account ********************

async function configureAccount(type, rippleDefault) {
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "....";
    standbyResultField.innerHTML = results;
    await client.connect();
    results += "<br/>Connected, finding wallet.";
    standbyResultField.innerHTML = results;

    if (type == "standby") {
        my_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    } else {
        my_wallet = xrpl.Wallet.fromSeed(operationalSeedField.innerHTML);
    }
    results += "Ripple Default Setting: " + rippleDefault;
    standbyResultField.innerHTML = results;

    let settings_tx = {};
    if (rippleDefault) {
        settings_tx = {
            TransactionType: "AccountSet",
            Account: my_wallet.address,
            SetFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple
        };
        results += "<br/> Set Default Ripple flag.";
    } else {
        settings_tx = {
            TransactionType: "AccountSet",
            Account: my_wallet.address,
            ClearFlag: xrpl.AccountSetAsfFlags.asfDefaultRipple
        };
        results += "<br/> Clear Default Ripple flag.";
    }
    results += "<br/>Sending account setting.";
    standbyResultField.innerHTML = results;

    const cst_prepared = await client.autofill(settings_tx);
    const cst_signed = my_wallet.sign(cst_prepared);
    const cst_result = await client.submitAndWait(cst_signed.tx_blob);
    if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
        results += "<br/>Account setting succeeded.";
        standbyResultField.innerHTML = results;
    } else {
        throw "Error sending transaction: ${cst_result}";
        results += "<br/>Account setting failed.";
        standbyResultField.innerHTML = results;
    }

    client.disconnect();
} // End of configureAccount()

// *******************************************************
// ***************** Create TrustLine ********************
// *******************************************************

async function createTrustline() {
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "....";
    standbyResultField.innerHTML = results;

    await client.connect();

    results += "<br/>Connected.";
    standbyResultField.innerHTML = results;

    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    const operational_wallet = xrpl.Wallet.fromSeed(
        operationalSeedField.innerHTML
    );
    const currency_code = standbyCurrencyField.value;
    const trustSet_tx = {
        TransactionType: "TrustSet",
        Account: standbyDestinationField.value,
        LimitAmount: {
            currency: standbyCurrencyField.value,
            issuer: standby_wallet.address,
            value: standbyAmountField.value
        }
    };
    const ts_prepared = await client.autofill(trustSet_tx);
    const ts_signed = operational_wallet.sign(ts_prepared);
    results +=
        "<br/>Creating trust line from operational account to standby account...";
    standbyResultField.innerHTML = results;
    const ts_result = await client.submitAndWait(ts_signed.tx_blob);
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        results +=
            "<br/>Trustline established between account <br/>" +
            standbyDestinationField.value +
            " <br/> and account<br/>" +
            standby_wallet.address +
            ".";
        standbyResultField.innerHTML = results;
    } else {
        results += "<br/>TrustLine failed. See JavaScript console for details.";
        standbyResultField.innerHTML = results;
        throw "Error sending transaction: ${ts_result.result.meta.TransactionResult}";
    }
} //End of createTrustline()

// *******************************************************
// *************** Send Issued Currency ******************
// *******************************************************

async function sendCurrency() {
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "....";
    standbyResultField.innerHTML = results;

    await client.connect();

    results += "<br/>Connected.";
    standbyResultField.value = results;

    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    const operational_wallet = xrpl.Wallet.fromSeed(
        operationalSeedField.innerHTML
    );
    const currency_code = standbyCurrencyField.value;
    const issue_quantity = standbyAmountField.value;

    const send_token_tx = {
        TransactionType: "Payment",
        Account: standby_wallet.address,
        Amount: {
            currency: standbyCurrencyField.value,
            value: standbyAmountField.value,
            issuer: standby_wallet.address
        },
        Destination: standbyDestinationField.value
    };

    const pay_prepared = await client.autofill(send_token_tx);
    const pay_signed = standby_wallet.sign(pay_prepared);
    results +=
        "Sending " +
        standbyAmountField.value +
        standbyCurrencyField.value +
        "to " +
        standbyDestinationField.value +
        "...";
    standbyResultField.innerHTML = results;
    const pay_result = await client.submitAndWait(pay_signed.tx_blob);
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        results +=
            "Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}";
        standbyResultField.innerHTML = results;
    } else {
        results += "Transaction failed: See JavaScript console for details.";
        standbyResultField.innerHTML = results;
        throw "Error sending transaction: ${pay_result.result.meta.TransactionResult}";
    }
    standbyBalanceField.innerHTML = await client.getXrpBalance(
        standby_wallet.address
    );
    operationalBalanceField.innerHTML = await client.getXrpBalance(
        operational_wallet.address
    );
    getBalances();
    client.disconnect();
} // end of sendIOU()

// *******************************************************
// ****************** Get Balances ***********************
// *******************************************************

async function getBalances() {
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "....";
    standbyResultField.innerHTML = results;

    await client.connect();

    results += "<br/>Connected.";
    standbyResultField.innerHTML = results;

    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    const operational_wallet = xrpl.Wallet.fromSeed(
        operationalSeedField.innerHTML
    );

    results = "<br/>Getting standby account balances...<br/>";
    const standby_balances = await client.request({
        command: "gateway_balances",
        account: standby_wallet.address,
        ledger_index: "validated",
        hotwallet: [operational_wallet.address]
    });
    results += JSON.stringify(standby_balances.result, null, 2);
    standbyResultField.innerHTML = results;

    results = "<br/>Getting operational account balances...<br/>";
    const operational_balances = await client.request({
        command: "account_lines",
        account: operational_wallet.address,
        ledger_index: "validated"
    });
    results += JSON.stringify(operational_balances.result, null, 2);
    operationalResultField.innerHTML = results;

    operationalBalanceField.innerHTML = await client.getXrpBalance(
        operational_wallet.address
    );
    standbyBalanceField.innerHTML = await client.getXrpBalance(
        standby_wallet.address
    );

    client.disconnect();
} // End of getBalances()

// **********************************************************************
// ****** Reciprocal Transactions ***************************************
// **********************************************************************

// *******************************************************
// ************ Create Operational TrustLine *************
// *******************************************************

async function oPcreateTrustline() {
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "....";
    operationalResultField.innerHTML = results;

    await client.connect();

    results += "<br/>Connected.";
    operationalResultField.innerHTML = results;

    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    const operational_wallet = xrpl.Wallet.fromSeed(
        operationalSeedField.innerHTML
    );
    const trustSet_tx = {
        TransactionType: "TrustSet",
        Account: operationalDestinationField.value,
        LimitAmount: {
            currency: operationalCurrencyField.value,
            issuer: operational_wallet.address,
            value: operationalAmountField.value
        }
    };
    const ts_prepared = await client.autofill(trustSet_tx);
    const ts_signed = standby_wallet.sign(ts_prepared);
    results +=
        "<br/>Creating trust line from operational account to " +
        operationalDestinationField.value +
        " account...";
    operationalResultField.innerHTML = results;
    const ts_result = await client.submitAndWait(ts_signed.tx_blob);
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        results +=
            "<br/>Trustline established between account <br/>" +
            standby_wallet.address +
            " <br/> and account<br/>" +
            operationalDestinationField.value +
            ".";
        operationalResultField.innerHTML = results;
    } else {
        results += "<br/>TrustLine failed. See JavaScript console for details.";
        operationalResultField.innerHTML = results;
        throw "Error sending transaction: ${ts_result.result.meta.TransactionResult}";
    }
} //End of oPcreateTrustline

// *******************************************************
// ************* Operational Send Issued Currency ********
// *******************************************************

async function oPsendCurrency() {
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "....";
    operationalResultField.value = results;

    await client.connect();

    results += "<br/>Connected.";
    operationalResultField.innerHTML = results;

    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.value);
    const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.value);
    const currency_code = operationalCurrencyField.value;
    const issue_quantity = operationalAmountField.value;

    const send_token_tx = {
        TransactionType: "Payment",
        Account: operational_wallet.address,
        Amount: {
            currency: currency_code,
            value: issue_quantity,
            issuer: operational_wallet.address
        },
        Destination: operationalDestinationField.value
    };

    const pay_prepared = await client.autofill(send_token_tx);
    const pay_signed = operational_wallet.sign(pay_prepared);
    results +=
        "Sending" +
        operationalAmountField.value +
        operationalCurrencyField.value +
        " to " +
        operationalDestinationField.value +
        "...";
    operationalResultField.innerHTML = results;
    const pay_result = await client.submitAndWait(pay_signed.tx_blob);
    if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
        results +=
            "Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}";
        operationalResultField.innerHTML = results;
    } else {
        results += "Transaction failed: See JavaScript console for details.";
        operationalResultField.innerHTML = results;
        throw "Error sending transaction: ${pay_result.result.meta.TransactionResult}";
    }
    standbyBalanceField.innerHTML = await client.getXrpBalance(
        standby_wallet.address
    );
    operationalBalanceField.innerHTML = await client.getXrpBalance(
        operational_wallet.address
    );
    getBalances();
    client.disconnect();
} // end of oPsendCurrency()