const { test, expect } = require('@jest/globals');
const validate = require('../validatChange');
describe ("check if change less thane zero",()=>{
    test("You did not pay enough",()=>{
        expect(validate()).toBe();
    })
})

describe ("check if change more thane zero",()=>{
    test("mony back is money - price ",()=>{
        expect(validate(15,1)).toBe(14.00);
    })
})

