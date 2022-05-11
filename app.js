var context;

//shapes for moving objects
var shape = new Object();
var m1Shape=new Object();
m1Shape.i=0;
m1Shape.j=0;
var m2Shape=new Object();
m2Shape.i=11;
m2Shape.j=11;
var m3Shape=new Object();
m3Shape.i=11;
m3Shape.j=0;
var m4Shape=new Object();
m4Shape.i=0;
m4Shape.j=11;
var angShape=new Object();

var board;
var score;
var audio = new Audio('images/song.mp3');
var hitA  =new Audio('images/pacHit.mp3');
audio.loop = true;
var pac_color;
var start_time;
var time_elapsed;
var interval; 
var userTitle = "";
var modelOn=false;
var numOfLifes=5;
var lastPrased=4;
var hasClock=false;
var hasMed=false;
var keysDown;

//settings
var g_key_up = 38;
var g_key_down = 40;
var g_key_right = 39;
var g_key_left = 37;
var g_food_remain = 50;
var g_color5points;
var g_amount_5;
var g_color15points;
var g_amount_15;
var g_color25points;
var g_amount_25;
var g_time_settings = 60;
var g_monsters_settings = 4;

//load images
const monster1=new Image();
const monster2=new Image();
const med=new Image();
const angel=new Image();
const clock=new Image();
monster1.src='images/ghost2.png';
monster2.src='images/ghost3.png';
med.src='images/pill.png';
angel.src='images/angel.png';
clock.src='images/clock.png';



//default user
localStorage.setItem("k",JSON.stringify({
	username: "k",
	password: "k",
	fullname: "k",
	mail: "k@gmail.com",
	date: new Date('2017-01-03')}));

//load page
$(document).ready(function() {
	welcome();
	
});


//settings
function saveSettings(){
	g_food_remain = document.getElementById("amountFoodSettings").value;
	g_color5points = document.getElementById("color5_points").value;
	g_color15points = document.getElementById("color15_points").value;
	g_color25points = document.getElementById("color25_points").value;
	g_time_settings = document.getElementById("time_settings").value;
	g_monsters_settings = document.getElementById("monsters_amount_settings").value;
	f_Game();
}

function confirmation(){
	var c_up = document.getElementById("up").value;
	var c_down = document.getElementById("down").value;
	var c_right = document.getElementById("right").value;
	var c_left = document.getElementById("left").value;
	var c_food = document.getElementById("amountFoodSettings").value;
	var c_time = document.getElementById("time_settings").value;
	var c_monster = document.getElementById("monsters_amount_settings").value;

	if (c_up === "" || c_down === "" || c_right === "" || c_left === "" ||c_food === "" || c_time === "" || c_monster === ""){
		alert("you missed details!")
		return;
	}

	if(c_food > 90 || c_food < 50){
		alert("Amount of food 50-90")
		return;
	}
	if(c_time < 60){
		alert("time minimum 60 sec")
		return;
	}
	if(c_monster < 1 || c_monster > 4){
		alert("Monsters amount 1-4")
		return;
	}

	unShowAll();
	$("#Confirmation_settings").show();

}

function random_settings(){
	
	document.getElementById("up_conf").textContent = "ArrowUp";
	document.getElementById("up").value = "ArrowUp";
	g_key_up = 38;

	document.getElementById("down_conf").textContent= "ArrowDown";
	document.getElementById("down").value = "ArrowDown";
	g_key_down = 40;

	document.getElementById("right_conf").textContent = "ArrowRight";
	document.getElementById("right").value = "ArrowRight";
	g_key_right = 39;

	document.getElementById("left_conf").textContent = "ArrowLeft";
	document.getElementById("left").value = "ArrowLeft";
	g_key_left = 37;
		
	const random_food = Math.floor(Math.random() * 41) + 50; // food (50-90)
	document.getElementById("food_conf").textContent = random_food;
	document.getElementById("amountFoodSettings").value = random_food;


	const random_color1 = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
	document.getElementById("points5_conf").style.color = random_color1;
	document.getElementById("color5_points").value = random_color1;


	const random_color2 = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
	document.getElementById("points15_conf").style.color = random_color2;
	document.getElementById("color15_points").value = random_color2;


	const random_color3 = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
	document.getElementById("points25_conf").style.color = random_color3;
	document.getElementById("color25_points").value = random_color3;


	const random_time = Math.floor(Math.random() * 241) + 60; // time (60-300 sec) -> (1-5 minutes)
	document.getElementById("time_conf").textContent = random_time;
	document.getElementById("time_settings").value = random_time;
	

	const random_monsters = Math.floor(Math.random() * 4) + 1; //monsters (1-4)	
	document.getElementById("monsters_conf").textContent = random_monsters;
	document.getElementById("monsters_amount_settings").value = random_monsters;


	unShowAll();
	$("#Confirmation_settings").show();
}

