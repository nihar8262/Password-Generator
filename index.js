const inputslider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*({[\|<,>.)}:;/?_-+=';


let password = "";
let passwordlength = 10 ;
let checkCount = 0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");

function handleSlider(){
    inputslider.value = passwordlength;
    lengthDisplay.innerText =passwordlength;
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize =( (passwordlength - min) *100/ (max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =     `0px 0px 12px 1px ${color}  `;
    // shadow
}

function getRndInteger(min,max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));

}

function generateSymbol(){
         const randNum = getRndInteger(0,symbols.length);
         return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordlength>=8){
        setIndicator("#0f0");
    }else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym)&&
        passwordlength>=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
     try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";

     }
     catch(e){
        copyMsg.innerText = "failed";
     }
    //  to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
     
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length-1; i>0; i--){
        const j= Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    // special condition
    if(passwordlength <checkCount){
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
} )

inputslider.addEventListener('input',(e) => {
    passwordlength = e.target.value;
    handleSlider();
} )

copyBtn.addEventListener('click',() => {
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', ()=>{
    if(checkCount==0)return;

    if(passwordlength < checkCount){
        passwordlength = checkCount;
        handleSlider();
    }
     
    console.log("Starting the journey");
    //  remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked)
      funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
      funcArr.push(generateLowerCase);  

    if(numbersCheck.checked)
      funcArr.push(generateRandomNumber);  

    if(symbolsCheck.checked)
      funcArr.push(generateSymbol);

    //   compulsory addition
      for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
      }
      console.log("compulsory addition done");

    //   remaining addition 
    for(let i=0; i<passwordlength-funcArr.length; i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randIndex]();

    }

    console.log("remaining addition done");

    // shuffle the password
    password = shufflePassword(Array.from(password));

    console.log("shuffling done ");

    // show in UI
    passwordDisplay.value = password;

    console.log("UI addition done");
    calcStrength();





});