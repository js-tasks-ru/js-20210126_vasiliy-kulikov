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

        this.height = height;

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
        document.addEventListener('pointerup', this.pointerup);
    }

    pointermove = (evt) => { 

        let direction;
        
        (this.startY - evt.clientY) > 0 ? direction = 'up' : direction = 'down';

        console.log(direction);

        const left = evt.clientX - this.shiftX;
        const bottom = evt.clientY - this.shiftY + this.height;
        const top = evt.clientY - this.shiftY;

        let elemBelow;

        switch (direction) {
            case 'down':
                this.activeElement.style.display = 'none';
                elemBelow = document.elementFromPoint(evt.clientX, bottom);
                this.activeElement.style.display = "";

                if ([...this.subElements].includes(elemBelow)) elemBelow.after(this.placeHolder);

                break;
            
            case 'up':
                this.activeElement.style.display = 'none';
                elemBelow = document.elementFromPoint(evt.clientX, top);
                this.activeElement.style.display = "";

                if ([...this.subElements].includes(elemBelow)) elemBelow.before(this.placeHolder);
                
                break;
        }
        
        this.activeElement.style.top = top + 'px';
        this.activeElement.style.left = left + 'px';
        
        this.startY = evt.clientY;
    }

    pointerup() {
        this.placeHolder.replaceWith(this.activeElement);
    }
}
