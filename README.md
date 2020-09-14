# TS-05-Work-Day-Scheduler
### A simple calendar app for scheduling your work day

<div align="center">
	<img src="https://user-images.githubusercontent.com/69242373/93039050-dd2eb680-f689-11ea-86a0-07a9858d003c.png">
</div>

View the application here: <https://timsilby.github.io/TS-05-Work-Day-Scheduler/>

## Usage
Work Day Scheduler displays a list of one hour time blocks for each day. It covers business hours (9 am to 5 pm). Clicking the chevrons to either side of the date will change the day currently being displayed.

Each time block is coloured according to whether the hour is in the past, present or future. The colour is updated dynamically at the beginning of each hour.

Text can be entered in each time block and then saved by clicking the save button to the right of the block.

When a user saves a time block it is written to localstorage so the data will persist across browser sessions.

## Development
This application was written in JavaScript and uses the jQuery library. It was styled with Bootstrap and custom CSS.

---

#### Author

Tim Silby (tim.silby@gmail.com)
