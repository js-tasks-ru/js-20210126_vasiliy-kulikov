export default class SortableTable {
    constructor(header, { data } = {}) { 
        this.header = header;
        this.data = data;
        this.render();
    }

    render() { 
        const table = document.createElement('div');
        table.className = 'products-list__container';
        table.dataset.element = 'productsContainer';
        table.innerHTML = this.getTable();
        
        this.element = table;

        this.subElements = this.getSubElements(table.firstElementChild);

        this.subElements['header'].addEventListener('click', evt => {
            const parent = evt.target.closest('.sortable-table__cell');
            const column = parent.dataset.id;
            
            let sortingOrder;

            switch (parent.dataset.order) { 
                case 'asc':
                    sortingOrder = 'desc';
                    break;
                case 'desc':
                    sortingOrder = 'asc';
                    break;
                default:
                    sortingOrder = 'asc';
                    break;
            }

            this.sort(column, sortingOrder);
        });
    }

    getTable() {     
        return `
            <div class="sortable-table">
                ${this.getTableHeader()}
                ${this.getTemplateBody()}                  
            </div>
        `;
    }

    getTableHeader() { 
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.getTableHeaderRow().join('')}
            </div>
        `
    }

    getTemplateBody() {  
        return `
            <div data-element="body" class="sortable-table__body">
                ${this.getTemplateBodyRows(this.data).join('')}
            </div>  
        ` 
    }

    getTableHeaderRow() { 
        return this.header.map(item => {
            return `
                <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
                    <span>${item.title}</span> 
                    ${this.getHeaderArrow()}
                </div>
            `
        });          
    }

    getTemplateBodyRows(data) {
        return data.map(item => {
            return `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${this.getTemplateBodyRowCells(item).join('')}
                </a>
            `
        })
    }
    
    getTemplateBodyRowCells(item) {
        const arrayCells = [];

        for (let cell of this.header) {
            if (cell.template) {
                arrayCells.push(cell.template(item[cell.id]));
            } else {
                arrayCells.push(`<div class="sortable-table__cell">${item[cell.id]}</div>`);
            }
        }

        return arrayCells;
    }  
    
    getHeaderArrow() { 
        return `
            <span data-element="arrow" class="sortable-table__sort-arrow">
                <span class="sort-arrow"></span>
            </span>
        `
    }

    getSubElements(element) { 
        const elements = element.querySelectorAll('[data-element]');
        
        return [...elements].reduce((accum, subElement) => {
            accum[subElement.dataset.element] = subElement;
            return accum;
        }, {});
    }

    sort(field, order) { 
        const sortedData = this.sortData(field, order);

        const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
        const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id = ${field}]`);

        allColumns.forEach(item => {
            item.dataset.order = '';
        });

        currentColumn.dataset.order = order;

        this.subElements.body.innerHTML = this.getTemplateBodyRows(sortedData);
    }

    sortData(field, order) { 
        const arr = [...this.data];
        const column = this.header.find(item => item.id === field);
        const { sortType, customSorting } = column;
        const direction = order === 'asc' ? 1 : -1;

        return arr.sort((a, b) => {
            switch (sortType) {
                case 'number':
                    return direction * (a[field] - b[field]);
                case 'string':
                    return direction * a[field].localeCompare(b[field], ['ru', 'en'], { caseFirst: 'upper' });
                case 'custom':
                    return direction * customSorting(a, b);
                default:
                    return direction * (a[field] - b[field]);
            }
        });
    }

    destroy() { 
        this.element.remove();
    }
}
