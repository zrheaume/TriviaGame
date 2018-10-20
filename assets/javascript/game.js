// ZACH RHEAUME
// Unit 5 Assignment - TRIVIA GAME
// 
// assets/javascript/game.js
// Description:
// javaScript file to provide dynamic response and logic processing to the index.html web page

// ___________________________________________________________________________________________
// |---|___|---| * |---|___|---|\/|---|___|---| * |---|___|---|\/|---|___|---| * |---|___|---|
// |___|[+]|___|/^\|___|[+]|___|/\|___|[+]|___|/^\|___|[+]|___|/\|___|[+]|___|/^\|___|[+]|___|
// ___________________________________________________________________________________________


// GLOBAL VARIABLE DECLARATION

var intervalId;
var clockRunning = false;

winCount = 0;
lossCount = 0;
gameOver = false;

// GLOBAL HTML PULL
var winDisplay = $("#win-count");
var lossDisplay = $("#loss-count");
var timerDisplay = $("#time-remaining");
var questionDisplay = $("#question");
var ans1 = $("#answer-1");
var ans2 = $("#answer-2");
var ans3 = $("#answer-3");
var ans4 = $("#answer-4");
var answerArray = [ans1, ans2, ans3, ans4];

// The trivia object encompasses the majority of the game's functionality outside of event handlers and global parameters
var trivia = {

    // set timeRemaining to 15 so that it can be used as a reference for a countdown interval down the road
    timeRemaining: 15,
    questionsPlayed: [],
    correctAnswer : '',


    // Array container for questions and answers
    qA: [
        // Each question is represented as an object
        // Each question/answer object has the property "question", whose value is the respective question (string)
        {
            question: "What musical duo had its fate sealed when the two performers were caught lip-syncing at the July 1989 Lake Compounce MTV Live event? ",
            // Each object in the qA array also has the property "answers", whose value is a 4-element array of objects
            answers: [
                {
                    // Each object in the qA.answers array has two properties: text, and correct. 
                    // qA[index].answers[index].text contains the respective answer
                    // qA[index].answers[index].correct contains a boolean value that represents whether the answer is correct or not
                    text: "Cheech and Chong",
                    correct: false
                }, {
                    text: "Milli Vanilli",
                    correct: true
                }, {
                    text: "The Pet Shop Boys",
                    correct: false
                }, {
                    text: "Moosh and Twist",
                    correct: false
                }

            ]
        },
        {
            question: "On the cover of the The Beatles' 1969 album Abbey Road, which of the band members is at the head of the line walking accross the road?",
            answers: [
                {
                    text: "Paul McCartney",
                    correct: false
                }, {
                    text: "George Harrison",
                    correct: false
                }, {
                    text: "John Lennon",
                    correct: true
                }, {
                    text: "Ringo Starr",
                    correct: false
                }
            ]
        },
        {
            question: "Which of the following albums holds the title of all-time best selling album, at 47.3 million certified copies sold?",
            answers: [
                {
                    text: "Dark Side of the Moon",
                    correct: false
                }, {
                    text: "Back in Black",
                    correct: false
                }, {
                    text: "Thriller",
                    correct: true
                }, {
                    text: "Hotel California",
                    correct: false
                }
            ]
        },
        {
            question: "What trio from Manchester, England, orginally known as the Rattlesnakes, would go on to become one of the best-selling groups of all time?",
            answers: [
                {
                    text: "Toto",
                    correct: false
                }, {
                    text: "The Rolling Stones",
                    correct: false
                }, {
                    text: "The BeeGees",
                    correct: true
                }, {
                    text: "U2",
                    correct: false
                }
            ]
        },
        {
            question: "What beloved musical act began as a sketch on SNL?",
            answers: [
                {
                    text: "The Blues Brothers",
                    correct: true
                }, {
                    text: "The B-52's",
                    correct: false
                }, {
                    text: "Earth Wind and Fire",
                    correct: false
                }, {
                    text: "The Alaskan Bullfrogs",
                    correct: false
                }
            ]
        },
        {
            question: "Which band, formed in 1963, started the careers of famous rock guitarists Jeff Beck, Jimmy Paige, and Eric Clapton?",
            answers: [
                {
                    text: "The Quarrymen",
                    correct: false
                }, {
                    text: "Box of Frogs",
                    correct: false
                }, {
                    text: "The Yardbirds",
                    correct: true
                }, {
                    text: "Led Zeppelin",
                    correct: false
                }
            ]
        },
        {
            question: "What band was founded by studio musicians Glenn Fry and Don Henley when singer Linda Rondstat recruited them to play on her tour?",
            answers: [
                {
                    text: "AC/DC",
                    correct: false
                }, {
                    text: "The Eagles",
                    correct: true
                }, {
                    text: "Bowling For Soup",
                    correct: false
                }, {
                    text: "Neutral Milk Hotel",
                    correct: false
                }
            ]
        }
    ],

    // trivia.selectQuestion picks a random q/a set from the qA array and displays them on index.html
    selectQuestion: function () {

        // Start by varifying there are still unused questions available to pick
        if (trivia.questionsPlayed.length != trivia.qA.length) {
            
            // Generate a random number between 0 and the length of the trivia.qA array
            // This will be used as an index to locate a question/answer object
            var questionSelector = Math.floor(Math.random() * trivia.qA.length);

            // Check to see if that selector has been used before
            if (trivia.questionsPlayed.indexOf(questionSelector) != -1) {
                // If it has been used, try again
                trivia.selectQuestion();
            }

            // If a new selector has, in fact, been generated:
            else if (trivia.questionsPlayed.indexOf(questionSelector) === -1) {

                // Add the selector to the array questionsPlayed
                trivia.questionsPlayed.push(questionSelector);

                // display the question
                questionDisplay.text(trivia.qA[questionSelector].question);

                // create a for loop that iterates through each answer HTML element
                for (z = 0; z < answerArray.length; z++) {

                    // set the text of the current HTML element to the value of the current corresponding answer text property
                    answerArray[z].text(trivia.qA[questionSelector].answers[z].text);

                    // check to see if the answer being populated is the correct answer
                    if (trivia.qA[questionSelector].answers[z].correct === true) {
                        
                        trivia.correctAnswer = "answer-opt-" + ( z + 1 );
                        // answerArray[z].attr("data-correct", "yes");
                    }

                }
            }
        }

        // If there are no remaining questions to play
        else if(trivia.questionsPlayed.length === trivia.qA.length){
            gameOver = true;
        }
    },

    // trivia.start populates the page with a question and answers and sets the timer running
    start: function () {
        //validate clock is not already running
        if (!clockRunning) {
            // call selectQuestion method to pick and populate q/a
            trivia.selectQuestion();
            // set a 1000 milisecond countdown interval
            intervalId = setInterval(trivia.countDown, 1000);
            clockRunning = true;
            console.log('start');
        }
    },

    // trivia.countDown provides a countdown function for the timer interval
    countDown: function () {
        // Validate the clock should be running
        if (clockRunning) {
            // if  timeRemaining is greater than 0, subtract one from the timeRemaining counter and update the display
            if (trivia.timeRemaining > 0) {
                trivia.timeRemaining--;
                $('#time-remaining').text(trivia.timeRemaining);
            }
            // if timeRemaining is 0, turn the clock off and reset the whole gig
            else if (trivia.timeRemaining === 0) {
                // alert('TIMES UP!');
                confirm("The correct asnwer was: " + document.getElementById(trivia.correctAnswer).textContent);
                lossCount++;
                lossDisplay.text(lossCount);
                trivia.reset();
                clearInterval(intervalId);
                clockRunning = false;
            }
        }
    },

    // trivia.reset provides a reset function that clears resets the timer and clears the page
    reset: function () {

        clearInterval(intervalId);
        trivia.timeRemaining = 15;
        clockRunning = false;

        timerDisplay.text(trivia.timeRemaining);
        questionDisplay.text("");
        ans1.text("");
        ans2.text("");
        ans3.text("");
        ans4.text("");
    },

    conclude: function(){
        trivia.reset();
        if(winCount > lossCount){
            alert("GAME OVER");
            alert("YOU WON");
        }
        else if(winCount < lossCount){
            alert("GAME OVER");
            alert("YOU LOST");
        }
    }

    
}

console.log()

$('#start-button').on('click', function () {
    if(!gameOver){
        trivia.start();
    }
    else if (gameOver){
        trivia.conclude();
    }
});

$('.answer-opt').on('click', function(){
    if (this.id == trivia.correctAnswer && clockRunning){
        alert("Correct!");
        winCount++;
        winDisplay.text(winCount); 
        trivia.reset();
    }
    else if (this.id != trivia.correctAnswer && clockRunning){
        alert("Oops! The correct answer was: " + document.getElementById(trivia.correctAnswer).textContent);
        lossCount++;
        lossDisplay.text(lossCount); 
        trivia.reset();
    } 
});

