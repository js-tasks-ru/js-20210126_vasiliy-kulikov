import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  constructor(productId) {
    this.productId = productId;
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();
    this.element = wrapper.firstElementChild;
    wrapper.remove();

    const elements = this.element.querySelectorAll('.form-control');
    this.subElements = [...elements].reduce((accum, subElement) => {
      accum[subElement.name] = subElement;
      return accum;
    }, {});

    this.subElements.images = this.element.querySelector('div[data-element="imageListContainer"]').firstElementChild;

    await this.loadCategoriesData();
    await this.loadProductData();
    this.initEventListeners();
  }

  async loadCategoriesData() {
    this.urlCategories = new URL('api/rest/categories', BACKEND_URL);
    this.urlCategories.searchParams.set('_sort', 'weight');
    this.urlCategories.searchParams.set('_refs', 'subcategory');

    const responseCategories = await fetch(this.urlCategories.toString());
    this.dataCategories = await responseCategories.json();

    const arraySubCategories = [];

    this.dataCategories.forEach(item => {
      item.subcategories.forEach(subcategory => {
        arraySubCategories.push(
          `<option value="${subcategory.id}">${item.title + ' > ' + subcategory.title}</option>`
        );
      });
    });

    this.subElements['subcategory'].innerHTML = arraySubCategories.join('');
  }

  async loadProductData() {
    if (!this.productId) return;

    this.urlProduct = new URL('api/rest/products', BACKEND_URL);
    this.urlProduct.searchParams.set('id', this.productId);

    const responseProduct = await fetch(this.urlProduct.toString());
    this.dataProduct = await responseProduct.json();

    this.dataProduct = this.dataProduct[0];

    for (const key of Object.keys(this.subElements)) {
      console.log(key);
      this.subElements[key].value = this.dataProduct[key];
    }

    this.imagesProduct = [{
      source: "317e219831d070101388d6e656e78cec9acce2de0c4940fcd54fbcddc2a6591c.jpg",
      url: "https://c.dns-shop.ru/thumb/st4/fit/0/0/1bae5dfdfdf19b5ef65b7b57e0a6e7d4/317e219831d070101388d6e656e78cec9acce2de0c4940fcd54fbcddc2a6591c.jpg"
    }];//this.dataProduct.images;

    const imagesList = this.imagesProduct.map(item => {
      return `
        <li class="products-edit__imagelist-item sortable-list__item" style="">
          <input type="hidden" name="url" value="${item.url}">
          <input type="hidden" name="source" value="${item.source}">
          <span>
            <img src="icon-grab.svg" data-grab-handle="" alt="grab">
            <img class="sortable-table__cell-img" alt="Image" src="${item.source}">
            <span>${item.source}</span>
          </span>
          <button type="button">
            <img src="icon-trash.svg" data-delete-handle="" alt="delete">
          </button>
        </li>
      `
    });

    this.subElements.images.innerHTML = imagesList;
      
  }

  initEventListeners() {
    this.element.addEventListener('click', this.deleteImage);
    this.element.addEventListener('click', this.uploadImage);
  }
  
  deleteImage = (evt) => { 
    const imageDelete = this.element.querySelector('img[data-delete-handle]');
    if (evt.target === imageDelete) imageDelete.closest('li').remove(); 
  }

  uploadImage = (evt) => { 
    const uploadButton = this.element.querySelector('button[name="uploadImage"]');
    
    if (evt.target === uploadButton) { 
      const uploadInput = document.createElement(`input`);
      uploadInput.type = 'file';
      uploadInput.hidden = true;

      uploadInput.addEventListener('click', () => {
        const url = new URL('https://api.imgur.com/3/image')
        const response = fetch(url);
        const responseBody = response.json();
        console.log(responseBody);

      });

      this.element.append(uploadInput);  

      uploadInput.click();
    }
  }

  getTemplate() {
    return `
      <div class="product-form">
                <form data-element="productForm" class="form-grid">
                  ${this.getTitle()}
        ${this.getDescription()}
        ${this.getPhoto()}
        ${this.getCategories()}
        ${this.getAddCharachters()}
                  <div class="form-buttons">
                    <button type="submit" name="save" class="button-primary-outline">
                      Сохранить товар
          </button>
                  </div>
                </form>
              </div>
    `;
  }

  getTitle() {
    return `
      <div class="form-group form-group__half_left">
                <fieldset>
                  <label class="form-label">Название товара</label>
                  <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
        </fieldset>
      </div>
    `;
  }

  getDescription() {
    return `
      <div class="form-group form-group__wide" >
                  <label class="form-label">Описание</label>
                  <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
                </div>
    `;
  }

  getPhoto() {
    return `
      <div class="form-group form-group__wide" data-element="sortable-list-container">
                  <label class="form-label">Фото</label>
                  <div data-element="imageListContainer">
                    <ul class="sortable-list"></ul>
                  </div>
                  <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
                </div>
    `;
  }

  getCategories() {
    return `
      <div class="form-group form-group__half_left">
                  <label class="form-label">Категория</label>
                  <select class="form-control" name="subcategory"></select>
                </div>
    `;
  }

  getAddCharachters() {
    return `
    <div class="form-group form-group__half_left form-group__two-col">
                  <fieldset>
                    <label class="form-label">Цена ($)</label>
                    <input required="" type="number" name="price" class="form-control" placeholder="100">
      </fieldset>
                    <fieldset>
                      <label class="form-label">Скидка ($)</label>
                      <input required="" type="number" name="discount" class="form-control" placeholder="0">
      </fieldset>
    </div>
                    <div class="form-group form-group__part-half">
                      <label class="form-label">Количество</label>
                      <input required="" type="number" class="form-control" name="quantity" placeholder="1">
    </div>
                      <div class="form-group form-group__part-half">
                        <label class="form-label">Статус</label>
                        <select class="form-control" name="status">
                          <option value="1">Активен</option>
                          <option value="0">Неактивен</option>
                        </select>
                      </div>
    `;
  }
}
