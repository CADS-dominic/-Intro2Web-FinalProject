
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);



const search = $('.nav-search');
const logoutBtn = $('.logout-btn');
const list = $('.component-list.newProduct')
const next = $('.next');
const prev = $('.prev');
const filterIco = $('.fa-filter');
const filterForm = $('#form_filter');
const filterBtn = $('.filterBtn');
let filterMax = $('#input_max-price');
let filterMin = $('#input_min-price');

const app = {

  listProduct: [],
  perPage: 5,
  curPage: 1,
  start: 0,
  totalPages: 0,

  loadNewProductList() {

    if (window.location.pathname != '/home') {
      return;
    }

    list.innerHTML = '';
    const newProduct = this.listProduct.slice(this.start, this.start + this.perPage);
    newProduct.forEach((product, index) => {
      list.innerHTML += `
            <li class="component-item">
              <a href="/detail/${product._id}">
                <img src=${product.ava} alt="">
                <p class="item-name">
                    ${product.name}
                </p>
                <div class="price-discount">
                  <span class="price">
                    ${product.price}
                  </span>
                </div>
              </a>
            </li>
            
            `
    })
  },

  loadResultList(value) {
    const result = $('.result');
    let minPrice = filterMin.value ? filterMin.value : 0;
    let maxPrice = filterMax.value ? filterMax.value : Infinity;
    let resultList = [];
    result.innerHTML = "";
    this.listProduct.filter((product, index) => {
      if (product.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
        resultList.push(product);
      }
    })

    if (minPrice > maxPrice) {
      minPrice = 0;
      maxPrice = Infinity;
    }
    resultList = resultList.filter((product) => product.price > minPrice && product.price < maxPrice);
    this.totalPages = Math.ceil(resultList.length / this.perPage);
    resultList = resultList.slice(this.start, this.start + this.perPage);
    resultList.forEach((product, index) => {
      result.innerHTML += `
            <li class="result-item">
              <a href="/detail/${product._id}">
                <img src=${product.ava} alt="">
                <p class="result-item-name">
                    ${product.name}
                </p>
                <div class="result-price-discount">
                  <span class="result-price">
                    ${product.price}
                  </span>
                </div>
              </a>
            </li>
            
            `
    })
  },

  viewProducts() {
    const _this = this;
    fetch(window.location.origin + '/home/getProducts')
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        _this.listProduct = res;
        //_this.loadNewProductList(_this.listProduct);
        _this.totalPages = Math.ceil(_this.listProduct.length / _this.perPage);
      });
    window.localStorage.setItem('listProduct', JSON.stringify(this.listProduct));
  },

  renderNext() {
    this.curPage++;
    if (this.curPage > this.totalPages) {
      this.curPage = this.totalPages;
    }
    else {
      this.start = this.start + this.perPage;
    }
    switch(window.location.pathname) {
      case "/home":
        this.loadNewProductList(this.listProduct);
      case "/search":
        this.loadResultList(search.value);
    }
    
  },

  renderPrev() {
    this.curPage--;
    if (this.curPage <= 0) {
      this.curPage = 1;
      this.start = 0;
    }
    else {
      this.start = this.start - this.perPage;
    }
    switch(window.location.pathname) {
      case "/home":
        this.loadNewProductList(this.listProduct);
      case "/search":
        this.loadResultList(search.value);
    }
  },


  handleEvent() {
    const _this = this;

    search.onclick = () => {
      if (window.location.pathname != '/search') {
        window.location.pathname = 'search';
      }
      search.click();
    }

    search.oninput = (e) => {
      this.start = 0;
      this.curPage = 1;
      this.loadResultList(e.target.value);
    }

    next.onclick = () => {
      this.renderNext();
    }

    prev.onclick = () => {
      this.renderPrev();
    }

    filterIco.onclick = () => {
      filterForm.classList.toggle('active');
    }
    
    filterBtn.onclick = () => {
      filterMax = $('#input_max-price');
      filterMin = $('#input_min-price');
      this.loadResultList(search.value);
      filterForm.classList.toggle('active');
    }

  },

  run() {
    app.viewProducts();
    app.handleEvent();
  }
}

app.run();