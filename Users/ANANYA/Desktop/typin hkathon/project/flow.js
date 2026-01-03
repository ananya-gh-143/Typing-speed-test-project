
let textDisplay = document.querySelector(".textDisplay");
let personalBestShow = document.querySelector("#personal-best-no");
let timeDisplayer = document.querySelector("#current-timer");
let timeSelectOptions = document.querySelector("#time-options");
let starterBtn = document.querySelector("#start-typing-test");
let starterPage = document.querySelector(".start-main-cont");
let typeSelectOptions = document.querySelector("#type-options");
let wpmShowBox = document.querySelector("#current-wpm");
let accuracyShowBox = document.querySelector("#current-accuracy");
let resetButton = document.querySelector(".resetButton");
const typingInput = document.querySelector("#typingInput");

let MainArea  = document.querySelector("#main-area-container");
let FinalPage = document.querySelector(".successful-page");
let GreenCheckLogo = document.querySelector("#maingreen-logo-cont");
let CelebrateLogo = document.querySelector("#Best-logo");
let FinalMainText = document.querySelector("#main-header");
let FinalSubText = document.querySelector("#belowtext");
let FinalWPMshow = document.querySelector("#detail-show-wpm");
let FinalAccuracyShow = document.querySelector("#detail-show-accuracy");
let FinalTotalCharShow = document.querySelector("#detail-show-char-total");
let FinalWrongCharShow = document.querySelector("#detail-show-char-wrong");
let FinalButton = document.querySelector("#final-btn");
let FinalButtonText = document.querySelector("#final-btn-text")
let Confetti = document.querySelector("#confetti");
let Stars = document.querySelector(".star");





let personal_best_number = parseInt(localStorage.getItem("personal_best_WPM")) || 0;    //gets a key from localStorage called personal_best_WPM , if it doesn't exist then returns 0
personalBestShow.innerText = personal_best_number;


let inputLength = 0;
let wrongInput = 0;
let lastCheckedIndex = 0;

let TimerType = backTimer;  //by default the timer mode would be Timed.
let IntervalID2 = null;
let IntervalID = null;


//Storing seconds in the Timer's seconds value for upTimer.
let upSeconds = 0;
let upStoreSec = upSeconds;


//Storing seconds in the Timer's seconds value for backTimer.
let Seconds = 60;
let StoreSec = Seconds;

timeDisplayer.innerText = MinSec(StoreSec);
timeSelectOptions.addEventListener("change",()=>{
    if(timeSelectOptions.value == "60sec"){
        Seconds = 60;
        typingInput.focus();
    } else if(timeSelectOptions.value == "120sec"){
        Seconds = 120;
        typingInput.focus();
    } else if(timeSelectOptions.value == "30sec"){
        Seconds = 30;
        typingInput.focus();
    }
    
    if(TimerType == backTimer){
        if (!TIME){ //if timer is not already on then 
            StoreSec= Seconds;      //update the choice user made above--
            timeDisplayer.innerText = MinSec(StoreSec);
            typingInput.focus(); //even after changing the time we don't have to click the input box it type. i.e. it automatically gets in focus.
        }
    }else if(TimerType == upTimer){
        if (!TIME){
            timeDisplayer.innerText = MinSec(upStoreSec);
            typingInput.focus();
        }
    }
    

})




let typingData = {};


//loading the data.json file using async await
async function loadJSON (){
    try{
        const response = await fetch("data.json");
        typingData = {};
        typingData = await response.json();
        
    }
    catch(error){console.log(`Error occured in loading normal JSON: ${error}`);}
} 


async function initialLoad(){   //  runs a 1st load async function that runs 'defaultLoadPassage' AFTER 'loadJSON'
    await loadJSON(); //calling the function
    defaultLoadPassage();
}
initialLoad();


//Just as the site is loaded, generate a medium sized passage.
function defaultLoadPassage(){
    loadText("medium");
    starterBtn.focus();
}



//load the coding [data2.json] file using async await
async function loadJSON2 (){ 
    try{
        const response = await fetch("data2.json");
        typingData = {};
        typingData = await response.json();
    }
    catch(error){console.log(`Error occured in loading coding JSON: ${error}`);}
} 


async function loadJsonFile1(){
    await loadJSON();
    loadText("medium");
    document.querySelector("#difficulty-medium").checked = true;
}

async function loadJsonFile2(){
    await loadJSON2();
    loadText("medium");
    document.querySelector("#difficulty-medium").checked = true;
}