//60% 5 points, 30% 15 points, 10% 25 points
function calc_food(){
	g_amount_5 = parseInt(g_food_remain*60/100);
	g_amount_15 = parseInt(g_food_remain*30/100);
	g_amount_25 = g_food_remain - g_amount_15 - g_amount_5;
}

function PutFood(randomType){
	if(randomType == 1){ // food 5points
		if(g_amount_5 > 0){
			g_amount_5--;
			return 1.5; // food 5points
		}
		else{
			if(g_amount_15 > 0){
				g_amount_15--;
				return 1.15;  // food 15points
			}
			else{
				if(g_amount_25 > 0){
					g_amount_25--;
					return 1.25; // food 25points
				}
			}
		}
	}

	else if(randomType == 2){ // food 15points
		if(g_amount_15 > 0){
			g_amount_15--;
			return 1.15; // food 5points
		}
		else{
			if(g_amount_25 > 0){
				g_amount_25--;
				return 1.25; // food 25points
			}
			else{
				if(g_amount_5 > 0){
					g_amount_5--;
					return 1.5; // food 5points
				}
			}
		}
	}

	else if(randomType == 3){ // food 25points
		if(g_amount_25 > 0){
			g_amount_25--;
			return 1.25; // food 25points
		}
		else{
			if(g_amount_5 > 0){
				g_amount_5--;
				return 1.5; // food 5points
			}
			else{
				if(g_amount_15 > 0){
					g_amount_15--;
					return 1.15; // food 15points
				}
			}
		}
	}
}


