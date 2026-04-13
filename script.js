console.log("script.js loaded");


function displayApiItems() {
    const container = document.getElementById("itemsContainer");

    apiItems.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("item-card");

        card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.body}</p>
            <button class="claim-btn">Claim</button>
        `;

        container.appendChild(card);
    });
}

const modeToggle = document.getElementById('modeToggle');


(function () {
    const savedMode = localStorage.getItem("mode");

    if (savedMode === "dark") {
        document.documentElement.classList.add("dark");
    }
})();
function loadItems() {
    const container = document.getElementById("itemsContainer");
    container.innerHTML = "";

    let items = JSON.parse(localStorage.getItem("items")) || [];

    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("item-card");

        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.category}</p>
            <button class="claim-btn">Claim</button>
        `;

        container.appendChild(card);
    });
}

window.addEventListener("DOMContentLoaded", () => {

    if (modeToggle) {

        // Set correct icon on load
        modeToggle.textContent = document.documentElement.classList.contains("dark")
            ? "☀️"
            : "🌙";

        modeToggle.addEventListener("click", () => {

            document.documentElement.classList.toggle("dark");

            const isDark = document.documentElement.classList.contains("dark");

            if (isDark) {
				// Save theme so it stays consistant across all pages
                localStorage.setItem("mode", "dark");
                modeToggle.textContent = "☀️";
            } else {
                localStorage.setItem("mode", "light");
                modeToggle.textContent = "🌙";
            }

        });
    }

});

// Search 
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const itemsContainer = document.getElementById('itemsContainer');

if(searchBtn && itemsContainer){
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const cards = itemsContainer.getElementsByClassName('item-card');

    for(let card of cards){
        const name = card.querySelector('h3').textContent.toLowerCase();
        const category = card.querySelector('p').textContent.toLowerCase();

        card.style.display = (name.includes(query) || category.includes(query)) ? 'block' : 'none';
    }
});
}


// Report (SAVE TO LOCAL STORAGE)
const reportForm = document.getElementById('reportForm');
const successMsg = document.getElementById('successMsg');

if(reportForm){
reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const item = {
        name: document.getElementById('itemName').value,
        category: document.getElementById('category').value,
        location: document.getElementById('location').value,
        description: document.getElementById('description').value,
        image: document.getElementById('imageUpload').files[0] 
            ? URL.createObjectURL(document.getElementById('imageUpload').files[0]) 
            : 'images/default.png'
    };

    let items = JSON.parse(localStorage.getItem('items')) || [];
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));

    successMsg.textContent = "Your report has been submitted successfully!";
    reportForm.reset();
});
}


// Items 
const itemSearch = document.getElementById('itemSearch');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const itemsContainerList = document.getElementById('itemsContainer');

function filterItems(){
    if(!itemsContainerList) return;

    const searchQuery = itemSearch.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedLocation = locationFilter.value;
    const cards = itemsContainerList.getElementsByClassName('item-card');

    for (let card of cards) {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const category = card.getAttribute('data-category');
        const location = card.getAttribute('data-location');

        if (
            name.includes(searchQuery) &&
            (selectedCategory === "" || category === selectedCategory) &&
            (selectedLocation === "" || location === selectedLocation)
        ) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    }
}

if(itemSearch && categoryFilter && locationFilter){
itemSearch.addEventListener('input', filterItems);
categoryFilter.addEventListener('change', filterItems);
locationFilter.addEventListener('change', filterItems);
}


// Contact 
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if(contactForm){
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    contactSuccess.textContent = "Your message has been sent successfully!";
    contactForm.reset();
});
}


// LOAD ITEMS INTO ITEMS PAGE
function loadItems(){

if(!itemsContainerList) return;

let items = JSON.parse(localStorage.getItem('items')) || [];

items.forEach(item => {

    const card = document.createElement("div");
    card.classList.add("item-card");
    card.setAttribute("data-category", item.category);
    card.setAttribute("data-location", item.location);

    card.innerHTML = `
        <img src="${item.image}" alt="Item">
        <h3>${item.name}</h3>
        <p>Category: ${item.category}</p>
        <p>Location: ${item.location}</p>
        <button class="claim-btn">Claim</button>
    `;

    itemsContainerList.appendChild(card);
});
}

window.addEventListener("DOMContentLoaded", loadItems);


// CLAIM
if(itemsContainerList){
itemsContainerList.addEventListener('click', (e) => {

    if(e.target.classList.contains('claim-btn')){

        const card = e.target.closest('.item-card');
        if(!card) return;

        const itemName = card.querySelector('h3').textContent;

        card.remove();

        let items = JSON.parse(localStorage.getItem('items')) || [];

        items = items.filter(item => item.name !== itemName);

        localStorage.setItem('items', JSON.stringify(items));
    }
});
}
document.addEventListener("DOMContentLoaded", () => {
    loadItems();      // load your items
    fetchApiItems();  // load API items
});