
let textDisplay = document.querySelector(".textDisplay");
let timeDisplayer = document.querySelector("#current-timer");
let timeSelectOptions = document.querySelector("#time-options");

let IntervalID = null;


//Storing seconds in the Timer's seconds value for backTimer.
let Seconds = 60;
let StoreSec = Seconds;
timeDisplayer.innerText = StoreSec;
timeSelectOptions.addEventListener("change",()=>{
    if(timeSelectOptions.value == "60sec"){
        Seconds = 60;
        StoreSec= Seconds;
        timeDisplayer.innerText = StoreSec;
    } else if(timeSelectOptions.value == "120sec"){
        Seconds = 120;
        StoreSec= Seconds;
        timeDisplayer.innerText = StoreSec;
    } else if(timeSelectOptions.value == "30sec"){
        Seconds = 30;
        StoreSec= Seconds;
        timeDisplayer.innerText = StoreSec;
    }
    
})




let typingData = {};
//loading the data.json file using async await
async function loadJSON (){
    try{
        const response = await fetch("data.json");
        typingData = await response.json();
    }
    catch(error){console.log(`Error occured: ${error}`);}
} 

loadJSON(); //calling the function

//for each input whose name belongs to 'difficulty-option', add a event listener that- when a 'change' happens, call function 'handleDifficultyChange'
document.querySelectorAll("input[name='difficulty-option']").forEach(radioOption => {
    radioOption.addEventListener("change", handleDifficultyChange);
});


//takes the 'event' from event listener, then checks if the input clicked's id belogs to either of the following and if so then sends it as a input, respectively, in the 'loadText' function. 
function handleDifficultyChange(event){
    timeDisplayer.innerText = StoreSec;
    if(event.target.id === "difficulty-easy"){
        loadText("easy");
    } else if(event.target.id=== "difficulty-medium"){
        loadText("medium");
    } else if(event.target.id=== "difficulty-hard"){
        loadText("hard");
    }
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

    //the input box where user types; enable it, clear it's previously entered any value, and turn on it's focus.
    let typingInput= document.querySelector("#typingInput");
    typingInput.disabled = false;
    typingInput.value ="";
    typingInput.focus();
    
}



const typingInput = document.querySelector("#typingInput");
typingInput.focus();
//add a eventlistener that whenever any charcter is written or deleted- gets triggered.
//whatever is typed in input, split it into characters and add it into input variable.
typingInput.addEventListener("input",()=>{
    backTimer();
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
            span.classList.remove(".correct");
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





//Backwords counting Timer:
let TIME = false;

function backTimer (){
    if (TIME){return;};

    //After the timer runs again from start-- TIME is made true and StoreSec is reseted so that it doesn't go below 0;
    TIME = true;
    StoreSec = Seconds;
    timeDisplayer.innerText = StoreSec;

    IntervalID = setInterval(()=>{
        StoreSec--;
        timeDisplayer.innerText = StoreSec;
    

        if(StoreSec <= 0){
            clearInterval(IntervalID);
            TIME = false;
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
    }
}