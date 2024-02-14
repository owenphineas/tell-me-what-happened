let searchBar = document.getElementById('search-bar');
let searchBtn = document.getElementById('search-button');
let dateInputEl = document.querySelector('#date');
let headerEl = document.querySelector('#header');
let titleEl = document.querySelector('#title');
let newsSection = document.querySelector('#newspaper');
let resultsSection = document.getElementById('results');
let closeModalBtn = document.getElementById('close');
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

// Wikipedia API function
function getWikipediaPages() {
    // Get the selected date from user input
    let searchText = dateInputEl.value.trim();
    console.log('Fetching Wikipedia pages for:', searchText);
    if (searchText === '') {
        console.log('Search text empty. Please enter a valid date.');
        return;
    }
    // Fetch Wikipedia pages for specified date
    fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchText}&srlimit=5&format=json&origin=*`)
        .then(response => response.json())
        .then(data => {
            let pageTitles = data.query.search.map(page => page.title);
            // Fetch Wikipedia pages information
            return Promise.all(pageTitles.map(title => fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&exintro&format=json&titles=${encodeURIComponent(title)}&origin=*`)));
        })
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(pagesData => {
            pagesData.forEach((pageData, index) => {
                let page = Object.values(pageData.query.pages)[0];
                let articleElement = document.getElementById(`article${index + 1}`);
                articleElement.querySelector('.title').textContent = page.title;
                
                // Add URL to Wikipedia page
                let url = `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`;
                let link = document.createElement('a');
                link.href = url;
                link.textContent = ' Read more';
                link.target = '_blank';
                 // Added Tailwind to make the anchor tag blue
                link.classList.add('text-blue-500', 'hover:underline');
                articleElement.querySelector('.title').appendChild(link);
                
                // Display only 400 characters fo summary
                let summary = page.extract.substring(0, 400);
                articleElement.querySelector('.summary').textContent = summary + '...';
            });
            console.log('Wikipedia pages: ', pagesData);
        })
        .catch(error => {
            console.error('Error fetching Wikipedia pages:', error);
        });
}
let dateArray = JSON.parse(localStorage.getItem("savedDate")) || [];


// Displays the last five searched dates in the modal as links
function storeDate() {

    if(dateArray.length < 5) {
        dateArray.push(dateInputEl.value);
    } else {
        dateArray.shift(0);
        dateArray.push(dateInputEl.value);
    }
    localStorage.setItem("savedDate", JSON.stringify(dateArray));
}

function displayDates() {
    let modalDates = document.querySelector("#savedDate");
    for(i = 0; i < dateArray.length; i++) {
        modalDates.children[i].textContent = dateArray[i];
        modalDates.children[i].addEventListener('click', function() {
            console.log(this.innerHTML);
            dateInputEl.value = this.innerHTML;
        })
    }
}

//Sends alert if user hasn't submitted a date
function checkForm() {
    const submittedForm = document.getElementById('date').value;
    if (submittedForm == "" || submittedForm == null) {
      alert("You have not selected a date"), resultsSection.classList.add('hide');
      return;
    }
};


//Calls all relevant functions when date is submitted
function submitDate(event){
    event.preventDefault();
    storeDate();
    getNYT();
    getWikipediaPages();
    checkForm()
};

//Handles style changes when date is submitted to accommodate the results
searchBtn.addEventListener('click', function(){
    resultsSection.classList.remove('hide');
    headerEl.classList.remove('shadow-lg');
    headerEl.classList.add('max-h-40');
    titleEl.classList.remove('text-5xl');
    titleEl.classList.remove('mb-10');
    titleEl.classList.add('mb-3');
    titleEl.classList.remove('mt-10');
    titleEl.classList.add('mt-3');
    titleEl.classList.add('text-3xl');
    searchBar.firstElementChild.classList.remove('mb-10');
    searchBar.firstElementChild.classList.add('mb-2');
});


searchBtn.addEventListener('click', submitDate);


//Below is the modal code 
let modal = document.getElementById('savedResults');
let modalBtn = document.getElementById('savedResultsBtn');
let span = document.getElementById('close');

modalBtn.addEventListener('click', function(){
    modal.classList.remove('hide');
    modal.classList.add('block');
    displayDates();
});
closeModalBtn.addEventListener('click', function(){
    modal.classList.add('hide');
    modal.classList.remove('block');
});


