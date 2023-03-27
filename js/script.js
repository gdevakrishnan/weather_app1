// DATE & TIME
let dateFunction = () => {
  let dateResult = document.querySelector(".date");
  let timeResult = document.querySelector(".time");
  let dateData = new Date();
  let h = dateData.getHours();
  let m = dateData.getMinutes()
  let session = 'am'

  if (h > 12) {
    h -= 12;
    session = 'pm'
  }

  // variable = condition ? true : false
  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;

  let time = `${h}:${m} ${session}`;

  dateResult.innerHTML = dateData.toDateString();
  timeResult.innerHTML = time;

  setInterval(dateFunction, 1000);
};
dateFunction();

// #############################
// WEATHER

// Weather Response

//  https://api.openweathermap.org/data/2.5/weather?q={city}&appid=${API_key}&units=metric

let API_key = "(YOUR API KEY)";

async function weather_response(city) {
  let weather_data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
  );
  let response = weather_data.json();
  return response;
}

// ##############################

// Get City Name
let city_name = document.querySelector("#city_input");

// Controls
let submit_btn = document.querySelector(".submit");
let clear_btn = document.querySelector(".clear");

// Results
let cityResult = document.querySelector(".city");
let tempResult = document.querySelector(".temp");
let countryResult = document.querySelector(".country");
let mainResult = document.querySelector(".main");
let descResult = document.querySelector(".desc");
let windResult = document.querySelector(".wind");
let none_data = document.querySelector(".none_data");

// Result Display
let displayResults = (city, temp, country, main, desc, wind) => {
  cityResult.innerHTML = "<span>City: </span>" + city;
  tempResult.innerHTML = "<span>Temp: </span>" + temp + " Celsius";
  countryResult.innerHTML = "<span>Country: </span>" + country;
  mainResult.innerHTML = "<span>Weather: </span>" + main;
  descResult.innerHTML = "<span>Desc: </span>" + desc;
  windResult.innerHTML = "<span>Wind Speed: </span>" + wind + " km/hr";

  // store in localstorage
  localStorage.setItem(city, String(temp) + 'deg Celsius ~ ' + String(main));
};

// Clear Fields
let clearFields = () => {
  tempResult.innerHTML = "";
  cityResult.innerHTML = "";
  mainResult.innerHTML = "";
  descResult.innerHTML = "";
  countryResult.innerHTML = "";
  windResult.innerHTML = "";
};

// Result Data Passing
let getData = () => {
  // Check the input field
  if (city_name.value == "") {
    none_data.innerHTML = "please enter the city name";
  } else {
    // pass city name to weather response to get data
    weather_response(city_name.value)
      .then((response) => {
        if (response.message == "city not found") {
          clearFields();
          none_data.innerHTML = "city not found";
        } else {
          none_data.innerHTML = "";
          displayResults(
            response.name,
            response.main.temp,
            response.sys.country,
            response.weather[0].main,
            response.weather[0].description,
            response.wind.speed
          );
        }
      })
      .catch((err) => console.log(err));
  }
};

// Check key event
city_name.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    if (city_name.value == "") {
      clearFields();
      none_data.innerHTML = "please enter the city name";
    } else {
      getData();
    }
  }
});

// Submit Event
submit_btn.addEventListener("click", getData);

// Clear Event
clear_btn.addEventListener("click", () => {
  city_name.value = "";
  clearFields();
  none_data.innerHTML = "please enter the city name";
});

// ############################
// HISTORY
let history_btn = document.querySelector('.history')
let history_container = document.querySelector('.history_container');
let history_refresh = document.querySelector('.history_refresh');
let history_clear = document.querySelector('.history_clear');
let history_controls = document.querySelector(".history_controls")
let flag1 = 1;
let flag2 = 1;

let adeleteHIstory = (target) => {
  let deleteCity = target.value;
  localStorage.removeItem(deleteCity);
  history_container.innerHTML = "";
  flag2 = 1;
  flag1 = 1
  history();
}

let historyDisplay = (city) => {
  let historyTemplate = `<div class = "${city} ahistory"><div class="history_group"><h4 class='city'>${city}</h4><h5 class="desc">${localStorage[city]}</h5></div><button value='${city}' onclick = 'adeleteHIstory(this)' class='ahistory_close' title='delete'><i class='    fa fa-trash'></i></button></div>`;

  history_container.innerHTML += historyTemplate;
}

function history() {
  if (flag2 == 1) {
    if (Object.keys(localStorage).length > 0) {
      if (flag1 === 1) {
        history_controls.style.display = "flex"
        history_container.style.display = "flex";
        flag1 = 0;
        let historyArray = Object.keys(localStorage);

        for (let acity of historyArray) {
          historyDisplay(acity);
        }
      } else {
        history_controls.style.display = "none"
        history_container.style.display = "none";
        flag1 = 1;
        flag2 = 1;
      }
    } else {
      clearFields();
      none_data.innerHTML='history none';
      history_controls.style.display = "none";
      history_container.style.display = "none";
      flag2 = 1;
      flag1 = 1;
    }
    flag2 = 0;
    flag1 = 0;
  } else {
    history_container.innerHTML = "";
    history_container.style.display = "none";
    history_controls.style.display = "none";
    flag1 = 1;
    flag2 = 1;
  }
}

history_btn.addEventListener('click', history);
history_refresh.addEventListener('click', history);
history_clear.addEventListener('click', () => {
  localStorage.clear();
  history_container.innerHTML = "";
  history_container.style.display = "none";
  history_controls.style.display = "none"
  flag1 = 1;
  flag2 = 1;
});
