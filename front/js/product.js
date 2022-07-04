// Récupération de l'id du produit à afficher
let str = window.location.href;
let newUrl = new URL(str);
let productId = newUrl.searchParams.get('id');
console.log(str, newUrl, productId);

// Requête de l'api et récupération des données
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
    // Message d'erreur
    .catch(err => console.log(err, 'Données non accessibles'))

// Insertion des éléments dans la page produit
let showProduct = (product) => {
    console.log(product);
    document.querySelector(".item__img").innerHTML +=
        `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById("title").textContent = product.name;
    document.getElementById("price").textContent = product.price;
    document.getElementById("description").textContent = product.description;

    // Sélection de la couleur du produit    
    for (colors of product.colors) {
        console.log(colors);
        document.querySelector("#colors").innerHTML += `<option value="${colors}">${colors}</option>`
    }

    // Envoi au panier
    let addToCartButton = document.getElementById("addToCart");
    addToCartButton.addEventListener("click", () => {
        let productColor = document.getElementById("colors").value;
        let productQuantity = document.getElementById("quantity").value;

        // Alerte choix couleur et quantité
        if (productColor == "" || productQuantity <= 0 || productQuantity >= 101) {
            alert("Veuillez choisir une couleur et une quantité valide pour ajouter un produit au panier");
            return false
        }

        else {
            // Création de l'objet "item" avec les informations nécessaires d'un produit pour les actions avec le panier
            let item = {
                id: product._id,
                color: productColor,
                quantity: parseInt(productQuantity) // Utilisation de parseInt pour additionner les quantités
            }

            let cartFromLocalStorage = JSON.parse(localStorage.getItem("cart"))??[];

            // Vérification des produits (même id et même couleur) et ajout dans le panier
            let foundProduct = cartFromLocalStorage.find(p => p.id === item.id && p.color === item.color); 
            if (foundProduct) { 
              foundProduct.quantity += item.quantity;
            } else {
              cartFromLocalStorage.push(item)  
            };
            console.log(cartFromLocalStorage);

            localStorage.setItem("cart", JSON.stringify(cartFromLocalStorage));
        }

        // Fenêtre popup d'ajout et de redirection vers le panier
        if (window.confirm(`Votre commande est ajoutée au panier !\nCliquez sur "OK" pour le consulter, sinon sur "Annuler" pour poursuivre vos achats.`)) {
            window.location.href = "cart.html";
        }
    });
}
