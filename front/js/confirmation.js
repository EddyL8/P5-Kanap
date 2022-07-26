const str = window.location.href;
const newUrl = new URL(str);
const orderId = newUrl.searchParams.get("orderId");
console.log(str, newUrl, orderId);

const confirmOrder = document.getElementById("orderId");
confirmOrder.textContent = orderId;