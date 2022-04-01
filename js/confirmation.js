// Retrieve of the container where we insert the order ID
let orderId = document.getElementById("orderId");

// Retrieve the order ID
let order = JSON.parse(localStorage.getItem("order"));

// Insert the order ID
orderId.textContent = `${order}`;

// Delete the cart and the order
localStorage.clear();