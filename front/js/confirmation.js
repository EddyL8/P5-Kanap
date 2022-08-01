// Récupération du numéro de commande (orderId)
const str = window.location.href;
const newUrl = new URL(str);
const orderId = newUrl.searchParams.get("orderId");

// Affichage du numéro de commande
const orderConfirmation = document.getElementById("orderId");
orderConfirmation.textContent = orderId;