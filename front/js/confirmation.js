const str = window.location.href;
const newUrl = new URL(str);
const orderId = newUrl.searchParams.get("orderId");

const orderConfirmation = document.getElementById("orderId");
orderConfirmation.textContent = orderId;