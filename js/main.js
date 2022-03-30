// Récupérer les produits via l'API
fetch("http://localhost:3000/api/products")
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    })
    .then(function (data) {
        productBlocks(data);
    })
    .catch(function (error) {});


class product {
    constructor(id, name, imageUrl, description, altTxt, price, colors){
    this.id = id;
    this.name = name; 
    this.imageUrl = imageUrl;
    this.description = description;
    this.altTxt = altTxt;
    this.price = price;
    this.colors = colors;
    }
}

// Construction des blocks
function productBlocks(data){
    for (product of data){
        const productBlocksDiv = document.getElementById("products-list")
        
        let colorsBlocks = ""
        for(color of product.colors ){
            newColor = color.replace('/', '-');
            colorsBlocks += `<div class="color ${newColor}"></div>`
        }

        productBlocksDiv.innerHTML += `
        <a href="./front/html/product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="colorBlocks">${colorsBlocks}</div>
                <p class="price">${product.price} €</p>
            </article>
        </a>
        `
    }
}