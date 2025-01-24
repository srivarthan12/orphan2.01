  const ESSENTIALS_API = "/api/orphan";
  const DONATE_API = "/api/orphan/essential";

  const essentialList = document.getElementById("essential-list");
  const cartItems = document.getElementById("cart-items");
  const totalAmountEl = document.getElementById("total-amount");
  const donateBtn = document.getElementById("donate-btn");
  const button = document.getElementById("buttonn");
const toggleButton = document.querySelector('.nav-toggle');
const sidebar = document.querySelector('.sidebar');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});


  let cart = [];

  async function fetchEssentials() {
    try {
      const response = await axios.get(ESSENTIALS_API);
      const essentials = response.data;
      renderEssentials(essentials);
    } catch (error) {
      console.error("Error fetching essentials:", error);
    }
  }

  function renderEssentials(essentials) {
    essentialList.innerHTML = essentials.map((essential, index) => `
      <div class="essential">
        <h3>${essential.name}</h3>
        <p>${essential.description || "No description available."}</p>
        <p>Price: ₹${essential.price}</p>
        <p>quantity we need: ${essential.quantityAvailable}</p>
        <button data-essential='${encodeURIComponent(JSON.stringify(essential))}' class="add-to-cart">
          donate
        </button>
      </div>
    `).join("");

    document.querySelectorAll('.add-to-cart').forEach((button) => {
      button.addEventListener('click', (event) => {
        const essential = JSON.parse(decodeURIComponent(event.target.dataset.essential));
        addToCart(essential);
      });
    });
  }
  

  function addToCart(essential) {
    if (essential.quantityAvailable === 0) {
        alert("donate this item someother time!");
        return; 
    }

    const existingItem = cart.find(item => item._id === essential._id);

    if (existingItem) {
        if (existingItem.quantity < essential.quantityAvailable) {
            existingItem.quantity++;
        } else {
            alert("That's enough, thank you!");
        }
    } else {
        cart.push({ ...essential, quantity: 1 });
    }

    updateCart();
}

 
  function updateCart() {
    cartItems.innerHTML = cart.map((item, index) => `
      <li>
        ${item.name} - ₹${item.price} x ${item.quantity}
        <button class="remove" onclick="removeFromCart(${index})">Remove</button>
      </li>
    `).join("");
  
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalAmountEl.textContent = totalAmount.toFixed(2);
  
    donateBtn.disabled = cart.length === 0;
  }
  

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }

  async function handleDonation() {
    const donorName = prompt("Enter your name:");
    const email = prompt("Enter your email:");
  
    if (!donorName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please provide a valid name and email to proceed.");
      return;
    }
  
    try {
      const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      await axios.post(DONATE_API, {
        donorName,
        email,
        amount: totalAmount,
        items: cart.map(item => ({ name: item.name, _id: item._id, quantity: item.quantity })),
      });
  
      alert("You will be redirected for payment!");
      axios.put(ESSENTIALS_API, {
        items: cart.map(item => ({ _id: item._id, quantityDonated: item.quantity })),
      });
      const response = await axios.post("/api/orphan/checkout", {
        items: cart.map(item => ({ description: item.description, name: item.name, price: item.price, quantity: item.quantity })),
        email,
      });
  
      const { sessionId } = response.data;
      const stripe = Stripe("pk_test_51Qc5qq1944h9KWdoxg6B6gLKAgWdCPz32o5aPntEEJk2stu5OkSqBQeQ1jLwSjj2D9pnWvHBI1kHaTcbQfJYyV4Y00OzQUUfsP");
      await stripe.redirectToCheckout({ sessionId });
  
      // Update availability after successful donation
      
  
      alert("Donation successful, and product availability updated!");
  
      cart = [];
      updateCart();
    } catch (error) {
      console.error("Error processing donation:", error);
      alert("Failed to process your donation. Please try again.");
    }
  }
  
  

  donateBtn.addEventListener("click", handleDonation);
  fetchEssentials();