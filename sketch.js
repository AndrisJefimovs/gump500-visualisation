// noprotect

const config = {
  lineWidth: 1,
  bgColor: 'snow',
  lines: 'black',
};

const url = 'https://demo3884564.mockable.io/gump500';

let data = [],
  bars = [],
  loading = true,
  loaderAngle = 0,
  q;

const oneDay = 24 * 60 * 60 * 1000;

function setup() {
  background(255);
  colorMode(HSB);
  loadJSON(url, gotData);
  createCanvas(windowWidth, windowHeight);
}

function gotData(data_) {
  data = data_;
  loading = false;
  background(255);
  q = (windowHeight - 50) / getMaxTotal();
  createBars();
  drawBars();
  if (isDaily(data[i])) {
    let div = createDiv(
      '<svg title="Active every day" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="forestgreen" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>'
    );
    div.addClass('badge');
    div.style('width', width / bars.length + 'px');
    div.style('left', (i * width) / bars.length + 'px');
    div.style('top', windowHeight - bars[i].total * q + 'px');
    div.attribute('title', 'Active everyday');
  }
}

function draw() {
  if (!loading) {
    background(255);
    drawBars();
    let currentRunner = Math.floor(mouseX / (windowWidth / data.length));
    if (mouseY > windowHeight / 2) {
      cursor('crosshair');
      drawLegend(data[currentRunner]);
    } else {
      cursor('default');
    }
  } else {
    background(255);
    textSize(25);
    textAlign(CENTER);
    text('Loading...', width / 2, height * 0.7);
  }
}

function createBars() {
  stroke(126);
  for (let i = 0; i < data.length; i++) {
    let bar = {
      name: data[i].name,
      total: data[i].total,
      color: 'red',
      history: data[i].history,
      hitGoal: data[i].total >= 20 ? true : false,
      dailyRunner: false,
    };
    let avg;
    if (bar.history.length > 1) {
      avg = getAvgDays(bar.history);
    } else {
      avg = bar.history.length;
    }
    bar.color = map(avg, getMaxAvg(), 1, 0, 120);
    bars.push(bar);
  }
}

function drawBars() {
  rotate(-loaderAngle);
  strokeWeight(config.lineWidth);
  for (let i = 0; i < bars.length; i++) {
    strokeWeight(config.lineWidth);
    stroke(config.lines);
    fill(config.bgColor);
    rect((i * width) / bars.length, 0, width / bars.length, height);
    fill(bars[i].color, 255, 255);
    rect((i * width) / bars.length, height, width / bars.length, -bars[i].total * q);
  }
  textSize(16);
  noStroke();
  fill('tomato');
  textAlign(LEFT);
  text('500 mi', 5, windowHeight - 500 * q - 20);
  stroke('tomato');
  line(0, windowHeight - 500 * q, width, windowHeight - 500 * q);
}

function getAvgDays(arr) {
  let sum = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    sum += Date.parse(arr[i + 1].created_at) - Date.parse(arr[i].created_at);
  }
  let avg = sum / (arr.length - 1) / oneDay;
  return avg;
}

function getMaxAvg() {
  let max = -1;
  data.forEach((runner) => {
    if (getAvgDays(runner.history) > max) {
      max = getAvgDays(runner.history);
    }
  });
  return max;
}

function getMaxTotal() {
  let max = -1;
  data.forEach((runner) => {
    if (runner.total > max) {
      max = runner.total;
    }
  });
  return max > 500 ? max : 500;
}

function windowResized() {
  loaderAngle = 0;
  resizeCanvas(windowWidth, windowHeight);
  background(255);
  q = (windowHeight - 50) / getMaxTotal();
  drawBars();
}

function drawLegend(runner) {
  let counter = runner.history.length >= 5 ? 5 : runner.history.length;
  fill('rgba(0,0,0,.9)');
  noStroke();
  rect(mouseX < windowWidth / 2 ? mouseX + 300 : mouseX, mouseY - 230, -300, 215, 15);
  fill(255);
  textSize(22);
  textAlign(LEFT, TOP);
  text(isDaily(runner) ? runner.name + ' (daily active)' : runner.name, mouseX < windowWidth / 2 ? mouseX + 20 : mouseX - 280, mouseY - 210);
  textSize(16);
  text('5 last runs:', mouseX < windowWidth / 2 ? mouseX + 20 : mouseX - 280, mouseY - 180);
  for (let i = 0; i < counter; i++) {
    date = new Date(Date.parse(runner.history[runner.history.length - 1 - i].created_at));
    text(parseFloat(runner.history[runner.history.length - 1 - i].miles).toFixed(1) + 'mi', mouseX > windowWidth / 2 ? mouseX - 280 : mouseX + 20, mouseY - 155 + 20 * i);
    text(('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear(), mouseX < windowWidth / 2 ? mouseX + 80 : mouseX - 220, mouseY - 155 + 20 * i);
  }
  text('Total:', mouseX < windowWidth / 2 ? mouseX + 20 : mouseX - 280, mouseY - 50);
  text(getDistanceSum(runner) + 'mi', mouseX > windowWidth / 2 ? mouseX - 220 : mouseX + 80, mouseY - 50);
}

function getDistanceSum(runner) {
  let sum = 0;
  runner.history.forEach((run) => {
    sum += run.miles;
  });
  return parseFloat(sum).toFixed(1);
}

function isDaily(runner) {
  if (runner.history.length >= 3) {
    let runs = runner.history,
      lastRun = Date.parse(runs[runs.length - 1].created_at),
      lastMidnight = roundDate(lastRun).getDate();
    if (roundDate(Date.parse(runs[runs.length - 2].created_at)).getDate() < lastMidnight - 1) return false;
    if (roundDate(Date.parse(runs[runs.length - 3].created_at)).getDate() < lastMidnight - 2 || roundDate(Date.parse(runs[runs.length - 2].created_at)).getDate() > lastMidnight - 1) return false;
    return true;
  }
}

function roundDate(timeStamp) {
  timeStamp -= timeStamp % (24 * 60 * 60 * 1000);
  return new Date(timeStamp);
}
