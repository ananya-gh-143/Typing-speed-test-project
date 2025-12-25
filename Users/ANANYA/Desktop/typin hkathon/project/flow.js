
let textDisplay = document.querySelector(".textDisplay");



let typingData = {};
let currentData ="";



//loading the data.json file using async await
async function loadJSON (){
    try{
        const response = await fetch("data.json");
        typingData = await response.json();
    }
    catch(error){console.log(`Error occured ${error}`);}
} 

loadJSON(); //calling the function

//for each input whose name belongs to 'difficulty-option', add a event listener that- when a 'change' happens, call function 'handleDifficultyChange'
document.querySelectorAll("input[name='difficulty-option']").forEach(radioOption => {
    radioOption.addEventListener("change", handleDifficultyChange);
});


//takes the 'event' from event listener, then checks if the input clicked's id belogs to either of the following and if so then sends it as a input, respectively, in the 'loadText' function. 
function handleDifficultyChange(event){
    if(event.target.id === "difficulty-easy"){
        loadText("easy");
    } else if(event.target.id=== "difficulty-medium"){
        loadText("medium");
    } else if(event.target.id=== "difficulty-hard"){
        loadText("hard");
    }
}

function loadText(level){
    const passages = typingData[level];
    
    const randomIndx = Math.floor(Math.random()* passages.length);
    const selectedPassage = passages[randomIndx];
    let currentText = selectedPassage.text;

    textDisplay.innerText = "";

    currentText.split("").forEach(char =>{
        const span = document.createElement("span");
        span.innerText= char;
        textDisplay.appendChild(span);
    });

    let typingInput= document.querySelector("#typingInput");
    typingInput.disabled = false;
    typingInput.value ="";
    typingInput.focus();
    
}



const typingInput = document.querySelector("#typingInput");
typingInput.focus();
typingInput.addEventListener("input",()=>{
    const input= typingInput.value.split("");
    const spans = document.querySelectorAll(".textDisplay span");


    spans.forEach((span, index)=>{
        const char = input[index];

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
  const nextIndex = input.length;
  if (nextIndex < spans.length) {
    typingInput.disabled = false;
    spans[nextIndex].classList.add("current");
  }else if(nextIndex == spans.length){
    typingInput.disabled = true;
    console.log("passage over!")
  }
});