typeSelectOptions.addEventListener("change",()=>{ 
    if (TIME)return;

    if(typeSelectOptions.value == "normal"){
        loadJsonFile1();
        typingInput.focus();
        
        
    } else if(typeSelectOptions.value == "code"){
        loadJsonFile2()
        typingInput.focus();
        
        
    }
    

})


function DefaultControls(){
    loadText("medium");
    let mediumradio = document.querySelector("#difficulty-medium");
    mediumradio.checked = true;
    let timedradio = document.querySelector("#mode-timed");
    timedradio.checked = true;

   typingInput && typingInput.focus();
}

starterPage.addEventListener("click",()=>{
    DefaultControls();   
    starterPage.classList.add("disappearance");
})




//for each input whose name belongs to 'difficulty-option', add a event listener that- when a 'change' happens, call function 'handleDifficultyChange'
const radioButtons = document.querySelectorAll("input[name='difficulty-option']");
radioButtons.forEach(radioOption => {
    radioOption.addEventListener("change", handleDifficultyChange);
});


const modeButtons = document.querySelectorAll("input[name='mode-option']"); 
modeButtons.forEach(modeOption => {
    modeOption.addEventListener("change", handleModeChange);
});

function handleModeChange(event){
    if (TIME)return;

    if(event.target.id === "mode-timed"){
        TimerType = backTimer;
        typingInput && typingInput.focus();
        StoreSec = Seconds;
        timeDisplayer.innerText = MinSec(StoreSec);
        timeSelectOptions.disabled = false;
    } else if(event.target.id === "mode-passage"){
        TimerType = upTimer;
        typingInput && typingInput.focus();
        upStoreSec = upSeconds;
        timeDisplayer.innerText = MinSec(upStoreSec); 
        timeSelectOptions.disabled = true;
    }

}




//takes the 'event' from event listener, then checks if the input clicked's id belogs to either of the following and if so then sends it as a input, respectively, in the 'loadText' function. 
function handleDifficultyChange(event){
    if(TIME)return;     //if timer is on [TIME is true] then the following wouln't be executed
   
    if(TimerType == backTimer){
        StoreSec = Seconds;
        timeDisplayer.innerText = MinSec(StoreSec);
    }else if(TimerType == upTimer){
        upStoreSec = upSeconds;
        timeDisplayer.innerText = MinSec(upStoreSec);
    }

    
    if(event.target.id === "difficulty-easy"){
        loadText("easy");
    } else if(event.target.id=== "difficulty-medium"){
        loadText("medium");
    } else if(event.target.id=== "difficulty-hard"){
        loadText("hard");
    }
  
}

function updateRadioOptions (){     //if Timer is on [TIME is true] the difficulty option radio buttons would be disabled [disability = true] or vice versa
    radioButtons.forEach(radio =>{
        radio.disabled = TIME;
    });
}

function updateModeOptions (){     //if Timer is on [TIME is true] the mode option radio buttons would be disabled [disability = true] or vice versa
    modeButtons.forEach(mode =>{
        mode.disabled = TIME;
    }); 
}

function updateTextType(){
    typeSelectOptions.disabled = TIME;
}

function updateTimeType(){
    timeSelectOptions.disabled = TIME;
}


function loadText(level){
    if (!typingData[level]){console.log(`Typing data not loaded yet; error.`); return;}     //if typingdata is not loaded yet from json then temprorily exit function
    accuracyReset();
    wpmShowBox.innerText = 0;

    const passages = typingData[level]; //load the difficulty level passed into 'loadText' from the fetched json which is stored in 'typingData'
    
    const randomIndx = Math.floor(Math.random()* passages.length);  //make a variable 'randomIndx' which generates random number from the length of passages available in the given 'level'
    const selectedPassage = passages[randomIndx];   //set that number as a index of the available passages and pass it in the variable selectedPassage
    let currentText = selectedPassage.text;     //as the passage has both a id and text, in which text is the one with string, we pass the string [text] of the passage in currentText.

    textDisplay.innerText = "";    //empty the paragraph which shows the text

    //split each character of the passage, and add each in a 'span' element, display the span in the paragraph element. 
    currentText.split("").forEach(char =>{
        const span = document.createElement("span");
        span.innerText= char;
        textDisplay.appendChild(span);
    });

    //the input box where user types; enable it, clear its previously entered value, and focus it.
    typingInput.disabled = false;
    typingInput.value = "";
    typingInput.focus();
    
}


