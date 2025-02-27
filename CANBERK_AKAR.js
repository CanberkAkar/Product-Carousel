(() => {
  //Initilize the application
  const init = () => {
  const productDetail = document.querySelector('.product-detail');
    if (!productDetail) return;
    //Create HTML elements
    self.buildHTML();
    //Create CSS elements
    self.buildCSS();
    //Set events
    self.setEvents();
  };

  const self = {};

  self.buildHTML = () => {
    //Generate static HTML contents
    //I have a div  class called header and this class include other elements.
    //This div class include seachbar and product-detail.
    //Product detail include carusel-container and carusel-container get value in end-points.
    const html = `
    <div class="header">
        <div>
          <h1 style="color: #0066cc">LC WAIKIKI</h1>
        </div>
        <div class="searchBar">
          <input type="text" placeholder="..." />
        </div>
      </div>
      <div class="product-detail">
      <h2 class="title">You Might Also Like</h2>

        <div class="carousel-container">
          <div class="carousel"></div>
          <button class="button-back"><span class="arrow-color">‹</span></button>
          <button class="button-go"><span class="arrow-color">›</span></button>
        </div>
      </div>

    `;

    document.body.innerHTML = html;
  };

  self.buildCSS = () => {
    // page styles
    // the style for the favorite icon is written in this area.
    // also the styles of the arrows that allow transition to the carousel are in this area.
    // @media feature is used for responsive design.
    const css = `
      body {
        font-family: "Open Sans", sans-serif;
        margin: 0;
        padding: 0;
      }
      .header {
        background-color: #f5f5f5;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .arrow-color{
        color: grey;
      }
      .searchBar input {
        padding: 10px;
        font-size: 16px;
        width: 100%;
        border: none;
        border-radius: 2rem; 
        box-sizing: border-box;
        margin: 10px auto; 
        display: block;
        margin-right:1000px;
      }
      @media (max-width: 768px) {
        .searchBar input {
          font-size: 14px; 
          padding: 8px; 
          width: 90%;
        }
      }
        .title {
          font-size: 32px;
          font-weight: bold;
          color: #0066cc; /*blue*/
          text-align: left;
          margin-top: 20px;
        }

      .carousel-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        margin: 20px 0;
      }
      .carousel {
        display: flex;
        transition: transform 0.5s ease;
      }
      .product-item {
        position: relative;
        width: 350px;
        margin-right: 20px;
        padding: 15px;
        box-sizing: border-box;
        background-color: #fff;
      }
      .product-item img {
        height: 250px;
        border: 1px solid #ccc; 
        border-radius: 0; 
      }
      .product-item h3 {
        font-size: 14px; 
        margin: 10px 0;
      }
      .product-item .price {
        font-size: 18px; 
        color: #193cb0; 
        font-weight: bold;
        margin-bottom: 10px;
      }
      .product-item .description {
        font-size: 14px; 
        color: #000000; 
        margin-bottom: 10px;
        text-decoration: none;
      }
      .button-back,
      .button-go {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: #ffffff6e;
        color: white;
        border: none;
        cursor: pointer;
        padding: 15px;
        font-size: 20px;
        text-color:grey;
        height: 100px
      }
      .button-back {
        left: 0;
      }
      .button-go {
        right: 0;
      }
      .heart-icon-container {
        position: absolute;
        top: 20px;
        right: 20px;
        background-color: white;
        padding: 5px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
      }
      .heart-icon {
        font-size: 24px;
        cursor: pointer;
        transition: color 0.3s;
      }

      .heart-icon.filled {
        color: #193cb0;
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  };

  self.setEvents = () => {
    //querySelector() is used to select the first element with a certain class
    //querySelectorAll() is used to get all elements with the same class.
    //addEventListener() allows the carousel to move by adding click events to the buttons.
    //style.transform manages the scroll effect by moving the carousel left or right with the translateX() method.
    //localStorage prevents the user's favorite selections from being lost even if the page is refreshed by storing them in the browser.
    //closest() method is used to find the closest parent element of the clicked element and thus access the dataset.id value of the relevant product.
    //classList.add() and classList.remove() manage visual changes by adding and removing the "filled" class when the heart icon is clicked.
    const width = 350;
    let index = 0;

    document.querySelector(".button-go").addEventListener("click", () => {
      const totalProducts =
        document.querySelectorAll(".product-item").length;
        const maxIndex = Math.floor(totalProducts - 6.5);
        if (index < maxIndex) {
        index++;
        document.querySelector(
          ".carousel"
        ).style.transform = `translateX(-${index * width}px)`;
      }
    });

    document.querySelector(".button-back").addEventListener("click", () => {
      if (index > 0) {
        index--;
        document.querySelector(
          ".carousel"
        ).style.transform = `translateX(-${index * width}px)`;
      }
    });

    document
      .querySelector(".carousel")
      .addEventListener("click", (process) => {
        if (process.target && process.target.matches(".heart-icon")) {
          const productId = process.target.closest(".product-item").dataset.id;
          const isFavorite =
            localStorage.getItem(`favorite-${productId}`) === "true";
          if (isFavorite) {
            localStorage.removeItem(`favorite-${productId}`);
            process.target.classList.remove("filled");
            process.target.innerHTML = "&#x2661;";
          } else {
            localStorage.setItem(`favorite-${productId}`, "true");
            process.target.classList.add("filled");
            process.target.innerHTML = "&#x2665;";
          }
        }
      });

    loadProducts();
  };

  const loadProducts = async () => {
  // The loadProducts method retrieves the product data via a GET request from the corresponding URL. 
  // The try-catch block is used to provide error handling. Thus, during the request 
  // Any errors are caught and printed to the console.
  // If there is no data in localStorage, a fetch request is made to the corresponding URL 
  // Successful response is received, it is converted to JSON format and saved in localStorage.     
    try {
      const cachedProducts = localStorage.getItem("products");
      if (cachedProducts) {
        renderProducts(JSON.parse(cachedProducts));
      } else {
        const url =
          "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";
         const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Not Found");
        }
        const data = await response.json();
        localStorage.setItem("products", JSON.stringify(data));
        renderProducts(data);
      }
    } catch (error) {
      console.error("Error:", error);

    }
  };

  const renderProducts = (products) => {
    // renderProducts function renders the HTML structure of each product using the given list of products and displays it on the page.  
    // First, it selects the HTML element with class “.carousel” and clears its contents innerHTML 
    // Then create a div element for each product.
    // The necessary linking is made to open on the relevant page.
    // Related product is sent to checkFavoriteStatus function.
    const wrapper = document.querySelector(".carousel");
    wrapper.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productHTML = `
        <div class="product-item" data-id="${product.id}">
          <a href="product-detail.html?id=${product.id}" target="_blank" style="text-decoration: none;">
            <img src="${product.img}" alt="${product.name}" />
            <h3>${product.name}</h3>
          </a>
          <span class="price">${product.price.toFixed(2)} TRY</span>
          <div class="heart-icon-container">
            <span class="heart-icon">&#x2661;</span>
          </div>
        </div>
      `;
      wrapper.insertAdjacentHTML("beforeend", productHTML);
      checkFavoriteStatus(product.id);
    }
  };

  const checkFavoriteStatus = (productId) => {
    // The checkFavoriteStatus function checks the favorite status of a product based on its ID.
    // First, the product item is selected using querySelector by matching the data-id attribute with the productId.
    // Then, the heart icon within the product is selected using querySelector.
    // The function checks if the product is marked as favorite in localStorage.
    // If it is a favorite, the 'filled' class is added to the heart icon, and its inner HTML is updated to display a filled heart.
    // If it is not a favorite, the 'filled' class is removed and the heart icon is set to an empty heart.
    const favoritesProduct = document.querySelector(`.product-item[data-id="${productId}"]`);
    const heartIcon = favoritesProduct.querySelector(".heart-icon");

    const isFavorite = localStorage.getItem(`favorite-${productId}`) === "true";
    if (isFavorite) {
      heartIcon.classList.add("filled");
      heartIcon.innerHTML = "&#x2665;";
    } else {
      heartIcon.classList.remove("filled");
      heartIcon.innerHTML = "&#x2661;";
    }
  };
  
  

  document.addEventListener("DOMContentLoaded", init);
})();