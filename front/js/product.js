// Récupération de l'id du produit à afficher
let str = window.location.href;
let newUrl = new URL(str);
let productId = newUrl.searchParams.get('id');
console.log(str, newUrl, productId);

// requête de l'api et récupération des données
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(res => {
        if (res.ok) {
        console.log(res);
            return res.json();
        }
        })
    .then((product) => {
        showProduct(product);
    })
    // message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))
    
// insertion des éléments dans la page produit
let showProduct = (product) => {
    console.log(product);
    document.querySelector(".item__img").innerHTML +=
    `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;
}