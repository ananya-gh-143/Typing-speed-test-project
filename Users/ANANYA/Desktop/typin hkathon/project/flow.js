
let textDisplay = document.querySelector(".textDisplay");
let timeDisplayer = document.querySelector("#current-timer");
let timeSelectOptions = document.querySelector("#time-options");
let starterBtn = document.querySelector("#start-typing-test");
let starterPage = document.querySelector(".start-main-cont");

const typingInput = document.querySelector("#typingInput");

let IntervalID = null;


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
    
    if (!TIME){ //if timer is not already on then 
        StoreSec= Seconds;      //update the choice user made above--
        timeDisplayer.innerText = MinSec(StoreSec);
        typingInput.focus(); //even after changing the time we don't have to click the input box it type. i.e. it automatically gets in focus.
    }

})




let typingData = {};
//loading the data.json file using async await
async function loadJSON (){
    try{
        const response = await fetch("data.json");
        typingData = await response.json();
        defaultLoadPassage();
    }
    catch(error){console.log(`Error occured: ${error}`);}
} 

loadJSON(); //calling the function

//Just as the site is loaded, generate a medium sized passage.
function defaultLoadPassage(){
    loadText("medium");
    starterBtn.focus();
}




starterPage.addEventListener("click",()=>{
    loadText("medium");
    let mediumradio = document.querySelector("#difficulty-medium")
    mediumradio.checked = true;
    starterPage.classList.add("disappearance");
    typingInput.focus();
})




//for each input whose name belongs to 'difficulty-option', add a event listener that- when a 'change' happens, call function 'handleDifficultyChange'
const radioButtons = document.querySelectorAll("input[name='difficulty-option']");
radioButtons.forEach(radioOption => {
    radioOption.addEventListener("change", handleDifficultyChange);
});




//takes the 'event' from event listener, then checks if the input clicked's id belogs to either of the following and if so then sends it as a input, respectively, in the 'loadText' function. 
function handleDifficultyChange(event){
    if(TIME)return;     //if timer is on [TIME is true] then the following wouln't be executed
   
    StoreSec = Seconds;
    timeDisplayer.innerText = MinSec(StoreSec);
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


function loadText(level){
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
    backTimer(); //turn on the timer just as user enters a single character in the input box
    const input= typingInput.value.split("");   
    const spans = document.querySelectorAll(".textDisplay span"); //select all spans from the previous made spans, add them all in variable 'spans'

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
    console.log("passage over!")
    stopTimer();
  }
});


//converts seconds into minutes and seconds;
function MinSec (seconds){
    let min = Math.floor(seconds/60).toString();
    let sec = (seconds % 60).toString()
    sec = sec.padStart(2,"0");
    return `${min}:${sec}`;
}

//Backwords counting Timer:
let TIME = false;

function backTimer (){
    if (TIME){return;};

    //After the timer runs again from start-- TIME is made true and StoreSec is reseted so that it doesn't go below 0;
    TIME = true;
    StoreSec = Seconds;
    timeDisplayer.innerText = MinSec(StoreSec);
    updateRadioOptions();

    IntervalID = setInterval(()=>{
        StoreSec--;
        timeDisplayer.innerText = MinSec(StoreSec);
    
        if(StoreSec <= 0){
            clearInterval(IntervalID);
            TIME = false;
            updateRadioOptions();
            typingInput.disabled = true;
        }
    },1000);
}

//to stop the timer if and when neccesary
function stopTimer(){
    if(IntervalID != null){
        clearInterval(IntervalID);
        StoreSec = Seconds;
        TIME = false;
        updateRadioOptions();
    }
}