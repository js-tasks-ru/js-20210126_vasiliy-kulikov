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
        
        evt.target.classList.add('sortable-list__item_dragging');

        const { height, left, top, right } = evt.target.getBoundingClientRect();
        const { width } = evt.target.closest('ul').getBoundingClientRect();

        evt.target.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            left: ${left}px;
            top: ${top}px
        `;

        this.activeElement = evt.target;

        this.shiftX = evt.clientX - left;
        this.shiftY = evt.clientY - top;
        
        document.addEventListener('pointermove', this.pointermove);
        document.addEventListener('pointerdown', this.pointerup);
    }

    pointermove = (evt) => { 
        

        this.activeElement.style.top = evt.clientY - this.shiftY + 'px';
        this.activeElement.style.left = evt.clientX - this.shiftX + 'px';

        this.activeElement.hidden = true;
        let elemBelow = document.elementFromPoint(evt.clientX, evt.clientY);
        console.log(this.activeElement.hasAttribute('hidden'));
        console.log(elemBelow);
        this.activeElement.hidden = false;

        console.log(this.activeElement.hasAttribute('hidden'));
        

        

        
    }
}
