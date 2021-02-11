import { sortStrings } from '../../02-javascript-data-types/1-sort-strings/index.js';

export default class SortableTable {
    constructor(header, { data } = {}) { 
        this.header = header;
        this.data = data;
        this.render();
    }

    template() { 
        return `
            <div class="sortable-table">
                <div data-element="header" class="sortable-table__header sortable-table__row">
                    ${this.makeHeader().join('')}
                </div>
                <div data-element="body" class="sortable-table__body">
                    ${this.makeBody().join('')}
                </div>                    
            </div>
        `;
    }

    makeHeader() { 
        
        const selectField = document.querySelector('#field');
        const selectedFieldValue = selectField.querySelector('option[selected]').value;

        const arrayHeaderElements = this.header.map(item => { 
            let arrows = `
                <span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>
            `;

            if (item.id !== selectedFieldValue) arrows = ``;

            return `
                <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
                        <span>${item.title}</span> 
                        ${arrows}      
                </div>
            `           
        });

        return arrayHeaderElements;
    }

    render() { 
        const table = document.createElement('div');
        table.className = 'products-list__container';
        table.dataset.element = 'productsContainer';
        table.innerHTML = this.template();
        //console.log(table.innerHTML)

        this.element = table;
    }

    makeBody() { 
        const arrayCells = this.data.map(item => {
            return `
                <a href="/products/${item.id}" class="sortable-table__row">
                    <div class="sortable-table__cell">
                        <img class="sortable-table-image" alt="Image" src="${item.images[0].url}">
                    </div>
                    <div class="sortable-table__cell">${item.title}</div>
                    <div class="sortable-table__cell">${item.quantity}</div>
                    <div class="sortable-table__cell">${item.price}</div>
                    <div class="sortable-table__cell">${item.sales}</div>
                </a>
            `
        });

        return arrayCells;  
    }

    sort(fieldValue, orderValue) { 

        this.data.sort((a, b) => a[fieldValue] - b[fieldValue]);
        this.element.remove();
        console.log(this.data);
        this.render();

        //const arr = this.data
        //sortStrings(fieldValue, orderValue)
    }
}

