'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 299, 5000, 175],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const account5 = {
  owner: 'Terry Rossi',
  movements: [11, 22, -333, -44, 5555, -666, 77, -8, 99],
  interestRate: 10,
  pin: 5555,
};

const accounts = [account1, account2, account3, account4, account5];

// Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
// console.log(formatter.format(2500)); /* $2,500.00 */

const createUserId = accounts.forEach(
  account =>
    (account.userId = account.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join(''))
);
console.log(accounts);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelSumInterestRate = document.querySelector(
  '.summary__value--interestRate'
);
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;
// let currentBalance;
let accountTo;
let moneyToTransfer;

const displayMovements = function (account) {
  containerMovements.innerHTML = '';

  account.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
  <div class="movements__type movements__type--${type}">${i} ${type}</div>
  <div class="movements__value">${formatter.format(mov)}</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const CalcAndDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatter.format(account.balance)}`;
};

const CalcAndDisplaySummary = function (account) {
  const deposits = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov, i, arr) => mov + acc, 0);
  labelSumIn.textContent = `${formatter.format(deposits)}`;

  const withdraws = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov, i, arr) => mov + acc, 0);
  labelSumOut.textContent = `${formatter.format(withdraws)}`;

  const interests = account.movements
    .filter(deposit => deposit > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterestRate.textContent = `${account.interestRate}%`;
  labelSumInterest.textContent = `${formatter.format(interests)}`;
};

const DisplayUi = function (account) {
  // console.log(currentAccount.movements);
  displayMovements(account);
  CalcAndDisplayBalance(account);
  CalcAndDisplaySummary(account);
};

// Create Event handler

btnLogin.addEventListener('click', function (e) {
  // Prevent from submitting
  e.preventDefault();
  currentAccount = accounts.find(
    account => account.userId === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(`Logged In as: ${currentAccount.userId}`);
    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // Clear ID and PSW values
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    // Remove focus (cursor) on last entered field (psw)
    inputLoginPin.blur();
    // Display all fields
    DisplayUi(currentAccount);
  } else {
    console.log('NOT Logged In');
    labelWelcome.textContent = `Please Enter a Valid ID and PSW`;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  moneyToTransfer = Number(inputTransferAmount.value);
  accountTo = accounts.find(
    account => account?.userId === inputTransferTo.value
  );
  console.log('1', accountTo, moneyToTransfer);
  if (accountTo) {
    if (moneyToTransfer > 0) {
      if (accountTo.userId !== currentAccount.userId) {
        if (moneyToTransfer <= currentAccount.balance) {
          currentAccount.movements.push(-moneyToTransfer);
          accountTo.movements.push(moneyToTransfer);
          inputTransferAmount.value = '';
          inputTransferTo.value = '';
          DisplayUi(currentAccount);
        } else {
          console.log('NOT ENOUGH MONEY on your account!!!!');
          inputTransferAmount.focus();
        }
      } else {
        console.log("You can't send money to yourself");
        inputTransferTo.focus();
      }
    } else {
      console.log('Please enter amount to Transfer');
      inputTransferAmount.focus();
    }
  } else {
    console.log('Please enter account to Transfer');
    inputTransferTo.focus();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0) {
    console.log(
      currentAccount.movements,
      loanAmount,
      currentAccount.movements.some(mov => {
        console.log(mov);
        return mov > loanAmount;
      })
    );
    if (currentAccount.movements.some(mov => mov > loanAmount)) {
      currentAccount.movements.push(loanAmount);
      inputLoanAmount.value = '';
      DisplayUi(currentAccount);
    } else {
      console.log(
        'You requesting too much. Max is ',
        currentAccount.movements.reduce((acc, mov) => {
          if (acc > mov) {
            return acc;
          } else {
            return mov;
          }
        }, currentAccount.movements[0])
      );
    }
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(inputCloseUsername.value, currentAccount.userId);
  console.log(inputClosePin.value, currentAccount.pin);
  if (inputCloseUsername.value === currentAccount.userId) {
    if (Number(inputClosePin.value) === currentAccount.pin) {
      const accountIndex = accounts.findIndex(
        account => account.userId === currentAccount.userId
      );
      console.log('accounts before', accounts);
      accounts.splice(accountIndex, 1);
      console.log('accounts after', accounts);
      // Logout
      containerApp.style.opacity = 0;
      // Clear ID and PSW values
      inputClosePin.value = '';
      inputCloseUsername.value = '';
    } else {
      console.log('Invalid PIN');
      inputClosePin.value = '';
      inputClosePin.focus();
    }
  } else {
    console.log('Invalid Account. Please re-enter.');
    inputCloseUsername.focus();
  }
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

/********************/
/******** AXIOS  ************
/***********************/

// const axios = require('axios');
// const cheerio = require('cheerio');

// console.log('INSIDE AXIOS');

// axios
//   //   .get("https://blog.logrocket.com/")
//   .get('https://weirdworlds.com/mint')
//   .then(response => {
//     const $ = cheerio.load(response.data);

//     const featuredArticles = $('.css-7fmwxc');
//     console.log(featuredArticles);
//   })
//   .catch(err => console.log('Fetch error ' + err));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// const arr1 = [1, 2, 3];
// const arr2 = [4, 5, 6];
// const [...arr3] = [...arr1, ...arr2];
// console.log(arr3);
// console.log(Math.trunc(Math.random() * 5 + 1)); // between 1 and 5

///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners 
about their dog's age, and stored the data into an array (one array for each). 
For now, they are just interested in knowing whether a dog is an adult or a puppy.
 A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages 
('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs 
actually have cats, not dogs! So create a shallow copy of Julia's array, 
and remove the cat ages from that copied array (because it's a bad practice 
to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice(1, -2);
//   console.log(dogsJulia, dogsJuliaCorrected);
//   const dogsTotal = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogsTotal);
//   dogsTotal.forEach((dog, i) => {
//     if (dog <= 3) {
//       console.log(`Dog ${i + 1} is a puppy at ${dog}`);
//     } else {
//       console.log(`Dog ${i + 1} is an adult at ${dog}`);
//     }
//   });
// };
// checkDogs(dogsJulia, dogsKate);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [5, 2, 4, 1, 15, 8, 3];
// const dogsKate = [16, 6, 10, 5, 6, 1, 4];

// let humanAgeJulia = [];
// let newDogsJulia = [];
// const calcAverageHumanAge = dogsJulia.forEach((age, i) => {
//   if (age <= 2) humanAgeJulia.push(age * 2);
//   else humanAgeJulia.push(age * 4 + 16);
//   if (humanAgeJulia[i] >= 18) newDogsJulia.push(age);
// });

// const calcAverageHumanAge = dogsJulia.forEach((age, i) => {
//   age <= 2 ? humanAgeJulia.push(age * 2) : humanAgeJulia.push(age * 4 + 16);
//   if (humanAgeJulia[i] >= 18) newDogsJulia.push(age);
// });

// const calcAverageHumanAge = function (dogsJulia) {
//   const humanAges = dogsJulia.map(age => (age <= 2 ? age * 2 : age * 4 + 16));
//   .filter(age => age >= 18);

//   console.log(dogsJulia, humanAges);
//   const totalHumanAge = humanAges.reduce((acc, age) => acc + age, 0);
//   console.log('Average = ', (totalHumanAge / humanAges.length).toFixed(2));
// };
// calcAverageHumanAge(dogsJulia);
// console.log(dogsJulia, humanAgeJulia, newDogsJulia);
// const totalHumanAge = humanAge.reduce((acc, age) => acc + age, 0);
// console.log('Average = ', (totalHumanAge / humanAgeJulia.length).toFixed(2));
// console.log('Average = ', (totalHumanAge / humanAge.length).toFixed(2));

///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const dogsJulia = [5, 2, 4, 1, 15, 8, 3];
// const dogsKate = [16, 6, 10, 5, 6, 1, 4];

// const avgAge = dogsJulia
//   .map((age, i, arr) => {
//     console.log(arr);
//     return age <= 2 ? age * 2 : age * 4 + 16;
//   })
//   .filter((hAge, i, arr) => {
//     console.log(arr);
//     return hAge > 18;
//   })
//   .reduce((acc, hAge, i, arr) => {
//     console.log(arr);
//     return acc + hAge / arr.length;
//   }, 0);
// console.log(avgAge);
