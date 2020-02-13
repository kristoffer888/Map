cSelect = [];
cPopulation = [];
cArea = [];
cBNP = [];
cQl = [];
var sSum = false, sAve = false;

function sumTrue() {
  sSum = true
  sAve = false;
  return sSum, sAve;
}

function aveTrue() {
  sAve = true
  sSum = false;
  return sAve, sSum;
}

function none(x) {
  if (x == undefined|| x.length == 0) {
    document.getElementById("CS").innerHTML = "None";
    document.getElementById("CP").innerHTML = "None";
    document.getElementById("CA").innerHTML = "None";
    document.getElementById("CB").innerHTML = "None";
    document.getElementById("CQ").innerHTML = "None";
    x = "None"
  }
  return x;
}

function changeGL(x) {
  var GL = document.getElementById("UL").value;
  document.getElementById("demo").innerHTML = "Saved: " + GL;
  var request = new XMLHttpRequest();
  request.open("GET", GL, false);
  request.send(null);
  var csvData = new Array();
  var jsonObject = request.responseText.split(/\r?\n|\r/);
  for (var i = 0; i < jsonObject.length; i++) {
    csvData.push(jsonObject[i].split(','));
  }
  var el = csvData.find(a => a.includes(x));
  var fine = el[2]
  return parseInt(fine);
}

//ms https://raw.githubusercontent.com/kristoffer888/csv/master/Military%20expenditure.csv
// gdp https://raw.githubusercontent.com/kristoffer888/csv/master/dfb44c89-84a5-4a55-b0b3-3413ac22643d_Data.csv

function getBNP(x) {
  var url = "https://raw.githubusercontent.com/kristoffer888/csv/master/dfb44c89-84a5-4a55-b0b3-3413ac22643d_Data.csv";
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  var csvData = new Array();
  var jsonObject = request.responseText.split(/\r?\n|\r/);
  for (var i = 0; i < jsonObject.length; i++) {
    csvData.push(jsonObject[i].split(','));
  }
  var el = csvData.find(a => a.includes(x));
  var fin = (el[2].split('.')[0])
  return parseInt(fin);
}

function ave(x) {
  const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length;
  return average(x);
}

function sum(x) {
  var xSum = x.reduce((a, b) => a + b, 0)
  return xSum;
}

document.getElementById("1").onclick = function clear() {
  document.getElementById("CS").innerHTML = "";
  document.getElementById("CP").innerHTML = "";
  document.getElementById("CA").innerHTML = "";
  document.getElementById("CB").innerHTML = "";
  document.getElementById("CQ").innerHTML = "";
  cBNP = [];
  cSelect = [];
  cPopulation = [];
  cArea = [];
  cQl = []
}


function remove(x) {
  var newArr = x;
  var h, i, j;

  for (h = 0; h < x.length; h++) {
    var curItem = x[h];
    var foundCount = 0;
    for (i = 0; i < x.length; i++) {
      if (x[i] == x[h])
        foundCount++;
    }
    if (foundCount > 1) {
      for (j = 0; j < newArr.length; j++) {
        if (newArr[j] == curItem) {
          newArr.splice(j, 1);
          j--;
        }
      }
    }
  }
}

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

mapboxgl.accessToken = 'pk.eyJ1Ijoia3Jpc3RvZmZlcjg4OCIsImEiOiJjazJ4M2k0bHIwN3liM2d0YWlrZGVra3F6In0.rlprSh5-0w47AXtKB9CKDA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  minZoom: 2
});

map.on('load', function () {
  map.addLayer({
    'id': 'countries',
    'source': {
      'type': 'vector',
      'url': 'mapbox://byfrost-articles.74qv0xp0'
    },
    'source-layer': 'ne_10m_admin_0_countries-76t9ly',
    'type': 'fill',
    'paint': {
      'fill-color': 'rgba(126, 200, 80, 0)'
    }
  });

  if (cSelect.length <= 0) {
    document.getElementById("1").disabled = true;
  }

  map.on('click', 'countries', function (mapElement) {
    const countryCode = mapElement.features[0].properties.ADM0_A3_IS; // Grab the country code from the map properties.
    fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`) // Using tempalate tags to create the API request
      .then((data) => data.json()) //fetch returns an object with a .json() method, which returns a promise
      .then((country) => { //country contains the data from the API reques

        cBNP.push(getBNP(countryCode))
        remove(cBNP)
        cArea.push(country.area)
        remove(cArea)
        cPopulation.push(country.population);
        remove(cPopulation)
        cSelect.push(" " + country.name)
        remove(cSelect)

        if (checkSwitch == true) {
          cQl.push(changeGL(countryCode))
          remove(cQl)

          if (sSum == true) {
            document.getElementById("CQ").innerHTML = sum(cQl).toLocaleString();
          } else if (sAve == true) {
            document.getElementById("CQ").innerHTML = ave(cQl).toLocaleString();
          } else {
            document.getElementById("CQ").innerHTML = cQl.toLocaleString();
          }
        }

        if (cSelect.length > 0) {
          document.getElementById("1").disabled = false;
        } else {
          document.getElementById("1").disabled = true;
        }

        document.getElementById("CB").innerHTML = ave(cBNP).toLocaleString() + " USD";
        document.getElementById("CS").innerHTML = cSelect;
        document.getElementById("CP").innerHTML = sum(cPopulation).toLocaleString();
        document.getElementById("CA").innerHTML = sum(cArea).toLocaleString() + " km^2";
        none(cBNP);
        none(cArea);
        none(cPopulation);
        none(cSelect);
      });
  });
});