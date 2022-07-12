// Requête de l'api et récupération des données
    fetch('http://localhost:3000/api/products')
    .then(res => {
        if (res.ok) {
          console.log(res);
            return res.json();
          }
        })

    .then((data) => {
      console.log(data);

      // Boucle de création et insertion des éléments dans la page d'accueil
      for (products of data) {
        const items = document.getElementById("items");

        const productLink = document.createElement("a");
        productLink.href = `./product.html?id=${products._id}`;
        items.appendChild(productLink);

        const productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        const productImgUrl = document.createElement("img");
        productImgUrl.src = products.imageUrl;
        productImgUrl.alt = products.altTxt;
        productArticle.appendChild(productImgUrl);

        const productName = document.createElement("h3");
        productName.textContent = products.name;
        productArticle.appendChild(productName);

        const productDescription = document.createElement("p");
        productDescription.textContent = products.description;
        productArticle.appendChild(productDescription);
    }
  })

  // Message d'erreur
  .catch(err => console.log(err, 'Données non accessibles'))
