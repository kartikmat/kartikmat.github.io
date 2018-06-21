/**
 * 
 */
var myQuestions = [
	{
		question: "Thank you for Answering! We will get back to you shortly",
		choices: [],
		choice: "a"
	},
	{
		question: "Please fill out a request",
		choices: [],
		choice: "a"
	},
	{
		question: "Hello! Are you looking to buy any equipment?",
		choices: ["Yes", "No"],
		choice: "a"
	},
	{
		question: "Please select an item from the dropdown",
		choices: [],
		choice: "c"
	}
];

function buildQuiz(myQuestions) {
	// we'll need a place to store the HTML output
	console.log("BuildQuiz has started");
	const output = [];
	for (var j = 0, len = myQuestions.length; j < len; j++) {
		currentQuestion = myQuestions[j];
		questionNumber = j;

		const answers = [];
		for (var k = 0, len2 = currentQuestion.choices.length; k < len2; k++) {

			answers.push(
				`<div>
				<label for="c1">`+ currentQuestion.choices[k] + `</label>
    <input type="checkbox" id="c1"
     name="c" value="`+ currentQuestion.choices[k] + `">
	
	</div>`
			);
		}
		output.push(
			`<div class="slide">
             <div class="question"> ${currentQuestion.question} </div>
             <div class="answers"> ${answers.join("")} </div>
           </div>`
		);
	}
	// finally combine our output list into one string of HTML and put it on the page
	quizContainer.innerHTML = output.join("");
}

function showSlide(n) {
	$("#submit").hide();

	switch (n) {
		case 0:
			hideButtons();
			break;
		case 1:
			displayRequirements();
			hideButtons();
			break;
		case 2:
			displayNext();
			break;
		case 3:
			displayList();
			hideButtons();
			break;
		default:
			hideList();
			displayButtons();
			break;
	}
	if (slides[n] == undefined) {
		console.log("Thank you for answering");
		console.log(n);
		readChoices();
		displayModal();
		showSlide(0);
	}
	else {

		slides[currentSlide].classList.remove("active-slide");
		slides[n].classList.add("active-slide");
		currentSlide = n;
	}
}

function showNextSlide() {
	if (processChoice()) {
		showSlide(currentSlide + 1);
	}
	else {
		showSlide(1);
	}


}
function displayButtons() {
	$("#previous").fadeIn();
	$("#next").fadeIn();
}
function displayNext() {
	$("#previous").hide();
	$("#next").fadeIn();
}
function hideButtons() {
	$("#previous").hide();
	$("#next").hide();
}
function showPreviousSlide() {
	showSlide(currentSlide - 1);

}
function displayList() {

	$(".right").fadeIn();
	$(".left").hide();
}
function hideList() {

	$(".right").hide();
}
function displayRequirements() {
	$(".left").fadeIn();
	$(".right").hide();

}
function validateChoices() {
	var checkBoxes = document.getElementsByName("c");

}
function readChoices() {
	var checkBoxes = document.getElementsByName("c");
	const checkedChoices = [];
	for (var i = 0; i < checkBoxes.length; i++) {
		if (checkBoxes[i].checked) {
			checkedChoices.push(checkBoxes[i].value)
		}

	}
	for (var i = 4; i < myQuestions.length; i++) {
		myQuestions[i].choice = checkedChoices[i - 4];
		console.log(myQuestions[i]);
	}
}
function processChoice() {
	var checkBoxes = document.getElementsByName("c");
	if (checkBoxes[1].value == "No" && checkBoxes[1].checked) {
		return false;
	}
	return true;

}

const quizContainer = document.getElementById("quiz");
const resultsContainer = document.getElementById("results");
const submitButton = document.getElementById("submit");
// display right away
buildQuiz(myQuestions);
var validation = document.getElementById("validation");
validation.style.display = "none";

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
var slides = document.querySelectorAll(".slide");
var ans = document.querySelectorAll(".answers");
const list = document.getElementById('list');
// Get the modal
var modal = document.getElementById("Modal1");
console.log(modal);
// Get the <span> element that closes the modal

let currentSlide = 0;

// When the user clicks the button, open the modal 
function displayModal() {

	modal.style.display = "block";

}
function hideModal() {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}


showSlide(2);
// on submit, show results

previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);

function loadMachine(Name) {

	var questionList;
	$.getJSON("Machines.json", function (data) {
		$.each(data, function (index, value) {
			if (value.MachineName == Name) {

				for (var j = 0, len = value.questions.length; j < len; j++) {

					questionTP = value.questions[j];
					var insert = {
						question: questionTP.question,
						choices: [],
						choice: "c"
					}
					for (var k = 0, len2 = questionTP.choices.length; k < len2; k++) {
						insert.choices.push(questionTP.choices[k]);
					}
					myQuestions.push(insert);
				}

			}

		});
		buildQuiz(myQuestions);
		slides = document.querySelectorAll(".slide");
		console.log("End of P" + slides.length);
		showSlide(4);

	});

}
$(document).ready(function () {
	var items;

	$("ol").html("");
	list.style.display = "none";
	$.getJSON("external.json", function (data) {
		$.each(data, function (index, value) {
			items = data;

			if (index < 11) {
				var but = $("<button></button>").text(value.Equipment_Template);
				var txt = $("<li></li>").text(but);

				$("ol").append(but);
			}
			else if (index == 11) {
				$("ol").append("...");
			}
		});
	});

	$(".right").hide();
	$(".left").hide();
	$(".machine").click(function (e) {
		var MachineName = $(e.target).text();
		console.log(MachineName);
		loadMachine(MachineName);


	});
});
function validate(nameText, mailText, phoneText) {
	console.log("nameText: " + nameText)
	console.log("mailText: " + mailText)
	console.log("phoneText: " + phoneText)
	if (nameText == "" || mailText == "" || phoneText == "") {
		return false;
	}
	return true;
}
function saveDetails() {

	var contactForm = document.getElementById("contactForm");
	var nameText = document.getElementById("nameText").value;
	var mailText = document.getElementById("mailText").value;
	var phoneText = document.getElementById("phoneText").value;

	if (validate(nameText, mailText, phoneText)) {
		var data = {
			UserName: nameText,
			EMail: mailText,
			Phone: phoneText
		}
		contactForm.style.display = "none";
		validation.style.display = "none";
		summarize();
	}
	else {
		console.log("Please enter thing");		
		validation.style.display = "block";
	}
}

function summarize() {
	var summary = document.getElementById("summary");
	summaryString = `
				<label>Does this seem right?</label>
				<ul>
				`
	for (var j = 4, len = myQuestions.length; j < len; j++) {
		var ch;
		if (myQuestions[j].choice == undefined) {
			ch = "No Preference";
		}
		else {
			ch = myQuestions[j].choice;
		}
		summaryString += `<li>` + myQuestions[j].question + " : " + ch + `</li>`;

	}
	summaryString += `</ul>`
	summaryString += `<button onclick="hideModal()">Submit</button><br>`
	summaryString += `<button onclick="location.reload();">Restart</button>`
	summary.innerHTML = summaryString;

}




