// ********************** Mint Token *********************

async function mintToken() {
    results = "Connecting to " + getNet() + "....";
    standbyResultField.innerHTML = results;
    let net = getNet();
    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    const client = new xrpl.Client(net);
    await client.connect();
    results += "<br/>Connected. Minting NFToken.";
    standbyResultField.innerHTML = results;

    // Note that you must convert the token URL to a hexadecimal
    // value for this transaction.
    // ------------------------------------------------------------------------
    const transactionBlob = {
        TransactionType: "NFTokenMint",
        Account: standby_wallet.classicAddress,
        URI: xrpl.convertStringToHex(standbyTokenUrlField.value),
        Flags: parseInt(standbyFlagsField.value),
        TransferFee: parseInt(standbyTransferFeeField.value),
        NFTokenTaxon: 0 //Required, but if you have no use for it, set to zero.
    };

    // ----------------------------------------------------- Submit signed blob
    const tx = await client.submitAndWait(transactionBlob, {
        wallet: standby_wallet
    });
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    });

    // ------------------------------------------------------- Report results
    results += "<br/><br/>Transaction result: " + tx.result.meta.TransactionResult;
    results += "<br/><br/>nfts: " + JSON.stringify(nfts, null, 2);
    standbyBalanceField.innerHTML = await client.getXrpBalance(
        standby_wallet.address
    );
    standbyResultField.innerHTML = results;
    client.disconnect();
} //End of mintToken()

// *******************************************************
// ******************* Get Tokens ************************
// *******************************************************

async function getTokens() {
    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + net + "...";
    standbyResultField.innerHTML = results;
    await client.connect();
    results += "<br/>Connected. Getting NFTokens...";
    standbyResultField.innerHTML = results;
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    });
    results += "<br/>NFTs:<br/> " + JSON.stringify(nfts, null, 2);
    standbyResultField.innerHTML = results;
    client.disconnect();
} //End of getTokens()

// *******************************************************
// ********************* Burn Token **********************
// *******************************************************

async function burnToken() {
    const standby_wallet = xrpl.Wallet.fromSeed(standbySeedField.innerHTML);
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + net + "...";
    standbyResultField.innerHTML = results;
    await client.connect();
    results += "<br/>Connected. Burning NFToken...";
    standbyResultField.innerHTML = results;

    // ------------------------------------------------------- Prepare transaction
    const transactionBlob = {
        TransactionType: "NFTokenBurn",
        Account: standby_wallet.classicAddress,
        NFTokenID: standbyTokenIdField.value
    };

    //---------------------------------- Submit transaction and wait for the results
    const tx = await client.submitAndWait(transactionBlob, {
        wallet: standby_wallet
    });
    const nfts = await client.request({
        method: "account_nfts",
        account: standby_wallet.classicAddress
    });
    results += "<br/>Transaction result: " + tx.result.meta.TransactionResult;
    results +=
        "<br/>Balance changes: " +
        JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2);
    standbyResultField.innerHTML = results;
    standbyBalanceField.innerHTML = await client.getXrpBalance(
        standby_wallet.address
    );
    results += "<br/>NFTs: <br/>" + JSON.stringify(nfts, null, 2);
    standbyResultField.innerHTML = results;
    client.disconnect();
} // End of burnToken()

// **********************************************************************
// ****** Reciprocal Transactions ***************************************
// **********************************************************************

// *******************************************************
// ************** Operational Mint Token *****************
// *******************************************************

async function oPmintToken() {
    results = "Connecting to " + getNet() + "....";
    operationalResultField.innerHTML = results;
    let net = getNet();
    const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.innerHTML);
    const client = new xrpl.Client(net);
    await client.connect();
    results += "<br/>Connected. Minting NFToken.";
    operationalResultField.innerHTML = results;

    // Note that you must convert the token URL to a hexadecimal
    // value for this transaction.
    // ------------------------------------------------------------------------
    const transactionBlob = {
        TransactionType: "NFTokenMint",
        Account: operational_wallet.classicAddress,
        URI: xrpl.convertStringToHex(operationalTokenUrlField.value),
        Flags: parseInt(operationalFlagsField.value),
        TransferFee: parseInt(operationalTransferFeeField.value),
        NFTokenTaxon: 0 //Required, but if you have no use for it, set to zero.
    };

    // ----------------------------------------------------- Submit signed blob
    const tx = await client.submitAndWait(transactionBlob, {
        wallet: operational_wallet
    });
    const nfts = await client.request({
        method: "account_nfts",
        account: operational_wallet.classicAddress
    });

    // ------------------------------------------------------- Report results
    results += "<br/><br/>Transaction result: " + tx.result.meta.TransactionResult;
    results += "<br/><br/>nfts: " + JSON.stringify(nfts, null, 2);
    operationalBalanceField.innerHTML = await client.getXrpBalance(
        operational_wallet.address
    );
    operationalResultField.innerHTML = results;

    client.disconnect();
} //End of oPmintToken

// *******************************************************
// ************** Operational Get Tokens *****************
// *******************************************************

async function oPgetTokens() {
    const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.innerHTML);
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "...";
    operationalResultField.innerHTML = results;
    await client.connect();
    results += "<br/>Connected. Getting NFTokens...";
    operationalResultField.innerHTML = results;
    const nfts = await client.request({
        method: "account_nfts",
        account: operational_wallet.classicAddress
    });
    results += "<br/>NFTs:<br/> " + JSON.stringify(nfts, null, 2);
    operationalResultField.innerHTML = results;
    client.disconnect();
} //End of oPgetTokens

// *******************************************************
// ************* Operational Burn Token ******************
// *******************************************************

async function oPburnToken() {
    const operational_wallet = xrpl.Wallet.fromSeed(operationalSeedField.innerHTML);
    let net = getNet();
    const client = new xrpl.Client(net);
    results = "Connecting to " + getNet() + "...";
    operationalResultField.innerHTML = results;
    await client.connect();
    results += "<br/>Connected. Burning NFToken...";
    operationalResultField.innerHTML = results;

    // ------------------------------------------------------- Prepare transaction
    const transactionBlob = {
        TransactionType: "NFTokenBurn",
        Account: operational_wallet.classicAddress,
        NFTokenID: operationalTokenIdField.value
    };

    //-------------------------------------------------------- Submit signed blob
    const tx = await client.submitAndWait(transactionBlob, {
        wallet: operational_wallet
    });
    const nfts = await client.request({
        method: "account_nfts",
        account: operational_wallet.classicAddress
    });
    results += "<br/>Transaction result: " + tx.result.meta.TransactionResult;
    results +=
        "<br/>Balance changes: " +
        JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2);
    operationalResultField.innerHTML = results;
    operationalBalanceField.innerHTML = await client.getXrpBalance(
        operational_wallet.address
    );
    operationalBalanceField.innerHTML = await client.getXrpBalance(
        operational_wallet.address
    );
    results += "<br/>NFTs: <br/>" + JSON.stringify(nfts, null, 2);
    operationalResultField.innerHTML = results;
    client.disconnect();
}
// End of oPburnToken()