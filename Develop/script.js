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

let dateArray = JSON.parse(localStorage.getItem("savedDate")) || [];
function storeDate() {

    if(dateArray.length < 5) {
        dateArray.push(dateInputEl.value);
    } else {
        dateArray.shift(0);
        dateArray.push(dateInputEl.value);
    }
    localStorage.setItem("savedDate", JSON.stringify(dateArray));
}

// Displays the last five searched dates in the modal as links
function displayDates() {
    let modalBody = document.querySelector(".modal-body");
    for(i = 0; i < dateArray.length; i++) {
        modalBody.children[i].textContent = dateArray[i];
        modalBody.children[i].addEventListener('click', function() {
            console.log(this.innerHTML);
            dateInputEl.value = this.innerHTML;
        })
    }
}

function submitDate(event){
    event.preventDefault();
    storeDate();
    getNYT();
    getWikipediaPages();
};

searchBtn.addEventListener('click', function(){
    headerEl.classList.remove('shadow-lg');
    headerEl.classList.add('max-h-40');
    titleEl.classList.remove('text-5xl');
    titleEl.classList.add('text-3xl');
    newsSection.classList.remove('hide');
    wiki.classList.remove('hide');
    
});

// Wikipedia API function
function getWikipediaPages(event) {
    event.preventDefault();
    // Get the selected date from user input
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
            // Fetch Wikipedia pages information
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
searchBtn.addEventListener('click', submitDate);

// Saved Article section
// let saved = document.getElementById('saveThis');

//   function store(){
//     Will I need a prevent default here?
//      var inputItem= document.getElementById('saveThis');
//      localStorage.setItem('saveThis', inputItem.value);
//     };


//Below is code for modal 
var modal = document.getElementById('savedResults');
var modalBtn = document.getElementById('savedResultsBtn');
var span = document.getElementById('close');

modalBtn.addEventListener('click', function(){
    modal.classList.remove('hide');
    modal.classList.add('block');
    displayDates();
});

span.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Below is code that SHOULD allow user to click outside of modal to close it.
// window.addEventListener('click', function(event) {
//     if (event.target == modal) {
//         modal.style.display = 'none';
//     }
// });







