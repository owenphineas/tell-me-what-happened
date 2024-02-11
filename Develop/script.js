let searchBar = document.getElementById('search-bar');
let searchBtn = document.getElementById('search-button');
let dateInputEl = document.querySelector('#date');
let headerEl = document.querySelector('#header');
let titleEl = document.querySelector('#title');
let newsSection = document.querySelector('#newspaper');
//  NYT API KEY: ca099Snk2Kugzxo0Gc84kVoreQgmVbiT

function getNYT() {
    let urlDate = dateInputEl.value.replaceAll('-', '');
    // Returns the searched year
    let searchYear = urlDate.slice(0, 4);

    // Searches for headlines labeled as "news" if the search is post-1980 (non archival)
    if(searchYear < 1981) {
        newsType = ""
    } else {
        newsType = "&facet=true&facet_fields=type_of_material&fq=news"
    };

    let nytURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=" + urlDate + "&end_date=" + urlDate + newsType + "&page=1&sort=relevance&api-key=ca099Snk2Kugzxo0Gc84kVoreQgmVbiT";
    fetch(nytURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        for(i = 0; i < 5; i++) {
            document.querySelector("#headline" + [i + 1]).textContent = data.response.docs[i].headline.main;
            document.querySelector("#blurb" + [i + 1]).textContent = data.response.docs[i].abstract;
        }
    })
}

function storeDate() {
    let dateArray = JSON.parse(localStorage.getItem("savedDate")) || [];

    if(dateArray.length < 5) {
        dateArray.push(dateInputEl.value);
    } else {
        dateArray.shift(0);
        dateArray.push(dateInputEl.value);
    }
    localStorage.setItem("savedDate", JSON.stringify(dateArray));
}

function submitDate(event){
    event.preventDefault();
    storeDate();
    getNYT();
    // getWikipediaPages();
};

searchBtn.addEventListener('click', function(){
    headerEl.classList.remove('shadow-lg');
    headerEl.classList.add('max-h-40');
    titleEl.classList.remove('text-5xl');
    titleEl.classList.add('text-3xl');
    newsSection.classList.remove('hide');
    wiki.classList.remove('hide');
    
});

searchBtn.addEventListener('click', submitDate);

//Saved Article section
let saved = document.getElementById('saveThis');

  function store(){
    //Will I need a prevent default here?
     var inputItem= document.getElementById('saveThis');
     localStorage.setItem('saveThis', inputItem.value);
    }
