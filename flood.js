var colors0 = ['#FF6C00', '#FFA500', '#1047A9', '#009E8E','#6A0C62'];
// next: different color schemes

function initial_table(size) {
	// creates the initial game table, with specified size (table is square)
	var main_table = document.createElement("table");
	
	for(var i = 0; i < size; i++)
	{
	// creates a <tr> element
	var current_row = document.createElement("tr");
	
		for(var j = 0; j < size; j++)
		{
		// creates a <td> element
		var current_cell = document.createElement("td");

		// puts the cell into the row
		current_row.appendChild(current_cell);
		}
	// puts the row into the table
	main_table.appendChild(current_row);
	}
	main_table.setAttribute("id","main_table");
	
	var container = document.getElementById('container')
	container.appendChild(main_table);
}

function RandomColor(colors) {
    return colors[Math.floor(Math.random()*colors.length)];
};

function color_table(colors) {
	var color_table = document.createElement("table");
	var color_table_row = document.createElement("tr");
	
	//create one <td> for each color, id is index of color in colors
	for(var i = 0; i < colors.length; i++){
		var color_cell = document.createElement("td");
		color_cell.setAttribute("id",i);
		color_table_row.appendChild(color_cell);
	}
	color_table.appendChild(color_table_row);
	color_table.setAttribute("id","color_table");
	document.body.appendChild(color_table);
}

function make_counter() {
	var counter = document.createElement("div");
	counter.setAttribute("id","counter");
	document.body.appendChild(counter);
}

//update counter
function updateCounter(moves,max_moves) {
	$('#counter').text(moves+"/"+max_moves);
	
}

//get color state of main_table and put into array
function getArray() {
	var myTableArray = [];
	$("#main_table tr").each(function() {
    	var arrayOfThisRow = [];
		$(this).find('td').each(function(){
			arrayOfThisRow.push(false);
			});
		myTableArray.push(arrayOfThisRow);
		//console.log(arrayOfThisRow);
		});
	//console.log(myTableArray);
	return myTableArray
}

function rgb2hex(rgb) {
    var rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    result = "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    return result.toUpperCase();
}

function get_color(row,col) {
	return rgb2hex($("#main_table tr:eq("+row+") td:eq("+col+")").css("background-color"));
	}

// tests to see if color of (row,col) is color (returns true/false)
function test_color(row,col,color) {
	if (get_color(row,col) == color) {
		return true;
	}
	else {
		return false;
	}
}

//menu
function create_menu(sizes) {
	var menu_table = document.createElement("div");
	menu_table.setAttribute("id","menu");

	var newGame_div = document.createElement("div");
	newGame_div.appendChild(document.createTextNode("New Game"));
	newGame_div.setAttribute("id","new_game");
	newGame_div.setAttribute("class","menu_item");
	menu_table.appendChild(newGame_div);
	
	var sizes_div = document.createElement("div");
	sizes_div.appendChild(document.createTextNode("Sizes"));
	sizes_div.setAttribute("id","sizes");
	sizes_div.setAttribute("class","menu_item");
	menu_table.appendChild(sizes_div);
	
	var sizesInfo_div = document.createElement("div");
	sizesInfo_div.setAttribute("id","sizes_info");

    var sizesTable = document.createElement("table");
	sizesTable.setAttribute("id","sizes_table");
    
    var sizesTable_row = document.createElement("tr");
	for(var i = 0; i < sizes.length; i++){
		var sizesTable_cell = document.createElement("td");
		sizesTable_cell.appendChild(document.createTextNode(sizes[i]));
		sizesTable_cell.setAttribute("class","size");
		sizesTable_row.appendChild(sizesTable_cell);
	}
    sizesTable.appendChild(sizesTable_row);    
    sizesInfo_div.appendChild(sizesTable);
	menu_table.appendChild(sizesInfo_div);

	var help_div = document.createElement("div");
	help_div.appendChild(document.createTextNode("Help"));
	help_div.setAttribute("id","help");
	help_div.setAttribute("class","menu_item");
	menu_table.appendChild(help_div);
	
	var helpInfo_div = document.createElement("div");
	helpInfo_div.appendChild(document.createTextNode("Fill the board with a single color, starting from the upper left corner. Click the squares to the side of the board to change the colors."));
	helpInfo_div.setAttribute("id","help_info");
	menu_table.appendChild(helpInfo_div);
	
	document.body.appendChild(menu_table);
		
}

