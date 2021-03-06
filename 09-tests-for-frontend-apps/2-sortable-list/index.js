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

        this.initActiveElement(evt.target);
        this.initNotActiveElements();
        this.initPlaceHolder();

        this.shiftX = evt.clientX - this.left;
        this.shiftY = evt.clientY - this.top;
        this.startY = evt.clientY;

        this.activeElement.replaceWith(this.placeHolder);
        this.element.append(this.activeElement);
        
        document.addEventListener('pointerup', this.pointerup);
        document.addEventListener('pointermove', this.pointermove);
    }

    pointermove = (evt) => { 

        let direction;
        
        (this.startY - evt.clientY) > 0 ? direction = 'up' : direction = 'down';

        const left = evt.clientX - this.shiftX;
        const bottom = evt.clientY - this.shiftY + this.height;
        const top = evt.clientY - this.shiftY;

        let elemBelow;

        switch (direction) {
            case 'down': 
                this.activeElement.style.display = 'none';
                elemBelow = document.elementFromPoint(evt.clientX, bottom);
                this.activeElement.style.display = "";

                if ([...this.items].includes(elemBelow)) elemBelow.after(this.placeHolder);

                break;
            
            case 'up':
                this.activeElement.style.display = 'none';
                elemBelow = document.elementFromPoint(evt.clientX, top);
                this.activeElement.style.display = "";

                if ([...this.items].includes(elemBelow)) elemBelow.before(this.placeHolder);
                
                break;
        }
        
        this.activeElement.style.top = top + 'px';
        this.activeElement.style.left = left + 'px';
        
        this.startY = evt.clientY;
    }

    pointerup = () => {
        this.placeHolder.replaceWith(this.activeElement);
        this.activeElement.classList.remove('sortable-list__item_dragging');
        this.activeElement.style.cssText = '';

        document.removeEventListener('pointermove', this.pointermove);
        document.removeEventListener('pointerup', this.pointerup);
    }

    initActiveElement(target) {
        this.activeElement = target.closest('li');
        this.activeElement.classList.add('sortable-list__item_dragging');

        const { height, left, top } = this.activeElement.getBoundingClientRect();
        const { width } = this.element.getBoundingClientRect();

        this.activeElement.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            left: ${left}px;
            top: ${top}px
        `;

        this.height = height;
        this.width = width;
        this.left = left;
        this.top = top;
    }

    initNotActiveElements() {
        this.notActiveElements = [];

        [...this.items].forEach(item => {
            if (item !== this.activeElement) this.notActiveElements.push(item); 
        });
    }

    initPlaceHolder() {
        this.placeHolder = document.createElement('div');
        this.placeHolder.className = 'sortable-list__placeholder';
        this.placeHolder.style.cssText = `
            width: ${this.width}px;
            height: ${this.height}px
        `;
    }

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove(); 
    }
}
