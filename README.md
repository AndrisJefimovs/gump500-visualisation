# GUMP500 Column Chart Visualisation
I accepted the challenge from [@CodingTrain](https://github.com/CodingTrain). I created a visualisation for the stats of runners using the [twitter bot for logging progress of running 500 miles challenge](https://twitter.com/CodingTrainBot).

**This is my first p5js project.**

### This visualisation shows:
- [GUMP500 Column Chart Visualisation](#gump500-column-chart-visualisation)
		- [This visualisation shows:](#this-visualisation-shows)
	- [Total distance](#total-distance)
	- [Runner name](#runner-name)
	- [Running manner](#running-manner)
	- [Activity frequency](#activity-frequency)
	- [Last 5 runs](#last-5-runs)

## Total distance
The total distance is being received from the API and shown using the height of the bar. By hovering over it, you can exactly see the distance in miles.

## Runner name
The username of people using the twitter bot are shown from the API. You can see them by hovering over the respective bar.

## Running manner
If the user is running often, the bar will be green. If you are running a lot, but not regularly the bar will be orange or even red.

## Activity frequency
If you use the bot everyday for three days you will get a calendar badge, which will show everyone your activity. Yeey!
## Last 5 runs
You can see the distance and the date of the last five runs. They are available by hovering over the bar.

	**Hovering on computer is available on mobile devices by tapping on the bar.**

The API used in this project is available [here](https://gump500-api.glitch.me/api)
