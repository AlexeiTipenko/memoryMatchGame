/*
Name: Alexei Tipenko (100995947)
Date: Sunday, November 13th, 2016
*/

$(document).ready(function() {

  var user = prompt("What is your name: ") || "User";             //Prompt user for username
  var choice1 = undefined;                                        //First card choice
  var choice2 = undefined;                                        //Second card choice
  var numFlipped = 0;                                             //num cards permanently flipped
  var numGuesses = 0;                                             //Num of guesses (by pair of cards)
  var totalFlipped;                                               //Total number of cards to be flipped
  newGame();                    //Start a new game



  /*Creates new empty board */
  /*input: data, output: new game board (not directly returned)*/
  function displayGame(data) {

    $("#gameboard").empty();            //Empty game board
    var rowLen = data.value;

    for (var i = 0; i < rowLen; i++) {          //looping through row length times
      var row = $("<tr></tr>");
      totalFlipped = rowLen * rowLen;

      for (var j=0; j < rowLen; j++) {          //looping through values in row (row length times)
        var tile = $("<div class='tile' data-row='" +i+ "' data-col='" +j+ "'><span id='cardVal'></span></div>");
        row.append(tile);                       //Creating new tile and adding it to row
        $(tile).click(flipCard);                //onclick
      }
      $("#gameboard").append(row);              //Add current row to gameboard
    }
  }


  /*Shows value of the corresponding card */
  /*input: data, output: flipped card(s) (not directly returned)*/
  function showValue(data) {

    if (!(($(choice1).hasClass("permSelected")) || ($(choice2).hasClass("permSelected")))) {

      if (($(choice1).text() === "") && ($(choice2).text() === "")) {      //if both choice1 and choic2 are empty
        $(choice1).animate({ height: '1px'}, "fast");
        $(choice1).addClass("selected");
        $(choice1).text(data.cardNum);
        $(choice1).animate({ height: '50px'}, "fast");
      }

      else if ($(choice2).text() === ""){                         //if only text is empty
        $(choice2).animate({ height: '1px'}, "fast");
        $(choice2).addClass("selected");
        $(choice2).text(data.cardNum);
        $(choice2).animate({ height: '50px'}, "fast");

        if ($(choice1).text() === $(choice2).text()) {            //if the two values are equal
          numFlipped += 2;                                        //add 2 to number of permanently flipped cards
          numGuesses += 1;                                        //increase num of guesses

          $(choice1).addClass("permSelected");
          $(choice2).addClass("permSelected");

          if (numFlipped === totalFlipped) {                      //if num flipped equals to total flipped
            numFlipped = 0;
            setTimeout(function() {
              alert("You made "+numGuesses+" guesses this round.");       //notify user of amount of guesses
              numGuesses = 0;
              newGame()}, 750);  //start new game
          }
          choice1 = undefined;  //set both choices back to undefined
          choice2 = undefined;
        }

        else {                                          //otherwise, flipBack both cards in 1 sec
          setTimeout(flipBackAll, 1000);
        }
      }
    }

    else {          //if at least one choice was already permanent

      if (!($(choice1).hasClass("permSelected")) && ($(choice2).hasClass("permSelected"))) {    //if choice 1 is not
        setTimeout(flipBackFirst, 1000);                                                        //but choice 2 is
      }

      else if ($(choice1).hasClass("permSelected") && ($(choice2).hasClass("permSelected"))) {  //if both are perm
        choice1 = undefined;                      //Set both choices to undefined
        choice2 = undefined;
        numGuesses += 1;
      }

      else if ($(choice1).hasClass("permSelected") && (choice2 === undefined)) {        //if choice 1 is perm,
        $(choice2).addClass("selected");                                                //choice 2 still undefined
      }

      else if ($(choice1).hasClass("permSelected") && !($(choice2).hasClass("permSelected"))) { //if choice 1 perm,
        $(choice2).animate({ height: '1px'}, "fast");                                           //choice 2 isnt
        $(choice2).addClass("selected");
        $(choice2).text(data.cardNum);
        $(choice2).animate({ height: '50px'}, "fast");
        setTimeout(flipBackSecond, 1000);
      }
    }
  }


  /*Flips back cards associated with choice1 and choice2 */
  /*input: none, output: cards flipped back (not directly returned)*/
  function flipBackAll() {
    $(choice1).removeClass("selected");       //remove class selected from choice 1 and 2
    $(choice2).removeClass("selected");
    $(choice1).text("");                      //Set text to both tiles to blank
    $(choice2).text("");
    choice1 = undefined;                      //Set both choices to undefined
    choice2 = undefined;
    numGuesses += 1;                          //Increment the num of guesses
  }


  /*Flips back cards associated with choice1 */
  /*input: none, output: choice1 card flipped back (not directly returned)*/
  function flipBackFirst() {
    $(choice1).removeClass("selected");       //remove class from choice 2
    $(choice1).text("");                      //Set text to time of choice 2 to undefined
    choice1 = undefined;                      //Set both choices to undefined
    choice2 = undefined;
    numGuesses += 1;                          //Increment the num of guesses
  }


  /*Flips back cards associated with choice2 */
  /*input: none, output: choice2 card flipped back (not directly returned)*/
  function flipBackSecond() {
    $(choice2).removeClass("selected");       //remove class from choice 2
    $(choice2).text("");                      //Set text to time of choice 2 to undefined
    choice1 = undefined;                      //Set both choices to undefined
    choice2 = undefined;
    numGuesses += 1;                          //Increment the num of guesses
  }


  /*Gets value of card selected and flips it */
  /*input: the card selected, output: card flipped (not directly returned)*/
  function flipCard() {

    if (choice1 === undefined) {              //If choice 1 is undefined, current flipped card becomes choice1
      choice1 = this;
    }

    else if (choice2 === undefined){          //If choice 2 is undefined

      if (($(this).data("row") != $(choice1).data("row")) || ($(this).data("col") != $(choice1).data("col"))) {
        choice2 = this;                       //If card selected does not have the same index as choice 1
      }                                         //current flipped card becomes choice2
    }

    $.ajax({                          //Get request for value of the card to be flipped
      method:"GET",
      url:"/memory/card",
      data: {"username":user, "row": $(this).data("row"), "col": $(this).data("col")},
      success: showValue,       //call showValue()
      dataType:'json'
    });
  }

  function newGame() {                //Creates a new game by sending a get request
    $.ajax({                          //which returns new board length
      method:"GET",
      url:"/memory/intro",
      data: {"username":user},
      success: displayGame,     //call displayGame()
      dataType:'json'
    });
  }
});
