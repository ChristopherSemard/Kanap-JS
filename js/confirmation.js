// Récupération du conteneur où insérer l'id
let orderId = document.getElementById("orderId");

// Récupération de l'id de la commande
let order = JSON.parse(localStorage.getItem("order"));

// Récupération de l'id de la commande
orderId.textContent = `${order}`;

// Effacement du panier et de la commande
localStorage.clear();