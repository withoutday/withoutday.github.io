//may not work on safari
// Declare a "SerialPort" object
var serial;

// fill in the name of your serial port here:
//copy this from the serial control app
var portName = "COM4";

//this array will hold transmitted data
var inMessage = [0, 0];
let avatar;
let blackhole;
let score = 0;
var gameState;

function preload(){
  img1 =loadImage("2916628.png")
  img2 =loadImage("win.gif")
}

function setup() {
   createCanvas(500, 400);
  gameState = 0;
  // create the game character
  avatar = new Ball(width/2, height/2, 30, color(0, 0, 255, 140));
  
  // create the black hole
  let blackholeDiameter = random(avatar.diameter + 10, 100);
  let blackholeRadius = blackholeDiameter/2;
  let blackholeX = random(blackholeRadius, width - blackholeRadius);
  let blackholeY = random(blackholeRadius, height - blackholeRadius);
  blackhole = new Ball(blackholeX, blackholeY, blackholeDiameter, color(0));
}


  // make an instance of the SerialPort object
  serial = new p5.SerialPort();

  // Get a list the ports available
  // You should have a callback defined to see the results. See gotList, below:
  serial.list();

  // Assuming our Arduino is connected,  open the connection to it
  serial.open(portName);

  // When you get a list of serial ports that are available
  serial.on('list', gotList);

  // When you some data from the serial port
  serial.on('data', gotData);



// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}

// Called when there is data available from the serial port
function gotData() {
  var currentString = serial.readLine();  // read the incoming data
  trim(currentString);                    // trim off trailing whitespace
  if (!currentString) return;             // if the incoming string is empty, do no more
  console.log(currentString);
      inMessage = split(currentString, '&');   // save the currentString to use for the text
}

//Do not touch above 


function draw() {
  background(150);

  
  if (gameState == 0){
     image(img1,90,40,300,300);
   }
  else if (gameState == 1){
   image(img2,0,0,500,400)
    textSize(40);
    fill(0, 255, 0);
    text('You WIN', 180, 200);

    
}

  if (inMessage[1] == 1){
     // changes background to purple when LED is green
    background(100,100,150);
    
  blackhole.draw();
  if(blackhole.contains(avatar)){
    score ++;
    blackhole.relocate(); 
  }
  avatar.draw();
     textSize(20);
  text("Score:" + score, 150, 20);
if (score == 3 ){
  gameState = 1

 
}

}

}

function keyPressed() {



  //print(keyCode, key);
  if (inMessage[1] == 1){
  // don't put any drawing code in here!
  let pixelIncrement = 15;
  if (keyCode == LEFT_ARROW) {
    avatar.x = avatar.x - pixelIncrement;
  } else if (keyCode == RIGHT_ARROW) {
    avatar.x = avatar.x + pixelIncrement;
  } else if(keyCode == DOWN_ARROW){
    avatar.y = avatar.y + pixelIncrement; 
  }else if(keyCode == UP_ARROW){
    avatar.y = avatar.y - pixelIncrement; 
  }
  
  if(key == ' '){ // jump
    avatar.y = avatar.y - 100; 
  }
}
}

class Ball{
  constructor(x, y, diameter, fillColor){
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.fillColor = fillColor;
  }
  
  draw(){
    push();
    noStroke();
    fill(this.fillColor);
    ellipse(this.x, this.y, this.diameter);
    pop();
  }
  
  relocate(){
    let radius = this.diameter / 2;
    this.x = random(radius, width - radius);
    this.y = random(radius, height - radius);  
  }
  
  contains(otherBall){
    let distFromThisBallToOtherBall = dist(this.x, this.y, otherBall.x, otherBall.y);
    let otherBallRadius = otherBall.diameter / 2;
    let thisRadius = this.diameter / 2;
    if(distFromThisBallToOtherBall + otherBallRadius <= thisRadius){
      return true;  
    }
    return false;
  }

}