// Always move cursor to end if user clicks input
typingInput.addEventListener("click", () => {
    const length = typingInput.value.length;
    typingInput.focus();
    typingInput.setSelectionRange(length, length);
});

typingInput && typingInput.focus();


//add a eventlistener that whenever any charcter is written or deleted- gets triggered.
//whatever is typed in input, split it into characters and add it into input variable.
typingInput.addEventListener("input",()=>{
    TimerType(); //turn on the timer just as user enters a single character in the input box
    
    const input= typingInput.value.split("");   
    const spans = document.querySelectorAll(".textDisplay span"); //select all spans from the previous made spans, add them all in variable 'spans'

    
    //Wrong input checker for accuracy calculator
    while (lastCheckedIndex < typingInput.value.length){
        let typedChar = typingInput.value[lastCheckedIndex];
        let expectedChar = spans[lastCheckedIndex].innerText;

        inputLength++;
        if(typedChar != expectedChar){
            wrongInput++;
        }
            
        lastCheckedIndex++;
    }


    //for each span [character] and its index, put its index on the user's character's index and store it in 'char'
    spans.forEach((span, index)=>{ 
        const char = input[index];

        // if char is empty, say nothing is entered then remove the folowing classes; if char == the span's text [passage's character] then add the folowing classes and if its not same then add it's folowing classes.
        if(char == null){
            span.classList.remove("current");
            span.classList.remove("correct","incorrect");
        }else if(char === span.innerText){
            span.classList.remove("current");
            span.classList.add("correct");
            span.classList.remove("incorrect");
        }else{
            span.classList.remove("current");
            span.classList.add("incorrect");
            span.classList.remove("correct");
        };
    });

    // Highlight the next character to type

    // the number of user's input {always 1 more than index}, add it in variable 'nextIndex'; if nextIndex [the length of user's text] is more than the spans' [number of characters in passage] then 
    // don't disable the input box and the to next span's [passage's character] class- add the following class but if the user's input's length is equal to amount of characters in passage then disable input box.
  const nextIndex = input.length;
  if (nextIndex < spans.length) {
    typingInput.disabled = false;
    spans[nextIndex].classList.add("current");
  }else if(nextIndex == spans.length){
    typingInput.disabled = true;
    
    FinalPageShow();

    if (TimerType == backTimer){
    stopTimer();
    }else if(TimerType == upTimer){
        stopTimer2();
    }
  }
});


//converts seconds into minutes and seconds;
function MinSec (seconds){
    let min = Math.floor(seconds/60).toString();
    let sec = (seconds % 60).toString()
    sec = sec.padStart(2,"0");
    return `${min}:${sec}`;
}


let TIME = false;

//Backwards counting Timer:
function backTimer (){
    if (TIME){return;};

    //After the timer runs again from start-- TIME is made true and StoreSec is reseted so that it doesn't go below 0;
    TIME = true;
    StoreSec = Seconds;
    timeDisplayer.innerText = MinSec(StoreSec);
    updateRadioOptions();
    updateModeOptions();
    updateTextType();
    updateTimeType();

    IntervalID = setInterval(()=>{
        wpmCalculator();
        accuracyCalculator();
        StoreSec--;
        timeDisplayer.innerText = MinSec(StoreSec);
    
        if(StoreSec <= 0){
            clearInterval(IntervalID);
            TIME = false;
            updateRadioOptions();
            updateModeOptions();
            updateTextType();
            updateTimeType();
            typingInput.disabled = true;
            
            FinalPageShow();

        }
    },1000);
}

//to stop the backtimer if and when neccesary
function stopTimer(){
    if(IntervalID != null){
        clearInterval(IntervalID);
        StoreSec = Seconds;
        TIME = false;
        IntervalID = null;
        updateRadioOptions();
        updateModeOptions();
        updateTextType();
        updateTimeType();
    }
}




//Upwards counting Timer:
function upTimer (){
    if (TIME){return;};

    //After the timer runs again from start-- TIME is made true and StoreSec is reseted so that it doesn't go below 0;
    TIME = true;
    upStoreSec = upSeconds;
    timeDisplayer.innerText = MinSec(upStoreSec);
    updateRadioOptions();
    updateModeOptions();
    updateTextType();
    updateTimeType();

    IntervalID2 = setInterval(()=>{
        wpmCalculator();
        accuracyCalculator();
        upStoreSec++;
        timeDisplayer.innerText = MinSec(upStoreSec);
        
    },1000);
}