//game logic
function Start() {
	board = new Array();
	numOfLifes=5;
	resetLifes();
	shape.i = 5;
	shape.j = 0;
	score = 0;
	pac_color = "yellow";
	var cnt = 144;
	//var food_remain = 80;
	var pacman_remain = 1;
	var randomType;
	calc_food();
	start_time = new Date();
	for (var i = 0; i < 12; i++) {
		board[i] = new Array();
		for (var j = 0; j < 12; j++) {
			if (
				(i == 1 && j == 0) ||
				(i == 7 && j == 0) ||
				(i == 9 && j == 0) ||
				(i == 1 && j == 1) ||
				(i == 2 && j == 1) ||
				(i == 3 && j == 1) ||
				(i == 4 && j == 1) ||
				(i == 7 && j == 1) ||
				(i == 11 && j == 1) ||
				(i == 4 && j == 2) ||
				(i == 7 && j == 2) ||
				(i == 8 && j == 2) ||
				(i == 11 && j == 2) ||
				(i == 2 && j == 3) ||
				(i == 3 && j == 3) ||
				(i == 4 && j == 3) ||
				(i == 5 && j == 3) ||
				(i == 8 && j == 3) ||
				(i == 2 && j == 4) || //maybe delete later
				(i == 8 && j == 4) ||
				(i == 11 && j == 4) ||
				(i == 1 && j == 5) ||
				(i == 2 && j == 5) ||
				(i == 3 && j == 5) ||
				(i == 5 && j == 5) ||
				(i == 6 && j == 5) ||
				(i == 8 && j == 6) ||
				(i == 11 && j == 6) ||
				(i == 0 && j == 7) ||
				(i == 1 && j == 7) ||
				(i == 2 && j == 7) ||
				(i == 3 && j == 7) ||
				(i == 5 && j == 7) ||
				(i == 9 && j == 7) ||
				(i == 1 && j == 8) ||
				(i == 3 && j == 8) ||
				(i == 5 && j == 8) ||
				(i == 7 && j == 8) ||
				(i == 8 && j == 8) ||
				(i == 5 && j == 9) ||
				(i == 7 && j == 9) ||
				(i == 11 && j == 9) ||
				(i == 2 && j == 10) ||
				(i == 5 && j == 10) ||
				(i == 11 && j == 10) ||
				(i == 2 && j == 11) ||
				(i == 5 && j == 11) ||
				(i == 8 && j == 11) 
			) {
				board[i][j] = 4;
				console.log("set 4");
			}
			//monster 1
			else if(m1Shape.i==i && m1Shape.j==j){
				board[m1Shape.i][m1Shape.j] = 5;  //monster -life -10 score
			
			}
			else if(m2Shape.i==i && m2Shape.j==j && g_monsters_settings >= 2){ //monster 2
				board[m2Shape.i][m2Shape.j]=9;  //monster -life -25 score
			}

			else if(m3Shape.i==i && m3Shape.j==j && g_monsters_settings >=3){ //monster 3
				board[m3Shape.i][m3Shape.j] = 5;  //monster -life -10 score
			}

			else if(m4Shape.i==i && m4Shape.j==j && g_monsters_settings == 4){ //monster 4
				board[m4Shape.i][m4Shape.j] = 5; //monster -life -10 score
			}

			else if((i==6 && j==6)){
				board[i][j] = 6;

			}
			else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * g_food_remain) / cnt) {
					randomType = Math.floor(Math.random() * (3 - 1 + 1) ) + 1;
					board[i][j] = PutFood(randomType); //food
					g_food_remain--;

				} else if (randomNum < (1.0 * (pacman_remain + g_food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (g_food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		randomType = Math.floor(Math.random() * (3 - 1 + 1) ) + 1;
		board[emptyCell[0]][emptyCell[1]] = PutFood(randomType);
		g_food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 100);
	if(g_monsters_settings==1){
		interval2=setInterval(UpdateMonster1Position, 500);
	}
	else if(g_monsters_settings==2){
		interval2=setInterval(UpdateMonster1Position, 500);
		interval3=setInterval(UpdateMonster2Position, 500);
	}
	else if(g_monsters_settings==3){
		interval2=setInterval(UpdateMonster1Position, 500);
		interval3=setInterval(UpdateMonster2Position, 500);
		interval4=setInterval(UpdateMonster3Position, 500);
	}
	else if(g_monsters_settings==4){
		interval2=setInterval(UpdateMonster1Position, 500);
		interval3=setInterval(UpdateMonster2Position, 500);
		interval4=setInterval(UpdateMonster3Position, 500);
		interval5=setInterval(UpdateMonster4Position, 500);

	}

}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 11 + 1);
	var j = Math.floor(Math.random() * 11+ 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 11 + 1);
		j = Math.floor(Math.random() * 11 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[g_key_up]) { //up
		return 1;
	}
	if (keysDown[g_key_down]) { //down
		return 2;
	}
	if (keysDown[g_key_left]) { //left
		return 3;
	}
	if (keysDown[g_key_right]) { //right
		return 4;
	}
}

function Draw(x) {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblUser.value=userTitle;
	lblTime.value = g_time_settings - time_elapsed;
	for (var i = 0; i < 12; i++) {
		for (var j = 0; j < 12; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) { //paci
				if(x==1){
					context.beginPath();
					context.arc(center.x, center.y, 20, 1.65 * Math.PI, 1.35 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x - 10, center.y + 10, 3, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}
				else if(x==2){
					context.beginPath();
					context.arc(center.x, center.y, 20, 0.65 * Math.PI, 0.35 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x +12 , center.y + 10, 3, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();				}
				else if(x==3){
					context.beginPath();
					context.arc(center.x, center.y, 20, 1.15 * Math.PI, 0.85 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x - 5, center.y - 15, 3, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();				}
				else{
					context.beginPath();
					context.arc(center.x, center.y, 20, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
					context.lineTo(center.x, center.y);
					context.fillStyle = pac_color; //color
					context.fill();
					context.beginPath();
					context.arc(center.x + 5, center.y - 15, 3, 0, 2 * Math.PI); // circle
					context.fillStyle = "black"; //color
					context.fill();
				}
			} else if (board[i][j] == 1.5 || board[i][j] == 1.15 || board[i][j] == 1.25) { //food
				context.beginPath();
				context.arc(center.x, center.y, 8, 0, 2 * Math.PI); // circle
				if(board[i][j] == 1.5){
					context.fillStyle = g_color5points; //color
				}
				else if(board[i][j] == 1.15){
					context.fillStyle = g_color15points; //color
				}
				else{
					context.fillStyle = g_color25points; //color
				}
				context.fill();
			} else if (board[i][j] == 4) { //wall
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "blue"; //color
				context.fill();
				console.log("draw walls on: "+i+" "+j);
			}
			else if (board[i][j] == 5) { //monster -life -10 score
				context.drawImage(monster1,center.x-15,center.y-15);
			}
			else if (board[i][j] == 6) { // angel +50 score
				context.drawImage(angel,center.x-15,center.y-15);

			}
			else if (board[i][j] == 7) { //med +life
				context.drawImage(med,center.x-15,center.y-15);

			}
			else if (board[i][j] == 8) { //clock + 20 sec
				context.drawImage(clock,center.x-15,center.y-15);

			}
			else if (board[i][j] == 9) { //monster -life -25 score
				context.drawImage(monster2,center.x-15,center.y-15);
			}
		}
	}

}
function UpdateMonster1Position(){
	var maxSize=17;
	var choice=0;
	var gotHim=false;
	var gotChoice=0;
	board[m1Shape.i][m1Shape.j]=0;
	if (m1Shape.j > 0 && board[m1Shape.i][m1Shape.j - 1] != 4) {
		var calc=Math.sqrt( Math.pow((m1Shape.i-shape.i), 2) + Math.pow(((m1Shape.j-1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=1;
		}
		if(shape.i==m1Shape.i && shape.j==(m1Shape.j-1)){
			gotHim=true;
			gotChoice=1;
		}
		
	}
	if (m1Shape.j < 11 && board[m1Shape.i][m1Shape.j + 1] != 4) {
		var calc=Math.sqrt( Math.pow((m1Shape.i-shape.i), 2) + Math.pow(((m1Shape.j+1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=2;
		}
		if(shape.i==m1Shape.i && shape.j==(m1Shape.j+1)){
			gotHim=true;
			gotChoice=2;
		}		
	}
	if (m1Shape.i > 0 && board[m1Shape.i - 1][m1Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m1Shape.i-1)-shape.i), 2) + Math.pow((m1Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=3;
		}
		if(shape.i==(m1Shape.i-1) && shape.j==m1Shape.j){
			gotHim=true;
			gotChoice=3;
		}
	}

	if (m1Shape.i < 11 && board[m1Shape.i + 1][m1Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m1Shape.i+1)-shape.i), 2) + Math.pow((m1Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=4;
		}
		if(shape.i==(m1Shape.i+1) && shape.j==m1Shape.j){
			gotHim=true;
			gotChoice=4;
		}
	}
	if(gotHim){
		if(gotChoice==1){
			m1Shape.j--;
		}
		else if(gotChoice==2){
			m1Shape.j++;
		}
		else if(gotChoice==3){
			m1Shape.i--;
		}
		else if(gotChoice==4){
			m1Shape.i++;
		}
	}
	else{
		if(choice==1){
			m1Shape.j--;
		}
		else if(choice==2){
			m1Shape.j++;
		}
		else if(choice==3){
			m1Shape.i--;
		}
		else if(choice==4){
			m1Shape.i++;
		}
	}	
	board[m1Shape.i][m1Shape.j]=5;

	
}

function UpdateMonster2Position(){
	var maxSize=17;
	var choice=0;
	var gotHim=false;
	var gotChoice=0;
	board[m2Shape.i][m2Shape.j]=0;
	if (m2Shape.j > 0 && board[m2Shape.i][m2Shape.j - 1] != 4) {
		var calc=Math.sqrt( Math.pow((m2Shape.i-shape.i), 2) + Math.pow(((m2Shape.j-1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=1;
		}
		if(shape.i==m2Shape.i && shape.j==(m2Shape.j-1)){
			gotHim=true;
			gotChoice=1;
		}
		
	}
	if (m2Shape.j < 11 && board[m2Shape.i][m2Shape.j + 1] != 4) {
		var calc=Math.sqrt( Math.pow((m2Shape.i-shape.i), 2) + Math.pow(((m2Shape.j+1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=2;
		}
		if(shape.i==m2Shape.i && shape.j==(m2Shape.j+1)){
			gotHim=true;
			gotChoice=2;
		}		
	}
	if (m2Shape.i > 0 && board[m2Shape.i - 1][m2Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m2Shape.i-1)-shape.i), 2) + Math.pow((m2Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=3;
		}
		if(shape.i==(m2Shape.i-1) && shape.j==m2Shape.j){
			gotHim=true;
			gotChoice=3;
		}
	}

	if (m2Shape.i < 11 && board[m2Shape.i + 1][m2Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m2Shape.i+1)-shape.i), 2) + Math.pow((m2Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=4;
		}
		if(shape.i==(m2Shape.i+1) && shape.j==m2Shape.j){
			gotHim=true;
			gotChoice=4;
		}
	}
	if(gotHim){
		if(gotChoice==1){
			m2Shape.j--;
		}
		else if(gotChoice==2){
			m2Shape.j++;
		}
		else if(gotChoice==3){
			m2Shape.i--;
		}
		else if(gotChoice==4){
			m2Shape.i++;
		}
	}
	else{
		if(choice==1){
			m2Shape.j--;
		}
		else if(choice==2){
			m2Shape.j++;
		}
		else if(choice==3){
			m2Shape.i--;
		}
		else if(choice==4){
			m2Shape.i++;
		}
	}	
	board[m2Shape.i][m2Shape.j]=9;

}

function UpdateMonster3Position(){
	var maxSize=17;
	var choice=0;
	var gotHim=false;
	var gotChoice=0;
	board[m3Shape.i][m3Shape.j]=0;
	if (m3Shape.j > 0 && board[m3Shape.i][m3Shape.j - 1] != 4) {
		var calc=Math.sqrt( Math.pow((m3Shape.i-shape.i), 2) + Math.pow(((m3Shape.j-1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=1;
		}
		if(shape.i==m3Shape.i && shape.j==(m3Shape.j-1)){
			gotHim=true;
			gotChoice=1;
		}
		
	}
	if (m3Shape.j < 11 && board[m3Shape.i][m3Shape.j + 1] != 4) {
		var calc=Math.sqrt( Math.pow((m3Shape.i-shape.i), 2) + Math.pow(((m3Shape.j+1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=2;
		}
		if(shape.i==m3Shape.i && shape.j==(m3Shape.j+1)){
			gotHim=true;
			gotChoice=2;
		}		
	}
	if (m3Shape.i > 0 && board[m3Shape.i - 1][m3Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m3Shape.i-1)-shape.i), 2) + Math.pow((m3Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=3;
		}
		if(shape.i==(m3Shape.i-1) && shape.j==m3Shape.j){
			gotHim=true;
			gotChoice=3;
		}
	}

	if (m3Shape.i < 11 && board[m3Shape.i + 1][m3Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m3Shape.i+1)-shape.i), 2) + Math.pow((m3Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=4;
		}
		if(shape.i==(m3Shape.i+1) && shape.j==m3Shape.j){
			gotHim=true;
			gotChoice=4;
		}
	}
	if(gotHim){
		if(gotChoice==1){
			m3Shape.j--;
		}
		else if(gotChoice==2){
			m3Shape.j++;
		}
		else if(gotChoice==3){
			m3Shape.i--;
		}
		else if(gotChoice==4){
			m3Shape.i++;
		}
	}
	else{
		if(choice==1){
			m3Shape.j--;
		}
		else if(choice==2){
			m3Shape.j++;
		}
		else if(choice==3){
			m3Shape.i--;
		}
		else if(choice==4){
			m3Shape.i++;
		}
	}	
	board[m3Shape.i][m3Shape.j]=5;

}

function UpdateMonster4Position(){
	var maxSize=17;
	var choice=0;
	var gotHim=false;
	var gotChoice=0;
	board[m4Shape.i][m4Shape.j]=0;
	if (m4Shape.j > 0 && board[m4Shape.i][m4Shape.j - 1] != 4) {
		var calc=Math.sqrt( Math.pow((m4Shape.i-shape.i), 2) + Math.pow(((m4Shape.j-1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=1;
		}
		if(shape.i==m4Shape.i && shape.j==(m4Shape.j-1)){
			gotHim=true;
			gotChoice=1;
		}
		
	}
	if (m4Shape.j < 11 && board[m4Shape.i][m4Shape.j + 1] != 4) {
		var calc=Math.sqrt( Math.pow((m4Shape.i-shape.i), 2) + Math.pow(((m4Shape.j+1)-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=2;
		}
		if(shape.i==m4Shape.i && shape.j==(m4Shape.j+1)){
			gotHim=true;
			gotChoice=2;
		}		
	}
	if (m4Shape.i > 0 && board[m4Shape.i - 1][m4Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m4Shape.i-1)-shape.i), 2) + Math.pow((m4Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=3;
		}
		if(shape.i==(m4Shape.i-1) && shape.j==m4Shape.j){
			gotHim=true;
			gotChoice=3;
		}
	}

	if (m4Shape.i < 11 && board[m4Shape.i + 1][m4Shape.j] != 4) {
		var calc=Math.sqrt( Math.pow(((m4Shape.i+1)-shape.i), 2) + Math.pow((m4Shape.j-shape.j), 2));
		if(calc<=maxSize){
			maxSize=calc;
			choice=4;
		}
		if(shape.i==(m4Shape.i+1) && shape.j==m4Shape.j){
			gotHim=true;
			gotChoice=4;
		}
	}
	if(gotHim){
		if(gotChoice==1){
			m4Shape.j--;
		}
		else if(gotChoice==2){
			m4Shape.j++;
		}
		else if(gotChoice==3){
			m4Shape.i--;
		}
		else if(gotChoice==4){
			m4Shape.i++;
		}
	}
	else{
		if(choice==1){
			m4Shape.j--;
		}
		else if(choice==2){
			m4Shape.j++;
		}
		else if(choice==3){
			m4Shape.i--;
		}
		else if(choice==4){
			m4Shape.i++;
		}
	}	
	board[m4Shape.i][m4Shape.j]=5;

}
function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) { //up
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
			lastPrased=1;
		}
	}
	else if (x == 2) { //down
		if (shape.j < 11 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
			lastPrased=2;
		}
	}
	else if (x == 3) { //left
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
			lastPrased=3;
		}
	}
	else if (x == 4) { //right
		if (shape.i < 11 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
			lastPrased=4;
		}
	}
	else{
		x=lastPrased;
	}
	if (board[shape.i][shape.j] == 1.5) { //food 5 points
		score = score +5;
	}
	if (board[shape.i][shape.j] == 1.15) { //food 15 points
		score = score +15;
	}
	if (board[shape.i][shape.j] == 1.25) { //food 25 points
		score = score +25;
	}
	if(board[shape.i][shape.j] == 5){ //monster
		score-=10;
		numOfLifes-=1;
		removeLife();	
		hitA.play();
		drawAfterHit();
	}
	if(board[shape.i][shape.j] == 9){ //monster
		score-=25;
		numOfLifes-=1;
		removeLife();
		hitA.play();
		drawAfterHit();

	}
	if(board[shape.i][shape.j] == 6){ //angel
		score+=50;
	}
	if(board[shape.i][shape.j] == 7){ //med
		numOfLifes+=1;
		addLife();
		hasMed=false;
	}

	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;

	if(board[shape.i][shape.j] == 8){ //clock
		g_time_settings+=(20/1000);
		hasClock=false;
	}
	board[shape.i][shape.j] = 2;
	if(score>=0 ){
		pac_color="yellow"
	}
	if (score < 0) {
		pac_color = "red";
	}
	if(numOfLifes<=2){
		if(!hasMed){
			drawMed();
		}
	}
	if(g_time_settings-time_elapsed<200){
		if(!hasClock){
			drawClock();
		}
	}
	if (g_time_settings-time_elapsed<0) {
		window.clearInterval(interval);
		if(score>=100){
			window.alert("Winner!!!");
		}
		else{
			window.alert("You are better then "+score+"points!");

		}
	}
	else if(numOfLifes==0){
		window.clearInterval(interval);
		window.alert("Loser");
		f_ChangeSettings();
		
	}
	else {
		Draw(x);
	}
}

function drawMed(){
//med in random position
hasMed=true;
var x=Math.floor(Math.random() * 6 + 1);
if(x==1){
	board[6][11]=7;

}
else if(x==2){
	board[7][6]=7;

}
else if(x==3){
	board[9][5]=7;

}
else if(x==4){
	board[9][5]=7;

}
else if(x==5){
	board[0][6]=7;

}
else{
	board[10][0]=7;

}

}

function drawClock(){
	//clock in random position
	hasClock=true;
	var x=Math.floor(Math.random() * 6 + 1);
	if(x==1){
		board[4][5]=8;

	}
	else if(x==2){
		board[10][7]=8;

	}
	else if(x==3){
		board[0][9]=8;

	}
	else if(x==4){
		board[2][3]=8;

	}
	else if(x==5){
		board[2][9]=8;

	}
	else{
		board[8][7]=8;

	}

}

function drawAfterHit(){
	//monsters in the corners
	board[m1Shape.i][m1Shape.j]=0;
	m1Shape.i=0;
	m1Shape.j=0;
	board[m1Shape.i][m1Shape.j]=5;
	if(g_monsters_settings == 1){
		board[m1Shape.i][m1Shape.j]=0;
		m1Shape.i=0;
		m1Shape.j=0;
		board[m1Shape.i][m1Shape.j]=5;
	}
	if(g_monsters_settings == 2){
		board[m1Shape.i][m1Shape.j]=0;
		m1Shape.i=0;
		m1Shape.j=0;
		board[m1Shape.i][m1Shape.j]=5;

		board[m2Shape.i][m2Shape.j]=0;
		m2Shape.i=11;
		m2Shape.j=11;
		board[m2Shape.i][m2Shape.j]=9;
	}
	if(g_monsters_settings == 3){
		board[m1Shape.i][m1Shape.j]=0;
		m1Shape.i=0;
		m1Shape.j=0;
		board[m1Shape.i][m1Shape.j]=5;

		board[m2Shape.i][m2Shape.j]=0;
		m2Shape.i=11;
		m2Shape.j=11;
		board[m2Shape.i][m2Shape.j]=9;
		
		board[m3Shape.i][m3Shape.j]=0;
		m3Shape.i=11;
		m3Shape.j=0;
		board[m3Shape.i][m3Shape.j]=5;
	}
	if(g_monsters_settings == 4){
		board[m1Shape.i][m1Shape.j]=0;
		m1Shape.i=0;
		m1Shape.j=0;
		board[m1Shape.i][m1Shape.j]=5;

		board[m2Shape.i][m2Shape.j]=0;
		m2Shape.i=11;
		m2Shape.j=11;
		board[m2Shape.i][m2Shape.j]=9;
		
		board[m3Shape.i][m3Shape.j]=0;
		m3Shape.i=11;
		m3Shape.j=0;
		board[m3Shape.i][m3Shape.j]=5;

		board[m4Shape.i][m4Shape.j]=0;
		m4Shape.i=0;
		m4Shape.j=11;
		board[m4Shape.i][m4Shape.j]=5;
	}

	//pacman in random position
	var x=Math.floor(Math.random() * 6 + 1);
	if(x==1){
		board[5][2]=2;
		shape.i=5;
		shape.j=2;
	}
	else if(x==2){
		board[6][3]=2;
		shape.i=6;
		shape.j=3;
	}
	else if(x==3){
		board[9][5]=2;
		shape.i=9;
		shape.j=5;
	}
	else if(x==4){
		board[8][9]=2;
		shape.i=8;
		shape.j=9;
	}
	else if(x==5){
		board[4][6]=2;
		shape.i=4;
		shape.j=6;
	}
	else{
		board[0][3]=2;
		shape.i=0;
		shape.j=3;
	}


}

function resetLifes(){
	$("#life5").show();
	$("#life4").show();
	$("#life3").show();
	$("#life2").show();
	$("#life1").show();

}
function addLife(){
	if(numOfLifes==5){
		$("#life5").show();
	}
	else if(numOfLifes==4){
		$("#life4").show();
	}
	else if(numOfLifes==3){
		$("#life3").show();
	}
	else if(numOfLifes==2){
		$("#life2").show();
	}
}
function removeLife(){
	if(numOfLifes==4){
		$("#life5").hide();
	}
	else if(numOfLifes==3){
		$("#life4").hide();
	}
	else if(numOfLifes==2){
		$("#life3").hide();
	}
	else if(numOfLifes==1){
		$("#life2").hide();
	}
	else if(numOfLifes==0){
		$("#life1").hide();
	}
}






//Presentation  logic
function unShowAll(){
	if(!audio.paused){
		audio.pause();
		audio.currentTime =0;
	}
	$("#welcome").hide();
	$("#Login").hide();
	$("#Unregistered").hide();
	$("#Register").hide();
	$("#alredySignin").hide();
	$("#game").hide();
	$("#score").hide();
	$("#userName").hide();
	$("#life").hide();
	$("#time").hide();
	$("#ChangeSettings").hide();
	$("#Confirmation_settings").hide();

}

function f_Game(){
	unShowAll();
	var canvas = document.getElementById("canvas");
	context = canvas.getContext("2d");
	$("#game").show();
	$("#score").show();
	$("#userName").show();
	$("#life").show();
	$("#time").show();
	audio.play();
	window.location.href='#game';
	Start();
}

function welcome(){
	unShowAll();
	$("#welcome").show();
	window.location.href='#welcome';
}


function f_ChangeSettings(){
	unShowAll();
	$("#ChangeSettings").show();
	window.location.href='#ChangeSettings';

	var text_up = document.getElementById("up");
	var text_down = document.getElementById("down");
	var text_right = document.getElementById("right");
	var text_left = document.getElementById("left");
	var number_time = document.getElementById("time_settings");
	var number_monsters = document.getElementById("monsters_amount_settings");
	var number_food = document.getElementById("amountFoodSettings");
	var c_5 = document.getElementById("color5_points");
	var c_15 = document.getElementById("color15_points");
	var c_25 = document.getElementById("color25_points");



	text_up.addEventListener('keyup', (e) => {
		text_up.placeholder= e.key;
		g_key_up = e.keyCode;	
		text_up.value = e.key;	
		document.getElementById("up_conf").textContent = e.key;
	  });
	
	text_down.addEventListener('keyup', (e) => {
		text_down.placeholder= e.key;
		g_key_down = e.keyCode;	
		text_down.value = e.key;	
		document.getElementById("down_conf").textContent = e.key;
	  });

	text_right.addEventListener('keyup', (e) => {
		text_right.placeholder= e.key;
		g_key_right = e.keyCode;
		text_right.value = e.key;	
		document.getElementById("right_conf").textContent = e.key;

	  });

	text_left.addEventListener('keyup', (e) => {
		text_left.placeholder= e.key;
		g_key_left = e.keyCode;	
		text_left.value = e.key;
		document.getElementById("left_conf").textContent = e.key;

	  });

	number_time.addEventListener('input', (e) => {
		document.getElementById("time_conf").textContent = number_time.value;

	  });

	number_monsters.addEventListener('input', (e) => {
		document.getElementById("monsters_conf").textContent = number_monsters.value;

	  });

	number_food.addEventListener('input', (e) => {
		document.getElementById("food_conf").textContent = number_food.value;
	  });	

	c_5.addEventListener('change', (e) => {
		document.getElementById("points5_conf").style.color = c_5.value;
	  });	

	c_15.addEventListener('change', (e) => {
		document.getElementById("points15_conf").style.color = c_15.value;
	  });	
	
	c_25.addEventListener('change', (e) => {
		document.getElementById("points25_conf").style.color = c_25.value;
	  });	  
}

function showRegister(){
	unShowAll();
	$("#Register").show();
	$("#alredySignin").show();
	window.location.href='#Register';
}

function showLogin(){
	unShowAll();
	$("#Login").show();
	window.location.href='#Login';
	$("#Unregistered").show();
}


/////// model ///////
// opens the model
function showAbout(){
	$("#about").show()
	modelOn=true;
}
// closes the model by x
function closeModel(){
	$("#about").hide()
	modelOn=false;
}
// closes the model by pressing outside the window
window.onclick = function (event) {
  if (event.target == about) {
		$("#about").hide();
  }
};
// closes the model by pressing key - escape
window.addEventListener("keyup", function (e) {
  if (e.keyCode === 27) {
	$("#about").hide();


  }
});
/////// end model//////

function registerComplete(){ 
	var rgularExp = {
        containsNumber : /\d+/,
        containsAlphabet : /[a-zA-Z]/,
        onlyLetters : /^[A-Za-z]+$/,
    }
	var isOk=true;
	var pass= document.getElementById("password").value;
	var fullname= document.getElementById("fullname").value;
	var mail= document.getElementById("mail").value;
	var date= document.getElementById("date").value;
	var username= document.getElementById("username").value;

	//check all fileds are not empty 
	if(pass.length===0 || fullname.length===0 || mail.length===0 || username.length===0 || date.length===0){
		alert("Please fill in all of the fields!");
		isOk=false;
	}

	//check password - longer then 6 and has numeric and alphabetic
	else if (pass.length < 6 || !rgularExp.containsNumber.test(pass) || !rgularExp.containsAlphabet.test(pass)){
		alert("You did not enter details properly! \n\npassword must contain at least 6 characters- numbers and letters.");
		isOk=false;
	}

	//check valid mail
	else if(!mail.includes("@")){
		alert("You did not enter details properly! \n\nMail address is not a valid mail address.");
		isOk=false;
	}

	//check name has no numbers
	else if(rgularExp.containsNumber.test(fullname)){
		alert("You did not enter details properly! \n\nFull name must contain only letters.");
		isOk=false;
	}

	// if not ok - go back to register and change
	if(!isOk){
		showRegister();
		console.log("false");
		return;
	}
	// if ok - start game
	else{
		//insert new user to the users array 
		localStorage.setItem(username,JSON.stringify({username: username, password: pass,
			fullname: fullname, mail: mail, date: date}));
		alert("added success");
		showLogin();
		
	}
	return;
}

function isUserValid(user, pass) {

	const userLS = JSON.parse(localStorage.getItem(user));
	if (userLS===null){ //user not exist
		return false;
	} 
	else{ //user exist
		if(userLS.password === pass){ //user and password is match
			return true;
		}
		else{ //password wrong
			return false;
		}
	}
  }


function login(){
	var pass= document.getElementById("pswLogin").value;
	var user= document.getElementById("userLogin").value;

	//check all fileds are not empty 
	if(pass.length===0 || user.length===0){
		alert("You did not enter your user name or password!");
		showLogin();
	}
	else{
		if (isUserValid(user, pass)) {
			console.log("true");
			alert("you entered everything ok");
			userTitle = user;
			f_ChangeSettings();
			return;

		} else {
			console.log("false");
			alert("Sorry, wrong username and password!");
			showLogin();
			return;
		}	
	}
	return;
}
