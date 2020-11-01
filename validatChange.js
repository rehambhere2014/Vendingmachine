function validateChange(money,snackPrice) {
    let res="";
    let change = 0;
    change = (money - snackPrice).toFixed(2);
    if (change < 0) {
        res=0.00
    } else if (change > 0) {
        
        res ="mony back is $" + (money - snackPrice).toFixed(2);

    } else if (change === 0) {
        res =0.00

    }
return res;
}



module.exports= validateChange;