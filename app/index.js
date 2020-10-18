import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { me as appbit } from "appbit";
import { today } from "user-activity";
//import { goals } from "user-activity";
import { battery } from "power";

const hrmData = document.getElementById("hrm-data");
const steps_text = document.getElementById("steps_text");
const cal_text = document.getElementById("cal_text");
const battery_text = document.getElementById("battery_text");

const glitch = document.getElementById("glitch");

const time = document.getElementById("time");
const batt = document.getElementById("batt");

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

//display animation 


display.addEventListener("change", function() {
  if (display.on) {
    wake();
    sensors.map(sensor => sensor.start());
    
  } else {
    sleep();
    sensors.map(sensor => sensor.stop());
  }
})

function sleeper(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function wake() {
  
  glitch.href = "cryp2.png";
  sleeper(40).then(() => {
    glitch.href = "cryp5.png"; 
    sleeper(40).then(() => { 
      glitch.href = "cryp2.png"; 
      sleeper(40).then(() => { 
        glitch.href = "cryp4.png"; 
        sleeper(40).then(() => { 
          glitch.href = "cryp2.png";
          sleeper(40).then(() => { 
            glitch.href = "cryp3.png"; 
            sleeper(40).then(() => { 
              glitch.href = "cryp2.png"; 
              sleeper(40).then(() => { 
                glitch.href = "cryp1.png"; 
                sleeper(40).then(() => { glitch.href = "last.png";  });
              });
            });
          });
        });
      });
    });
  });
}

function sleep() {
  // do something when the screen sleeps
}


//info stats

const sensors = [];

//heart rate
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = (hrm.heartRate ? hrm.heartRate : 0)
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmData.style.display = "none";
}
//steps
if (appbit.permissions.granted("access_activity")) {
  steps_text.text = formatNumber(today.adjusted.steps);
  cal_text.text = today.adjusted.calories;
} else {
  steps_text.style.display = "none";
}



//date

const myMonth = document.getElementById("myMonth");


var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";  
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";

var dayofweek = new Array();
  dayofweek[0] = "Sun";
  dayofweek[1] = "Mon";
  dayofweek[2] = "Tues";
  dayofweek[3] = "Wed";
  dayofweek[4] = "Thur";
  dayofweek[5] = "Fri";
  dayofweek[6] = "Sat";

//clock


// Update the clock every minute
clock.granularity = "minutes";

// Get a handle on the <text> element



// Update the <text> element every tick with the current time
clock.ontick = (evt) => {
  let today = evt.date;
  let hours = today.getHours();
  //date
  
  var monthnum = today.getMonth();
  var daynum = today.getDate();
  var day = dayofweek[today.getDay()];
  var monthname = month[monthnum];

 
battery_text.text = Math.floor(battery.chargeLevel) + "%";
batt.groupTransform.rotate.angle = 90;
myMonth.text = day + " " + monthname + " " + daynum;

  
  
  //actual clock
  if (preferences.clockDisplay === "12h") {
    // 12h format
    hours = hours % 12 || 12;
  } else {
    // 24h format
    hours = util.zeroPad(hours);
  }
  let mins = util.zeroPad(today.getMinutes());
  time.text = `${hours}:${mins}`;
}