export default class SortableTable {
    constructor(header, { data } = {}) { 
        this.header = header;
        this.data = data;
        this.render();
    }
    tableHeader() { 
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.makeHeader().join('')}
            </div>
        `
    }

    tableBody() { 
        return `
            <div data-element="body" class="sortable-table__body">
                ${this.makeBody().join('')}
            </div>  
        ` 
    }

    template() { 
        return `
            <div class="sortable-table">
                ${this.tableHeader()}
                ${this.tableBody()}                  
            </div>
        `;
    }

    makeHeader() { 
        const arrayHeaderElements = this.header.map(item => { 
            let arrows = `
                <span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>
            `;

            return `
                <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
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

        
        this.element = table;
    }

    makeBody() { 

        const arrIdCells = [];

        for (let item of this.header) arrIdCells.push(item.id);

        const arrRows = this.data.map(item => {
            const arrCells = [];
            let cell;

            arrIdCells.forEach((elem) => {
                if (elem === 'images') {
                    cell = `
                        <div class="sortable-table__cell">
                            <img class="sortable-table-image" alt="Image" src="${item.images[0].url}">
                        </div>
                    `;
                } else { 
                    cell = `
                        <div class="sortable-table__cell">${item[elem]}</div>
                    `;
                }
                arrCells.push(cell);
            });
            
            const row = `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${arrCells.join('')}
                </a>
            `;

            return row;
        });

        return arrRows;  
    }

    sort(fieldValue, orderValue) { 
        const tableBody = document.body.querySelector('.sortable-table__body');
        
        this.subElements = {};
        this.subElements.header = document.querySelector('.sortable-table').firstElementChild;
        this.subElements.body = document.querySelector('.sortable-table').lastElementChild;;


        let order; 

        switch (orderValue) { 
            case 'asc':
                order = 1;
                break;
            case 'desc':
                order = -1;
                break;
        }

        let typeSort;

        this.header.forEach((item) => { 
            if (item.id === fieldValue) typeSort = item.sortType; 
        }); 

        if (typeSort === 'string') {
            this.data.sort((a, b) => {
                return order * a.title.localeCompare(b.title, ['ru', 'en'], { caseFirst: 'upper' });
            });
        }
        
        if (typeSort === 'number') { 
            this.data.sort((a, b) => order * (a[fieldValue] - b[fieldValue]));
        }  

        tableBody.innerHTML = this.makeBody().join('');
        
        const headerChilds = document.body.querySelector('.sortable-table__header').children;

        for (let child of headerChilds) {
            child.dataset.id === fieldValue ? child.dataset.order = orderValue : child.dataset.order = ''; 
        }
    }

    destroy() { 
        this.element.remove();
    }
}

