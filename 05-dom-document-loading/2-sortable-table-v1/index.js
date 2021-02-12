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
        
        //const selectField = document.querySelector('#field');
        //const selectedFieldValue = selectField.querySelector('option[selected]').value;

        const arrayHeaderElements = this.header.map(item => { 
            let arrows = `
                <span data-element="arrow" class="sortable-table__sort-arrow">
                    <span class="sort-arrow"></span>
                </span>
            `;

            //if (item.id !== selectedFieldValue) arrows = ``;

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
        let order; 

        switch (orderValue) { 
            case 'asc':
                order = 1;
                break;
            case 'desc':
                order = -1;
                break;
        }

        if (fieldValue === "title") {
            this.data.sort((a, b) => {
                return order * a.title.localeCompare(b.title, ['ru', 'en'], { caseFirst: 'upper' });
            });
        } else { 
            this.data.sort((a, b) => order * (a[fieldValue] - b[fieldValue]));
        }  

        tableBody.innerHTML = this.makeBody().join('');
    }

    destroy() { 
        this.element.remove();
    }
}

