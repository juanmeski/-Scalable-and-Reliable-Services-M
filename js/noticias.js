var noticias;

const MAX_NEWS = 6;
var url = 'https://api.currentsapi.services/v1/search?' +
    'keywords=musei&' +
    'country=it&' +
    'language=it&' +
    'apiKey=LBsLwjGyg9LZKS6RymQf_jmJBAlkVNaJK_yuZtYvCQSfgXbO';
var req = new Request(url);
fetch(req)
    .then(function (response) {
        return response.json();
    }).then((news) => {
        noticias = news;
        addNews();
    })
    .catch(error => {
        console.log(error)
    })

//We add the news extracted from the API
function addNews() {
    for (let i = 0; i < MAX_NEWS; i++) {
        //We add the title
        document.getElementById("new_title_" + i.toString()).innerHTML = noticias.news[i]["title"];
        document.getElementById("new_title_" + i.toString()).href = noticias.news[i]["url"];
        //We add the photo
        if (noticias.news[i]["image"] != "None") {
            document.getElementById("new_img_" + i.toString()).src = noticias.news[i]["image"];
        }
        //We add the event listener to open the popup
        document.getElementById("new_" + i.toString()).addEventListener('click', () => {
            document.getElementById('popupBox').style.display = 'block';
            document.getElementById('popupBackground').style.display = 'block';
            document.getElementById("titulo_noticia").innerHTML = noticias.news[i]["title"];
            document.getElementById("cuerpo-noticia").innerHTML = noticias.news[i]["description"];
        });
    }
}

//Function that closes the popup
function closePopup() {
    document.getElementById('popupBox').style.display = 'none';
    document.getElementById('popupBackground').style.display = 'none';
}