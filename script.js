
// Declare a few of global variables.
var objScheduleEntries = {};
var strStorageKey;
var dtmCurrent = moment();
var strSlide = "slide1";


// Render the scheduler for the current day.
function renderScheduler() {


	// Show the current day in the header.
	$("#current-date").text(dtmCurrent.format("dddd, Do MMMM, YYYY"));


	// Create a variable to use as the key for the displayed day's entry in localstorage.
	strDate = dtmCurrent.format("YYYYMMDD");
	strStorageKey = `${strDate}scheduleEntries`


	// Reset the objScheduleEntries object and write empty strings to the time blocks to clear
	// any existing entries.
	objScheduleEntries = {};
	$("#" + strSlide + " .event-text").val("");


	// Call the colorTimeBlocks function to colour in the time blocks.
	colorTimeBlocks();


	// Call the retrieveEntries function to get any saved items from storage.
	retrieveEntries();


	// If objScheduleEntries is not empty, call the populateTimeBlocks function to add the
	// existing entries to the schedule.
	if (Object.keys(objScheduleEntries).length > 0) {
		populateTimeBlocks();
	}


	// Start the hourly timer so the colours will change next hour.
	startHourlyTimer();


}


// Function to colour the time blocks according to whether they are past, present or future.
function colorTimeBlocks() {


	// Get the time at the start of the current hour.
	let dtmCurrentHour = moment().startOf("hour");


	// Loop through each row and add colours according to current hour.
	$("#" + strSlide + " .event-text").each(function () {


		// Get the data-hour attribute of the time block.
		let blockID = parseInt($(this).parent().attr("data-hour"));


		// Use blockID to find the date/time at the start of the hour for the displayed day.
		let blockDateTime = dtmCurrent.hour(blockID);
		let dtmBlockHour = blockDateTime.startOf("hour");


		// Compare to the current hour and then colour accordingly by updating classes.
		if (dtmBlockHour < dtmCurrentHour) {
			$(this).removeClass("present future").addClass("past");
		}
		else if (dtmBlockHour > dtmCurrentHour) {
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
		$("#" + strSlide + " > div[data-hour='" + hour + "'] > .event-text").val(objScheduleEntries[hour]);

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
	let timeBlockText = $("[data-hour='" + hour + "'] > textarea").val();


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


	// First check to see if there is anything in the object. If so, save it.
	// If not, remove entry from storage if it exists.
	if (Object.keys(objScheduleEntries).length > 0) {

		let strScheduleEntries = JSON.stringify(objScheduleEntries);
		localStorage.setItem(strStorageKey, strScheduleEntries);

	}
	else {

		if (localStorage.getItem(strStorageKey) !== null) {
			localStorage.removeItem(strStorageKey);
		}

	}


}


// When the page is first loaded, render the scheduler on the screen.
renderScheduler();


// Listener for the save buttons.
$(".row").on("click", ".saveBtn", function() {


	// Get the id from the button's parent row and use it to represent the hour.
	let blockHour = $(this).parent().attr("data-hour");


	// Call the saveTimeBlock function to save the text to an object.
	saveTimeBlock(blockHour);


});


// Listener for previous day button.
$("#prev-day-btn").on("click", function() {


	// Set the current day to one day less.
	dtmCurrent = dtmCurrent.subtract(1, "day");

	// Render the slide currently not showing with the previous day's stuff by setting
	// the strSlide variable and calling renderScheduler.
	if (strSlide === "slide1") {
		strSlide = "slide2";
	}
	else {
		strSlide = "slide1";
	}

	// Re-render the schedule.
	renderScheduler();

	// Move to the other slide on the carousel.
	$(".carousel").carousel("prev");


});


// Listener for next day button.
$("#next-day-btn").on("click", function() {


	// Set the current day to one day more.
	dtmCurrent = dtmCurrent.add(1, "day");

	// Render the slide currently not showing with the next day's stuff by setting
	// the strSlide variable and calling renderScheduler.
	if (strSlide === "slide1") {
		strSlide = "slide2";
	}
	else {
		strSlide = "slide1";
	}

	// Re-render the schedule.
	renderScheduler();


	// Move to the other slide on the carousel.
	$(".carousel").carousel("next");


});


// Listener for the carousel. When the slide stops transitioning this will pause the carousel
// cycling. Needed because the carousel sometimes ignores the data-ride=false attribute.
$(".carousel").on("slid.bs.carousel", function() {

	$(".carousel").carousel("pause");

});