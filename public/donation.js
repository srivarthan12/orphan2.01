const DONATE_API = "/api/orphan/free";
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const amountInput = document.getElementById("amount");
const button = document.getElementById("buttonn");

async function handleDonation() {
  try {
    const donorName = nameInput.value;
    const email = emailInput.value;
    const amount = amountInput.value;

    await axios.post(DONATE_API, {
      donorName,
      email,
      amount,
    });

    alert("you will be redirected to another page click ok!");
    location.replace("https://donate.stripe.com/test_14k3g60MGa4RbSg6oo")
  } catch (error) {
    console.error("Error processing donation:", error);
    alert("Failed to process your donation. Please try again.");
  }
}

button.addEventListener("click", function (event) {
  event.preventDefault();
  handleDonation();
});
