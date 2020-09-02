var dog,dogImg,dogImg1;
var database;
var foodS,foodStock;
var lastFed;
function preload(){
   dogImg=loadImage("Images/dogImg.png");
   dogImg1=loadImage("Images/dogImg1.png");
  }

//Function to set initial environment
function setup() {
  createCanvas(1000, 500);
  foodObject = new Food();
  
  database=firebase.database();
  createCanvas(500,500);

  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}

// function to display UI
function draw() {
  background(46, 139, 87);
  foodObject.display();

  feedTime = database.ref('Feed Time');
  feedTime.on("value",function(data){
    lastFed=data.val();
  });

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
  
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogImg1);
  }

  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  textSize(13);
  text("Note: Press UP_ARROW Key To Feed Drago Milk!",130,10,300,20);
}


//Function to read values from DB
function readStock(data){
  foodS=data.val();
  foodObject.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage();

  foodObject.updateFoodStock(foodObject.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObject.getFoodStock(),
    feedTime:hour()
  })
}



//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}