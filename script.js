
// Declare a couple of global variables.
var objScheduleEntries = {};
var strStorageKey;


// Render the scheduler for the current day.
function renderScheduler() {


	// Show the current day in the header.
	$("#currentDay").text(moment().format("dddd, Do MMMM, YYYY"));


	// Create a variable to use as the key for the current day's entry in localstorage.
	strDate = moment().format("YYYYMMDD");
	strStorageKey = `${strDate}scheduleEntries`


	// Call the function to colour in the time blocks.
	colorTimeBlocks();


	// Call the retrieveEntries function to get any saved items from storage. If objScheduleEntries is not empty
	// call the populateTimeBlocks function to add the existing entries to the schedule.
	retrieveEntries();

	if (Object.keys(objScheduleEntries).length > 0) {
		populateTimeBlocks();
	}


	// Start the hourly timer so the colours will change next hour.
	startHourlyTimer();


}


// Function to colour the time blocks according to whether they are past, present or future.
function colorTimeBlocks() {


	// Get the current hour
	let currentHour = moment().hour();


	// Loop through each row and add colours according to current hour.
	$(".event-text").each(function () {

		// Get the id attribute of the time block.
		let blockHour = parseInt($(this).parent().attr("id"));

		// Compare to the current hour and then colour accordingly by updating classes.
		if (blockHour < currentHour) {
			$(this).removeClass("present future").addClass("past");
		}
		else if (blockHour > currentHour) {
			$(this).removeClass("present past").addClass("future");
		}
		else {
			$(this).removeClass("past future").addClass("present")
		}

	});


}


// Function to retrieve any stored items from localstorage and put them into objScheduleEntries.
function retrieveEntries() {


	// Try getting the YYYYMMDDscheduleEntries item from storage.
	let strStoredItems = localStorage.getItem(strStorageKey);


	// If it exists, parse it and store in the objScheduleEntries object.
	if (strStoredItems !== null) {

		objScheduleEntries = JSON.parse(strStoredItems);

	}


}


// Function to populate the time blocks with entries from localstorage.
function populateTimeBlocks() {


	// Loop through all the entries in objScheduleEntries.
	for (const hour in objScheduleEntries) {

		// Get the textarea of the timeblock and add the text from the object.
		$("#" + hour + " > textarea").val(objScheduleEntries[hour]);

	}


}


// This function sets a timeout to re-colour the time blocks at the beginning of the next hour.
function startHourlyTimer() {


	// First find out how many seconds until the start of the next hour.
	let intStartOfNextHour = moment().add(1, "hour").startOf("hour");
	let intMSRemaining = intStartOfNextHour.diff(moment());


	// Start a timeout interval to go off after intMSRemaining.
	hourTimer = setTimeout(() => {

		// After the timeout, recolour the blocks. If it's before 6 pm, start the timer again.
		colorTimeBlocks();

		if (moment().hour() < 18) {
			startHourlyTimer();
		}

	}, intMSRemaining);


}


// Save the text from the corresponding time block into objScheduleEntries when the save button is clicked.
function saveTimeBlock(hour) {


	// Get the text from the time block.
	let timeBlockText = $("#" + hour + " textarea").val();


	// If the text is an empty string, we need to check objScheduleEntries to see if there is an entry for
	// that hour and if so, delete it. Otherwise, write the value to the object.

	if (timeBlockText === "") {

		if (objScheduleEntries.hasOwnProperty(hour)) {
			delete objScheduleEntries[hour];
		}

	}
	else {

		// Write the new value back to the objScheduleEntries object
		objScheduleEntries[hour] = timeBlockText;

	}


	// Call the saveSchedule function to write everything to localstorage.
	saveSchedule();


}


// Stringify and save the objScheduleEntries object to localstorage.
function saveSchedule() {

	let strScheduleEntries = JSON.stringify(objScheduleEntries);
	localStorage.setItem(strStorageKey, strScheduleEntries);

}


// When the page is first loaded, render the scheduler on the screen.
renderScheduler();


// Listener for the save buttons.
$(".row").on("click", ".saveBtn", function() {


	// Get the id from the button's parent row and use it to represent the hour.
	let blockHour = $(this).parent().attr("id");


	// Call the saveTimeBlock function to save the text to an object.
	saveTimeBlock(blockHour);


});