$(document).ready(function() {
var first_time = true;

//set color scheme
var colors = colors0;
var sizes = [5,10,15,20,25];

//create menu
create_menu(sizes);


//slide down
$("#help").click(function(){
	if ($("#help_info").is(":hidden")) {
		$("#help_info").slideDown("slow");
		$("#help_info").animate({opacity: 1},{queue: false});
	}
	else {
		$("#help_info").slideUp("slow");
		$("#help_info").animate({opacity: 0},{queue: false});
	}
});

$("#sizes").click(function(){
	if ($("#sizes_info").is(":hidden")) {
		$("#sizes_info").slideDown("slow");
		$("#sizes_info").animate({opacity: 1},{queue: false});
	}
	else {
		$("#sizes_info").slideUp("slow");
		$("#sizes_info").animate({opacity: 0},{queue: false});
	}
});


//hover
$("#menu").children().not("#help_info, #sizes_info").hover(function(){
	var randColor = RandomColor(colors);
	$(this).stop().animate({"backgroundColor": randColor});
	},
	function(){
	$(this).stop().animate({"backgroundColor": "initial"});
	});
$("#sizes_table td").hover(function(){
	var randColor = RandomColor(colors);
	$(this).stop().animate({"backgroundColor": randColor});
	},
	function(){
	$(this).stop().animate({"backgroundColor": "initial"});
	});
	
function new_game(size,colors){
$("#main_table, #counter, #color_table").remove();
$("#end").empty();
$("#end").css("display","none");
//number of moves
var moves = 0;
var finish = false;

//change to depend on size
var max_moves = Math.ceil(1.5*size);

//create table
initial_table(size);

//randomize colors
$("#main_table td").each(function(){$(this).css("background-color", RandomColor(colors))});

//create table for color changing
color_table(colors);

//create counter
make_counter();

//update counter
updateCounter(moves,max_moves);

//initial array
var mainTableArray = getArray();

//start with first cell
mainTableArray[0][0] = true;

// change color of (row,col) to color
function change_color(row,col,color) {
	$("#main_table tr:eq("+row+") td:eq("+col+")").animate({backgroundColor:color},1000);
}

//test cell
function test_cell(row,col,color) {
	//color must be hex
	if (mainTableArray[row][col] == true){
		return;
	}
	else if (test_color(row,col,color)) {
		mainTableArray[row][col] = true;
		neighbors(row,col,color);
	}
}

//test neighbors
function neighbors(row,col,color) {
	//right neighbor (size-1 is rightmost column)
	if (col < size-1) {
		test_cell(row,col+1,color);
		}
	//left neighbor (0 is leftmost column)
	if (col > 0) {
		test_cell(row,col-1,color);
		}
	//below neighbor (size-1 is bottommost row)
	if (row < size-1) {
		test_cell(row+1,col,color);
		}
	//above neighbor (0 is topmost row)
	if (row > 0) {
		test_cell(row-1,col,color);
		}
	}

//add neighbors of first cell
neighbors(0,0,get_color(0,0));

$("#color_table td").each(function() {
	//set colors for color table
	var id = $(this).attr("id");
	var color = colors[id];
	$(this).css("background-color",color);
	
	//hover
	$(this).hover(function(){
	$(this).stop().animate({"opacity": 0.75});
	},
	function(){
	$(this).stop().animate({"opacity": 1});
	});
	
	//set what happens when a color is clicked
	$(this).click(function(){
	
	if (finish == false) {
	moves++;
	updateCounter(moves,max_moves);
	}
	
	for(var row = 0; row < size; row++) {
		for(var col = 0; col < size; col++) {
			if(mainTableArray[row][col] == true) {
				change_color(row,col,color);
			}
		}
	}
	for(var row = 0; row < size; row++) {
		for(var col = 0; col < size; col++) {
			if(mainTableArray[row][col] == true) {
				neighbors(row,col,color);
			}
		}
	}
	
	if (mainTableArray.every(function(arr) {return arr.every(Boolean)}) && finish != true) {
		document.getElementById("end").innerHTML="<span>You win!</span>";
		$("#end").fadeIn("slow");
		$("#again").fadeIn("slow");
		finish = true;
		}
	if (moves == max_moves && mainTableArray.every(function(arr) {return arr.every(Boolean)}) && finish != true) {
		document.getElementById("end").innerHTML="<span>You win!</span>";
		$("#end").fadeIn("slow");
		$("#again").fadeIn("slow");
		finish = true;
		}
	else if (moves == max_moves && finish != true) {
		document.getElementById("end").innerHTML="<span>You lose!</span>";
		$("#end").fadeIn("slow");
		$("#again").fadeIn("slow");
		finish = true;
	}
	});
});
}

$("#new_game").click(function(){
	if(first_time == true){
	new_game(15,colors);
	first_time = false;
	}
	else {
	var size = $('#main_table tr').length;
	console.log(size);
	new_game(size,colors);
	}
});

//set dimensions of table
$("#sizes_info td").each(function(){
	$(this).click(function(){
	first_time = false;
	var size = Number($(this).text());
	new_game(size,colors);
	});	
});

});
