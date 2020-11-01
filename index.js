let moneyInser = 0;

//Dom Element
const refill = document.getElementById("refill");
const btns = document.getElementsByClassName("btn");
const codeInput = document.getElementById("code");
const clear = document.getElementById("clear");
const dispense = document.getElementById("dispense");
const moneyInput = document.getElementById("money");

const formInput = document.getElementById("display");
const price = document.getElementById('price');
let message = document.querySelector('.circle');
console.log(message)
formInput.addEventListener('change', e => {

        vendingMachine1.takeMoney(e.target.value);

    
 
 
})

function check(elem) {
    if(!elem.value.match(/^\d?\d\.\d\d$/)) {
      alert('Error in data – use the format dd.dd (d = digit)');
    }
  }
  
//=============
//  DOM Listeners
//=============
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", e => {
        vendingMachine1.enterCode(e.target.value);
    });
}
clear.addEventListener("click", () => {
    vendingMachine1.clear();
});
dispense.addEventListener("click", () => {
    vendingMachine1.dispenseRequest();
});
refill.addEventListener("click", () => {
    vendingMachine1.restock();
});



//=============
//  Snack View
//=============
const makeSodaTemplate = function (color, price) {
    return `
      <div class="can" style="
      background-image:url(${color});
      background-position: center;
       background-repeat: no-repeat;
      "></div>
    `;
};

//=============
//  Machine Class
//=============
class VendingMachine {
    constructor(name) {
        this.stock = {
            A: [null, null, null, null, null],
            B: [null, null, null, null, null],
            C: [null, null, null, null, null],
            D: [null, null, null, null, null]
        }
        this.name = name;
        this.money = 0;
        this.input = "--";

    }
    load() {
        if (localStorage && localStorage.getItem("snacks" + this.name)) {
            this.stock = JSON.parse(localStorage.getItem("snacks" + this.name));
        }
        this.set();
    }
    save() {
        if (localStorage) {
            localStorage.setItem("snacks" + this.name, JSON.stringify(this.stock));

        }
    }
    set() {
        codeInput.innerHTML = this.input;
        moneyInput.innerHTML = Number(this.money).toFixed(2);


        this.renderSnakeCans();


    }
    renderSnakeCans() {
        for (let row in this.stock) {
            this.stock[row].map(soda => {
                if (soda) {
                    let can = makeSodaTemplate(soda.color, soda.price.toFixed(2));
                    if (document.getElementById(soda.code) && soda.stock >= 1) {
                        document.getElementById(soda.code).innerHTML = can;
                    } else {
                        document.getElementById(soda.code).innerHTML = "out stock";
                    }
                }
            });
        }
    }


    // Calculates how much money was entered

    enterCode(code) {
        let one = this.input.substr(0, 1);
        let two = this.input.substr(1, 2);
        if (one == "-") {
            this.input = code + "-";
        } else if (one !== "-" && two == "-") {
            this.input = one + code;
        }
        this.set();
    }
    //clear input
    clear() {
        this.input = "--";
        this.money = 0;
        // message.innerHTML = '';
        document.getElementById('display').value = '';


        this.set();
    }
    restock() {
        this.registerSnake([chips, chocklet,sweet,cake,lazy]);
        message.innerHTML='';
    }

    registerSnake(sodas) {
        sodas.map((soda, i) => {
            const str1 = soda.code.toUpperCase().substr(0, 1);
            const str2 = Number(soda.code.substr(1, 2));
            this.stock[str1][str2 - 1] = sodas[i];
        });
        this.set();
        this.save();
    }

    takeMoney(money) {
        this.money = Number(money).toFixed(2);

        this.set();

    }
    dispenseRequest() {
        let code = this.input;
        const stock = this.stock;
        // Split the code into row and column
        code = code.split("");
        // Align with JavaScript indexing conventions
        code[1] = Number(code[1] - 1);
        // Check if Soda is in stock
        if (stock[code[0]] && stock[code[0]][code[1]]) {
            this.removeSnake(code[0], code[1]);
        } else {
            this.handleOutOfStock();
        }
    }
    compareMoney(sodaPrice) {
        if (this.money === sodaPrice) {
            this.money = 0;
            return true;
        } else if (this.money > sodaPrice) {
            this.dispenseChange(sodaPrice);
            return true;
        } else {
            this.insufficientFunds();
            return false;
        }
    }
    dispenseChange(snackPrice) {
        if (snackPrice) {
            alert("Your change is $" + (this.money - snackPrice).toFixed(2));

            this.validateChange(snackPrice)

        } else {
            alert("Your change is  $" + Number(this.money).toFixed(2));
        }

        this.clear();
        this.set();
    }

    validateChange(snackPrice) {
        let change = 0;
        change = (this.money - snackPrice).toFixed(2);
        if (change < 0) {
            message.innerHTML = `You did not pay enough `;
        } else if (change > 0) {
            message.innerHTML = "mony back is $" + (this.money - snackPrice).toFixed(2);
            setTimeout(() => {
                message.innerHTML=''
                
            }, 5000);
        } else if (change === 0) {
            message.innerHTML = this.name + "has been dispsend"

        }

    }

    insufficientFunds() {
        alert("Please enter more money");
        this.clear();
    }
    takeMoney(money) {
        this.money = Number(money);
        this.set();
    }
    removeSnake(row, index) {
        let select = this.stock[row][index];
        //check if funs are efficient
        if (!this.compareMoney(select.price)) {
            return;
        } else {
            // If amount drops below 1, make out of stock
            if (select.stock < 1) {
                select = null;
                this.handleOutOfStock();
            } else {
                select.stock--;
                alert(
                    "Dispensing a " + select.name + " " + select.stock + " remaining"
                );
            }
            this.input = "--";
        }
        this.save();
        this.set();
    }
    handleOutOfStock() {
        if (this.input === "--") {
            alert("Enter a code");
        } else {
            alert("your code its not found try again");

        }
        this.clear()
    }

}
//=============
//  Soda Class
//=============
class Snak {
    constructor(name, price, stock, image, code) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.color = image;
        this.code = code;
    }
}
// [chips, sweet, cake,chocklet,lazy
const chips = new Snak("chips", 1.25, 2, "https://image.flaticon.com/icons/svg/714/714220.svg", "A1");
const chocklet = new Snak("chocklet", 1.0, 1, "https://image.flaticon.com/icons/svg/305/305385.svg", "A3");
const sweet = new Snak('sweet',2.0,1, "https://image.flaticon.com/icons/svg/305/305385.svg" ,"B4")
const cake =new Snak("cake",2.5,3,"https://image.flaticon.com/icons/svg/810/810573.svg","A7")
const lazy = new Snak("lazy",5,5,"https://image.flaticon.com/icons/svg/776/776107.svg","C9")
//  Declare Machine that will be on site
//=============
const vendingMachine1 = new VendingMachine("vm1");
//=============
//  Load existing Local state
//=============
vendingMachine1.load();

