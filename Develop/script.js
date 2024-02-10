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
// Wikipedia API Function
function getWikipediaPages(event) {
    event.preventDefault();
    // Use selected date from user input
    let searchText = dateInputEl.value.trim();
    console.log('Fetching Wikipedia pages for:', searchText);
    if (searchText === '') {
        console.log('Search text empty. Please enter valid date.');
        return;
    }
    // Fetch Wikipedia pages for specified date
    fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchText}&srlimit=5&format=json&origin=*`)
        .then(response => response.json())
        .then(data => {
            let pageTitles = data.query.search.map(page => page.title);
            // Fetch Wikipedia page information
            return Promise.all(pageTitles.map(title => fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&format=json&titles=${encodeURIComponent(title)}&origin=*`)));
        })
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(pagesData => {
            pagesData.forEach((pageData, index) => {
                let page = Object.values(pageData.query.pages)[0];
                let articleElement = document.getElementById(`article${index + 1}`);
                articleElement.querySelector('.title').textContent = page.title;
                articleElement.querySelector('.summary').textContent = page.extract;
            });
            console.log('Wikipedia pages: ', pagesData);
        })
        .catch(error => {
            console.error('Error fetching Wikipedia pages:', error);
        });
}

// Event listener for search button to fetch Wikipedia pages
searchBtn.addEventListener('click', getWikipediaPages);

searchBtn.addEventListener('click', function(){
    headerEl.classList.remove('shadow-lg');
    titleEl.classList.remove('text-5xl');
    titleEl.classList.add('text-3xl');
    newsSection.classList.remove('hide');
});
