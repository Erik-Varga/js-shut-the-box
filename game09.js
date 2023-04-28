//DOM Elements
const d1container = document.getElementById('dice_1');
const d2container = document.getElementById('dice_2');
const flaps = document.querySelectorAll('.flap');
const roll_btn = document.getElementById('roll_btn');

const info_txt = document.getElementById('info');
const score_txt = document.getElementById('score');
const moving_sum_txt = document.getElementById('moving_sum');
const rolls_count_txt = document.getElementById('rolls_count');

const selectableNums_txt = document.getElementById('selectableNums');

//Events
roll_btn.addEventListener('click', roll);

flaps.forEach((e) => {
    e.addEventListener('click', selectFlap);
} );

//Objects
const dice1 = new Dice(d1container);
const dice2 = new Dice(d2container);

//Globals
let selectable = true;
let selectableNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let markedNums = [];
let d1;
let d2;
let roll_num = 0;
let score = 0;
let moving_sum_dice = 0;

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

function roll() {
    if (roll_btn.value == 'Restart') {
        reset();
    }
    else {
        console.log(`MSD Score: ${moving_sum_dice}`);
        console.log(`Array: ${selectableNums}`);

        d1 = dice1.roll();
        console.log(`d1: ${d1}`);
        
        if (moving_sum_dice > 0 && moving_sum_dice < 7) {
            d2 = 0;
            dice2.resetEyes();
        } else {
            d2 = dice2.roll();
        }
        console.log(`d2: ${d2}`);
        
        d_total = (parseInt(d1) + parseInt(d2));
        roll_num += 1;
        roll_btn.disabled = true;
        roll_info = '';

        info_txt.innerHTML = `<strong>You rolled ${d_total}</strong> <i class="fa-solid fa-circle-chevron-right"></i> Select number(s)`;
        
        rolls_count_txt.innerHTML = `#${roll_num}`;

        if (isGameOver()) {
            roll_btn.value = 'Restart';
            roll_btn.disabled = false;
            info_txt.innerHTML = `No more rolls possible <i class="fa-solid fa-toilet-paper"></i> `;
        };
    }
    selectable = true;
}

function selectFlap() {
    if (selectable) {
        let selectedNum = Number(this.innerHTML);
        index = markedNums.indexOf(selectedNum);
        if (index == -1) {
            markedNums.push(selectedNum);
            this.classList.remove('light');
            this.classList.add('marked');
        }
        else {
            markedNums.splice(index, 1);
            this.classList.remove('marked');
            this.classList.add('light');
        }

        if (check()) {
            selectableNums = selectableNums.filter(x => !markedNums.includes(x));
            flipFlaps();
            movingSum();

            markedNums = [];
            roll_btn.disabled = false;
            selectable = false;
            if (selectableNums.length == 0) {
                info_txt.innerHTML = 'You won!';
                roll_btn.value = 'Restart';
            }
        };
    }
}


function check() {
    sum_flaps = markedNums.reduce((a, b) => a + b, 0);
    sum_dice = d1 + d2;
    if (sum_flaps == sum_dice) {
        return true;
    }
    return false;
}

function flipFlaps() {
    let markedFlaps = document.querySelectorAll('.flap.marked');
    markedFlaps.forEach((flap) => {
        flap.removeEventListener('click', selectFlap);
        flap.classList.remove('pointer');
        flap.classList.remove('marked');
        flap.classList.add('dark');
    });
}

function movingSum() {
    moving_sum = parseInt(dice_sum);
    moving_sum_dice = selectableNums.reduce((a, b) => a + b, 0);
    moving_sum_txt.innerHTML = selectableNums.reduce((a, b) => a + b, 0);
    info_txt.innerHTML = `Next <i class="fa-solid fa-circle-chevron-right"></i>  Roll Dice`;
}

function isGameOver() {
    dice_sum = d1 + d2;

    let possibilities = arrSumPossibilities(dice_sum, selectableNums);
    if (possibilities.length > 0) {
        return false;
    }
    return true;
}


function reset() {
    info_txt.innerHTML = `Roll Dice <i class="fa-solid fa-circle-chevron-right"></i> 
    <span class="animate-flicker">Start Game</span>`;
    roll_btn.value = 'Roll Dice';
    flaps.forEach((e) => {
        e.setAttribute('class', 'flap light pointer');
        e.addEventListener('click', selectFlap);
    });
    dice1.resetEyes();
    dice2.resetEyes();
    roll_num = 0;
    moving_sum_txt.innerHTML = 0;
    rolls_count_txt.innerHTML = '<i class="fa-regular fa-face-grin-beam"></i>';
    selectableNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
} 

selectableNums_txt.innerHTML = selectableNums;