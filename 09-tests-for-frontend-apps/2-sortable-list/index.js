export default class SortableList {
    constructor(source = {}) { 
        this.items = source.items;
        this.render();
    }

    render() { 
        const wrapper = document.createElement('ul');
        wrapper.className = 'sortable-list';

        this.items.forEach(item => {
            item.className = 'categories__sortable-list-item sortable-list__item';
            item.setAttribute('data-grab-handle', '');
            wrapper.append(item);
        });

        this.element = wrapper;
        wrapper.remove();

        

        this.initEventListeners();
    }

    initEventListeners() { 
        document.addEventListener('pointerdown', this.delete);
        document.addEventListener('pointerdown', this.pointerdown);
    }

    delete = (evt) => { 
        if (evt.target.hasAttribute('data-delete-handle')) evt.target.closest('li').remove();
    }

    pointerdown = (evt) => { 
        if (!evt.target.hasAttribute('data-grab-handle')) return;

        this.subElements = this.element.querySelectorAll('li');
        
        evt.target.classList.add('sortable-list__item_dragging');

        const { height, left, top } = evt.target.getBoundingClientRect();
        const { width } = this.element.getBoundingClientRect();

        evt.target.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            left: ${left}px;
            top: ${top}px
        `;

        this.notActiveElements = [];

        [...this.subElements].forEach(item => {
            if (item !== evt.target) this.notActiveElements.push(item); 
        });

        this.activeElement = evt.target;

        this.placeHolder = document.createElement('div');
        this.placeHolder.className = 'sortable-list__placeholder';
        this.placeHolder.style.cssText = `
            width: ${width}px;
            height: ${height}px
        `;

        this.activeElement.replaceWith(this.placeHolder);
        this.element.append(this.activeElement);

        this.shiftX = evt.clientX - left;
        this.shiftY = evt.clientY - top;

        this.startY = evt.clientY;
        
        document.addEventListener('pointermove', this.pointermove);
        document.addEventListener('pointerdown', this.pointerup);
    }

    pointermove = (evt) => { 

        let direction;
        
        (this.startY - evt.clientY) > 0 ? direction = 'down' : direction = 'up';

        const left = evt.clientX - this.shiftX;
        const top = evt.clientY - this.shiftY;

        this.activeElement.style.display = 'none';
        const elemBelow = document.elementFromPoint(evt.clientX, top);
        this.activeElement.style.display = "";

        if ([...this.subElements].includes(elemBelow)) { 
            direction >= 0 ? elemBelow.before(this.placeHolder) : elemBelow.after(this.placeHolder);
        }

        // this.startIndex = [...this.subElements].indexOf(this.activeElement);

        // this.subElements.coordsTop.forEach(item => { 
        //     if (top - 20 < item) 
        // })

        // for (let i = 0; i < this.startIndex; i++) { 
        //     if (top - 20 < this.subElements.coordsTop[i]) { 
        //         this.subElements[i].before(this.placeHolder);
        //         this.startIndex = i;
        //     }
        // }

        // const startIndex = [...this.subElements].indexOf(this.activeElement);

        // const arrayFilter = []; 

        // for (const element of this.subElements) { 
        //     if ((top - 20) < element.top) {
        //         arrayFilter.push(element);
        //         const topElement = arrayFilter[arrayFilter.length - 1];
        //         topElement.before(this.placeHolder);
        //     }
        // }

        // console.log(arrayFilter);

        this.activeElement.style.top = top + 'px';
        this.activeElement.style.left = left + 'px';
        
        this.startY = evt.clientY;
    }
}
