// Récupération de l'id du produit à afficher
const str = window.location.href;
const newUrl = new URL(str);
const productId = newUrl.searchParams.get('id');
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
const showProduct = (product) => {
    console.log(product);

    const productImgUrl = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImgUrl);
    productImgUrl.src = product.imageUrl;
    productImgUrl.alt = product.altTxt;
  
    const productName = document.getElementById("title");
    productName.textContent = product.name;
  
    const productPrice = document.getElementById("price");
    productPrice.textContent = product.price;
  
    const productDescription = document.getElementById("description");
    productDescription.textContent = product.description;

   // Sélection et option des couleurs
   for (color of product.colors) {
    const select = document.querySelector("select");
    
    const option = document.createElement("option");
    option.textContent = color;
    option.value = color;

    select.appendChild(option);
   }
    

    // Envoi au panier
    const addToCartButton = document.getElementById("addToCart");
    addToCartButton.addEventListener("click", () => {
        const productColor = document.getElementById("colors").value;
        const productQuantity = document.getElementById("quantity").value;

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

            const cartFromLocalStorage = JSON.parse(localStorage.getItem("cart"))??[];

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
        if (window.confirm(`Votre sélection a été ajoutée au panier !\nCliquez sur "OK" pour le consulter, sinon sur "Annuler" pour poursuivre vos achats.`)) {
            window.location.href = "cart.html";
        }//Quentin : excellente idée UX (enfin, dark pattern selon moi) oui lorsqu'on a validé un item on essaye de pousser l'utilisateur à l'action (achat) ou à l'ajout d'autre éléments dans le panier. 
        //par contre utiliser la box de confirmation n'est peut être pas la meilleur idée. On en reparle
    });
}
