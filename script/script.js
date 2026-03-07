const allCards = document.getElementById("all-cards");
const buttons = document.querySelectorAll(".filter-btn");

let allIssuesData = [];

// loader show hide 
function showLoader() {
    document.getElementById("loader").classList.remove("hidden");
}

function hideLoader() {
    document.getElementById("loader").classList.add("hidden");
}

// Load Issue Here 
async function loadIssues() {
    showLoader()

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await res.json();

    allIssuesData = data.data;

    renderIssues(allIssuesData);

    hideLoader()
}

loadIssues();
showLoader()

// Issue Rendering Here 
function renderIssues(issues) {
    showLoader()

    allCards.innerHTML = "";

    document.getElementById("issue-count").innerText = `${issues.length} Issues`;

    issues.forEach(issue => {

        const div = document.createElement("div");

        div.innerHTML = `
        <div onclick="modalDetails(${issue.id})" 
        class="card bg-white p-3 space-y-3 shadow-sm 
        ${issue.priority == "high" || issue.priority == "medium"
                ? "border-t-3 border-green-500"
                : "border-t-3 border-purple-500"}">

            <div class="flex justify-between items-center">

                ${issue.priority == "high" || issue.priority == "medium"
                ? `<i class="fa-regular fa-circle-dot text-green-500"></i>`
                : `<i class="fa-regular fa-circle-check text-purple-500"></i>`}

                <p class="px-4 py-2 rounded-full 
                ${issue.priority === "high"
                ? "bg-red-100 text-red-500"
                : issue.priority === "medium"
                    ? "bg-yellow-100 text-yellow-500"
                    : "bg-gray-100 text-gray-500"}">

                ${issue.priority}
                </p>

            </div>

            <h2 class="text-2xl font-bold">${issue.title}</h2>

            <p class="text-gray-500">${issue.description}</p>

            <div class="flex gap-3 flex-wrap">

                ${issue.labels.map(label => {

                        if (label[0] === "b") {
                            return `
                        <div class="flex gap-2 items-center px-2 py-1 bg-red-50 rounded">
                            <i class="fa-solid fa-bug text-red-500"></i>
                            <p class="text-red-500">${label}</p>
                        </div>`;
                        }

                        else if (label[0] === "h") {
                            return `
                        <div class="flex gap-2 items-center px-2 py-1 bg-green-50 rounded">
                            <i class="fa-solid fa-helicopter-symbol text-green-500"></i>
                            <p class="text-green-500">${label}</p>
                        </div>`;
                        }

                        else if (label[0] === "e") {
                            return `
                        <div class="flex gap-2 items-center px-2 py-1 bg-yellow-50 rounded">
                            <i class="fa-regular fa-star text-yellow-500"></i>
                            <p class="text-yellow-500">${label}</p>
                        </div>`;
                        }

                        else {
                            return `
                        <div class="flex gap-2 items-center px-2 py-1 bg-orange-50 rounded">
                            <i class="fa-regular fa-star text-orange-500"></i>
                            <p class="text-orange-500">${label}</p>
                        </div>`;
                        }

                    }).join("")}

            </div>

            <hr class="text-gray-300">

            <div>
                <p class="text-gray-500">#1 by ${issue.author}</p>
                <p class="text-gray-500">${issue.updatedAt}</p>
            </div>

        </div>
        `;

        allCards.appendChild(div);

    });
    hideLoader()
}

// Filter Buttons
buttons.forEach(button => {

    button.addEventListener("click", async function () {

        buttons.forEach(btn => btn.classList.remove("bg-primary", "text-white"));
        this.classList.add("bg-primary", "text-white");
        const filter = this.dataset.filter;
        // console.log(filter)
        showLoader();
        allCards.innerHTML = "";
        let filtered = (filter === "all") ? allIssuesData : allIssuesData.filter(issue => issue.status === filter);

        renderIssues(filtered);
        hideLoader();
    });
});


// Search Inputs
document.getElementById("btn-search").addEventListener("keyup", function () {
    showLoader()

    const value = this.value.toLowerCase();
    const searchValue = value.trim()

    const filteredIssues = allIssuesData.filter(issue =>
        issue.title.toLowerCase().includes(searchValue)
    );

    console.log(filteredIssues)

    renderIssues(filteredIssues);
    hideLoader()

});


// Modal Details Here
async function modalDetails(cardId) {
    showLoader()

    const detailsBox = document.getElementById("details-container");

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${cardId}`);
    const data = await res.json();

    const issue = data.data;

    detailsBox.innerHTML = `

    <h2 class="text-2xl font-bold">${issue.title}</h2>

    <div class="flex gap-3 py-3 items-center">
        <p class="px-4 py-2 rounded-md ${issue.status == "all" || issue.status == "open" ? 'bg-green-500 text-white' : ' bg-red-500 text-white'}">${issue.status}</p>
        <p class="text-gray-500">Open by: ${issue.author}</p>
        <p class="text-gray-500">${issue.createdAt}</p>
    </div>

    <p class="text-lg text-gray-500">${issue.description}</p>

    <div class="bg-gray-100 grid grid-cols-2 rounded-md p-3 mt-3">

        <div>
            <p class="text-gray-400">Assignee</p>
            <p class="font-bold">${issue.assignee}</p>
        </div>

        <div>
            <p class="text-gray-400">Priority</p>
            <button class="btn btn-warning">${issue.priority}</button>
        </div>

    </div>
    `;

    document.getElementById("modal_details").showModal();
    hideLoader()
}
