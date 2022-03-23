let gamePattern = [];
let userClickedPattern = [];
const buttonColours = ["red","blue","green","yellow"];
let randomChosenColour;

let countfirsttime = true;
let level = 0;
let mouseoverCount = true

$(document).keydown(function(event){
  if (countfirsttime) {
  countfirsttime = false;
  gamePattern = [];
  userClickedPattern = [];
  level = 0;
  // $("h1").text("Level " + level);
  console.log("detecting first time only");
  nextSequence();
}
// $(".btn").addEventListener("mouseover",function(event){
//
//   if (mouseoverCount&&(level>4)){
//       mouseoverCount = false;
//       changeColours();
//   }
// })


})
function nextSequence(){
  setTimeout(function(){
    level++;
    $("#level-title").text("Level " + level);
    if(level>=2){
    changeColours();
  }},500)
  setTimeout(function(){
    var randomNumber = Math.floor(Math.random()*4);

    playSound(buttonColours[randomNumber]);
    $("#"+buttonColours[randomNumber]).fadeOut(80).fadeIn(80);
    randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
  },1000);

}
function changeColours(){
  document.querySelector("#green").classList.remove("green")
  document.querySelector("#green").id = "lol1"
  document.querySelector("#red").classList.remove("red")
  document.querySelector("#red").id = "lol2"
  document.querySelector("#blue").classList.remove("blue")
  document.querySelector("#blue").id = "lol3"
  document.querySelector("#yellow").classList.remove("yellow")
  document.querySelector("#yellow").id = "lol4"
  let buttons = document.querySelectorAll(".btn")
  shuffleArray(buttonColours)

  for(let i = 0; i < buttons.length ; i++)
  {
    buttons[i].classList.add(buttonColours[i]);
    buttons[i].id = buttonColours[i];
  };
}
/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
/******************Rules modal Box***********************/
let btn = document.querySelector("#btnRules");
let close = document.querySelector(".closeBox");
let modal = document.querySelector(".modalBox");
btn.onclick = function(){
    modal.classList.add("open");
}
close.onclick = function(){
    modal.classList.remove("open");
}
window.onclick = function(event){
  if(event.target == modal){
      modal.classList.remove("open");
  }
}

/* **************************************/
$(".btn").click( function(){
  var useChosenColour = $(this).attr("id");
  userClickedPattern.push(useChosenColour);
  // console.log($(this));
  // playSound(useChosenColour);
  checkAnswer((userClickedPattern.length)-1)
  animatePress(useChosenColour);
  console.log(userClickedPattern);
})
function playSound(sound){
  switch (sound) {
    case "green":
          var green = new Audio("sounds/"+sound+".mp3");
          green.play();
      break;
    case "red":
          var red = new Audio("sounds/"+sound+".mp3");
          red.play();
      break;
    case "blue":
          var blue = new Audio("sounds/"+sound+".mp3");
          blue.play();
      break;
    case "yellow":
          var yellow = new Audio("sounds/"+sound+".mp3");
          yellow.play();
      break;
    case "wrong":
          var wrong = new Audio("sounds/"+sound+".mp3");
          wrong.play();
        break;
    default:{
      console.log("out of range");
    }

  }
}
function animatePress(currentColour){
  $("."+currentColour).addClass("pressed");
  setTimeout(function(){
    $("."+currentColour).removeClass("pressed");
  }, 100);
}
function checkAnswer(currentLevel){
  if (userClickedPattern[currentLevel]=== gamePattern[currentLevel]){
    console.log("success")
    playSound(userClickedPattern[currentLevel]);
    if(currentLevel === gamePattern.length-1){
      setTimeout(function(){
        nextSequence();
        userClickedPattern = [];
      },1000)
    }
  }
  else{
    playSound("wrong");
    $("body").addClass("game-over");
    setTimeout(function(){
      $("body").removeClass("game-over");
    },200)
    startOver();
    $("#level-title").text("Game Over, Press Any Key to Restart");
    console.log("wrong");

  }

}
function startOver(){
  gamePattern = [];
  userClickedPattern = [];
  level = 0;
  countfirsttime = true;
}
