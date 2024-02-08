let searchBar = document.getElementById('search-bar');
let searchBtn = document.getElementById('search-button');
let dateInputEl = document.querySelector('#date');
let headerEl = document.querySelector('#header');
let titleEl = document.querySelector('#title');
let newsSection = document.querySelector('#newspaper');
document.querySelector("#date").value.replaceAll('-', '');
//  NYT API KEY: ca099Snk2Kugzxo0Gc84kVoreQgmVbiT

function getNYT(event) {
    event.preventDefault();
    // TO DO: set year, month, and day variables to the selected value
    let year = '1970';
    let month = '12';
    let day = '15';
    console.log('hello');
    // Searches for headlines labeled as "news" if the search is post-1980 (non archival)
    if(year < 1981) {
        newsType = ""
    } else {
        newsType = "&facet=true&facet_fields=type_of_material&fq=news"
    };

    let nytURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=" + year + month + day + "&end_date=" + year + month + day + newsType + "&page=1&sort=relevance&api-key=ca099Snk2Kugzxo0Gc84kVoreQgmVbiT";
    fetch(nytURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        for(i = 0; i < 5; i++) {
            document.querySelector("#headline" + [i + 1]).textContent = data.response.docs[i].headline.main;
            document.querySelector("#blurb" + [i + 1]).textContent = data.response.docs[i].abstract;
        }
    })
}


searchBtn.addEventListener('click', getNYT);

searchBtn.addEventListener('click', function(){
    headerEl.classList.remove('shadow-lg');
    titleEl.classList.remove('text-5xl');
    titleEl.classList.add('text-3xl');
    newsSection.classList.remove('hide');

});