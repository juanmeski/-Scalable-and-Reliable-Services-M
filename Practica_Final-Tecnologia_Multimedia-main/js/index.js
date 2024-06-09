//to choose the museum in question
var id = parent.document.URL.substring(parent.document.URL.indexOf('?'), parent.document.URL.length);
id = id.replace("?", "");
id = id.replace("#", "");

//Variables
var museos;
var locationError = true;

//Maximum number of museums in the grid container
const MAX_MUSEUMS_GRID_CONTAINER = 4;
const MAX_MUSEUMS_SLIDER = 3;

var userLat, userLng; //Client coordinates
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

const xhttp = new XMLHttpRequest();
xhttp.open('GET', '/json/museos.json', true)
xhttp.send();
xhttp.onreadystatechange = function () {

  if (this.readyState == 4 && this.status == 200) {

    museos = JSON.parse(this.responseText);
    navigator.geolocation.getCurrentPosition(success, error, options);
    addPageContent();
  }
}

function addPageContent() {

  if (!locationError) {//We check if there has been an error
    addClosermuseums();
    addMap();
  } else {
    //We add random museums
    let randoms = getRandomNumbersList();
    for (let i = 0; i < MAX_MUSEUMS_GRID_CONTAINER; i++) {
      document.getElementById("titulo_galeria_index" + i.toString()).innerHTML = museos.Museum[randoms[i]].name;
      document.getElementById("foto_galeria_index" + i.toString()).src = museos.Museum[randoms[i]].image;
      document.getElementById("titulo_galeria_index" + i.toString()).href = "museo.html?" + randoms[i].toString();
    }
    //We create an array with the museums for the slider
    let otherMuseums = [];
    for (let i = MAX_MUSEUMS_GRID_CONTAINER; i < MAX_MUSEUMS_GRID_CONTAINER + MAX_MUSEUMS_SLIDER; i++) {
      otherMuseums[i - MAX_MUSEUMS_GRID_CONTAINER] = museos.Museum[randoms[i]];
    }
    addOtherMuseums(otherMuseums);
  }
}

//Function to add museums to the carousel
function addOtherMuseums(arr) {
  for (let i = 0; i < MAX_MUSEUMS_SLIDER; i++) {
    //We add a part of the description (275 characters)
    let description = arr[i]["description"].substring(0, 275);
    description += "...";
    //We insert the elements
    document.getElementById("slide_title_" + i.toString()).innerHTML = arr[i].name;
    document.getElementById("slide_img_" + i.toString()).src = arr[i].image;
    document.getElementById("slide_desc_" + i.toString()).innerHTML = description;
  }
}

//Function to generate a list of random numbers without repeating any
function getRandomNumbersList() {
  let randArray = [];
  for (let i = 0; i < museos.Museum.length; i++) {
    let rand = getRandom(museos.Museum.length);
    while (contains(randArray, rand)) {
      rand = getRandom(museos.Museum.length);
    }
    randArray[i] = rand;
  }
  return randArray;
}

//Function that checks if an element is in a list
function contains(arr, number) {
  for (let i = 0; i < arr.length; i++) {
    if (number == arr[i]) {
      return true;
    }
  }
  return false;
}

//Function that returns a random between 0 and max - 1
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function success(pos) {
  var crd = pos.coords;
  userLat = crd.latitude;
  userLng = crd.longitude;
  locationError = false;
  //We add the content of the page
  addPageContent();
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

//Function to show the nearest museums
function addClosermuseums() {
  var distancias = [];
  var distanciasAux = [];

  //All distances between museums and current location are calculated
  for (var i = 0; i < museos.Museum.length; i++) {
    var km = getDistanceFromLatLonInKm(userLat, userLng, museos.Museum[i]["geo"]["latitude"], museos.Museum[i]["geo"]["longitude"])
    distancias[i] = km;
    distanciasAux[i] = km;
  }
  //we order distances
  distancias.sort((a, b) => a - b);

  for (var i = 0; i < MAX_MUSEUMS_GRID_CONTAINER; i++) {
    for (var j = 0; j < distancias.length; j++) {
      if (distancias[i] == distanciasAux[j]) {
        document.getElementById("titulo_galeria_index" + i.toString()).innerHTML = museos.Museum[j]["name"];
        document.getElementById("foto_galeria_index" + i.toString()).src = museos.Museum[j]["image"];
        document.getElementById("titulo_galeria_index" + i.toString()).href = "museo.html?" + j.toString();
      }
    }
  }
  //We create the array of museums for the photo slide
  let otherMuseums = [];
  for (let i = MAX_MUSEUMS_GRID_CONTAINER; i < MAX_MUSEUMS_GRID_CONTAINER + MAX_MUSEUMS_SLIDER; i++) {
    for (let j = 0; j < distancias.length; j++) {
      if (distancias[i] == distanciasAux[j]) {
        otherMuseums[i - MAX_MUSEUMS_GRID_CONTAINER] = museos.Museum[j];
      }
    }
  }
  //We add the museums to the photo slide
  addOtherMuseums(otherMuseums);
}

//Google maps API to show the position of museums
function addMap() {
  document.getElementById("map_title").innerHTML = "locate our museums";
  var coord = [];
  for (var i = 0; i < museos.Museum.length; i++) {
    //We get all the coordinates
    coord[i] = { lat: Number(museos.Museum[i]["geo"]["latitude"]), lng: Number(museos.Museum[i]["geo"]["longitude"]) };
  }

  //We create the map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: { lat: Number(userLat), lng: Number(userLng) }
  });

  //We add museum markers
  var marker = [];
  for (var i = 0; i < museos.Museum.length; i++) {
    marker[i] = new google.maps.Marker({
      position: coord[i],
      map: map,
      title: museos.Museum[i]["name"]
    });
    let selected = museos.Museum[i]["name"];
    //Clicking on a museum's bookmark displays its website
    marker[i].addListener("click", () => {
      var pos;
      for (pos = 0; pos < museos.Museum.length; pos++) {
        if (equals(museos.Museum[pos]["name"], selected)) {
          break;
        }
      }
      if (pos == museos.Museum.length) { //Error
        alert("Write valid museum name")
      } else {
        //We load the page of the selected museum
        let url = `/html/museo.html?${pos}`;
        window.location.assign(url);
      }
    });
  }
  //We add the user's bookmark. To differentiate it from the rest it will be a blue svg icon
  const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "blue",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    anchor: new google.maps.Point(15, 30),
  };
  var userMarker = new google.maps.Marker({
    position: { lat: Number(userLat), lng: Number(userLng) },
    map: map,
    title: "you",
    icon: svgMarker
  });
}

//function to calculate distances between current location and museums
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(Math.abs(lat2 - lat1));
  var dLon = deg2rad(Math.abs(lon2 - lon1));
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
