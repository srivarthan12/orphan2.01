const name1 = document.getElementById("name");
const description1 = document.getElementById("description");
const price1 = document.getElementById("price");
const required1 = document.getElementById("required");
const button1 = document.getElementById("button1");
const essentialList = document.getElementById("essential-list");

button1.addEventListener("click", function(event) {
    event.preventDefault();
    create();
});

// Event delegation for dynamically created delete buttons
essentialList.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete")) {
        const id = event.target.dataset.id;  // Get the essential's ID
        deleteEssential(id);
    }
});

async function deleteEssential(id) {
    try {
        await axios.delete(`/api/orphan/delete/${id}`);
        alert("Deleted successfully");
        fetchEssentials(); // Refresh the list after deletion
    } catch (error) {
        console.error("Error deleting essential:", error);
        alert("Can't delete.");
    }
}

async function create() {
    try {
        const name = name1.value;
        const description = description1.value;
        const price = price1.value;
        const quantityAvailable = required1.value;

        await axios.post("/api/orphan/createe", {
            name,
            description,
            price,
            quantityAvailable
        });

        alert("Created successfully");
        fetchEssentials(); // Refresh the list after creation
    } catch (error) {
        console.error("Error processing donation:", error);
        alert("Can't insert.");
    }
}

async function fetchEssentials() {
    try {
        const response = await axios.get("/api/orphan");
        const essentials = response.data;
        renderEssentials(essentials);
    } catch (error) {
        console.error("Error fetching essentials:", error);
    }
}

function renderEssentials(essentials) {
    essentialList.innerHTML = essentials.map(essential => `
        <div class="essential">
            <h3>${essential.name}</h3>
            <p>${essential.description || "No description available."}</p>
            <p>Price: ₹${essential.price}</p>
            <p>Quantity needed: ${essential.quantityAvailable}</p>
            <button class="delete" data-id="${essential._id}">Delete</button>
        </div>
    `).join("");
}

fetchEssentials();