//to stop the uptimer if and when neccesary
function stopTimer2(){
    if(IntervalID2 != null){
        clearInterval(IntervalID2);
        upStoreSec = upSeconds;
        TIME = false;
        IntervalID2 = null;
        updateRadioOptions();
        updateModeOptions();
        updateTextType();
        updateTimeType();
    }
}

// Calculates the wpm 
function wpmCalculator (){
    if (!TIME)return;

    if(TimerType == backTimer){
        if (inputLength < 5){
            return;
        }
        let WPM = (inputLength / 5) / ((Seconds-StoreSec) / 60); 
        wpmShowBox.innerText = Math.round(WPM);
        FinalWPMshow.innerText = Math.round(WPM);

    }else if(TimerType == upTimer){
        if (inputLength < 5 || upStoreSec < 1){
            return;
        }
        let WPM = (inputLength / 5) / (upStoreSec / 60);
        wpmShowBox.innerText = Math.round(WPM);
        FinalWPMshow.innerText = Math.round(WPM);
    }
}


//Calculates the accuracy
function accuracyCalculator(){
    if (!TIME)return;

    let accuracyPercent = ((inputLength - wrongInput) / inputLength) * 100;
    accuracyShowBox.innerText = Math.round(accuracyPercent);
    FinalAccuracyShow.innerText = Math.round(accuracyPercent);
}

function accuracyReset (){
    if (TIME)return;
    lastCheckedIndex = 0;
    inputLength = 0;
    wrongInput = 0;
    accuracyShowBox.innerText = 0;
}

function FinalPageCharacters(){
    
    let total_Char = inputLength;
    let wrong_Char = wrongInput;

    FinalTotalCharShow.innerText = total_Char;
    FinalWrongCharShow.innerText = wrong_Char;
}



function FinalPageShow (){
    FinalPageCharacters();
    MainArea.classList.add("disappearance");
    FinalPage.classList.remove("disappearance");

    updatePersonalBest();
}

function FinalPageHide (){
    MainArea.classList.remove("disappearance");
    FinalPage.classList.add("disappearance");
}

function ResetGame(){

    //STOP TIMERS
    stopTimer();
    stopTimer2();

    //RESET COUNTERS
    accuracyReset();

    //RESET TIMER STATES
    TimerType = backTimer;
    upStoreSec = upSeconds;
    StoreSec = Seconds;
    timeDisplayer.innerText = MinSec(StoreSec);

    //RESET UI 
    wpmShowBox.innerText = 0;
    accuracyShowBox.innerText = 0;

    //RESET INPUT BOX
    typingInput.disabled = false;
    typingInput.value = "";
    typingInput.focus();


    FinalPageHide();
    DefaultControls();
    
}

FinalButton.addEventListener("click", ResetGame);
resetButton.addEventListener("click", ResetGame);



function updatePersonalBest(){
    let currentWPM = parseInt(FinalWPMshow.innerText);
    let savedBest = personal_best_number;

    if (savedBest == 0){
        localStorage.setItem("personal_best_WPM", currentWPM);
        savedBest = currentWPM;
        personal_best_number = currentWPM;
        personalBestShow.innerText = savedBest;
        Stars.classList.remove("disappearance");

        CelebrateLogo.classList.add("disappearance");
        GreenCheckLogo.classList.remove("disappearance");
        Confetti.classList.add("disappearance");

        FinalMainText.innerText = "Baseline Established!";
        FinalSubText.innerText = "You've set the bar. Now the real challenge begins- time to beat it.";
        FinalButtonText.innerText = "Beat This Score ";

    }else if(currentWPM < savedBest){
        CelebrateLogo.classList.add("disappearance");
        Confetti.classList.add("disappearance");
        GreenCheckLogo.classList.remove("disappearance");
        Stars.classList.remove("disappearance");

        FinalMainText.innerText = "Test Complete!";
        FinalSubText.innerText = "Solid run. Keep pushing to beat your high score.";
        FinalButtonText.innerText = "Go Again ";

    }else if(currentWPM > savedBest){
        savedBest = currentWPM;
        personal_best_number = currentWPM;
        personalBestShow.innerText = savedBest;

        CelebrateLogo.classList.remove("disappearance");
        Confetti.classList.remove("disappearance");
        GreenCheckLogo.classList.add("disappearance");
        Stars.classList.add("disappearance");

        FinalMainText.innerText = "High Score Smashed!";
        FinalSubText.innerText = "You're getting faster. That was incredible typing.";
        FinalButtonText.innerText = "Beat this score ";
    }
}


