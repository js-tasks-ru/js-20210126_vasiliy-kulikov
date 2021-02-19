export default class DoubleSlider {
    constructor(sliderConfig = {}) { 
        this.min = sliderConfig.min;
        this.max = sliderConfig.max;
        this.formatValue = sliderConfig.formatValue;
        this.selected = sliderConfig.selected;

        this.sliderConfig = sliderConfig;

        this.render();
    }

    render() { 
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();

        this.element = wrapper.firstElementChild;

        wrapper.remove();

        this.initialization();
    }

    getTemplate() { 
        let valueMin, valueMax;

        if (this.sliderConfig.min) valueMin = this.sliderConfig.min;

        if (this.sliderConfig.max) valueMax = this.sliderConfig.max;

        return `
            <div class="range-slider">
                <span data-element='from'>${this.sliderConfig.formatValue(valueMin)}</span>
                    <div class="range-slider__inner">
                        <span class="range-slider__progress"></span>
                        <span class="range-slider__thumb-left"></span>
                        <span class="range-slider__thumb-right"></span>
                    </div>
                <span data-element='to'>${this.sliderConfig.formatValue(valueMax)}</span>
            </div>
        `
    }

    initialization() { 
        this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
        this.leftBoundry = this.element.querySelector('span[data-element = "from"]')

        this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
        this.rightBoundry = this.element.querySelector('span[data-element = "to"]');

        this.sliderLine = this.element.querySelector('.range-slider__inner');
        this.progressLine = this.element.querySelector('.range-slider__progress');

        this.sliderScaleRange = this.max - this.min;

        if (this.sliderConfig.selected) { 
            this.leftBoundry.textContent = this.formatValue(this.sliderConfig.selected.from);
            this.rightBoundry.textContent = this.formatValue(this.sliderConfig.selected.to);

            this.progressLine.style.left = (this.sliderConfig.selected.from - this.min) / this.sliderScaleRange * 100 + '%';
            this.leftThumb.style.left = this.progressLine.style.left;
        }

        this.element.addEventListener('pointerdown', this.pointerDown);

    }

    pointerDown = (evt) => {

        if (evt.target !== this.leftThumb && evt.target !== this.rightThumb) return;

        this.sliderLine.width = this.sliderLine.getBoundingClientRect().width;
        
        (evt.target === this.leftThumb) ? this.activeThumb = this.leftThumb : this.activeThumb = this.rightThumb;

        switch (this.activeThumb) { 
            
            case this.leftThumb:

                if (!this.leftThumb.positionStart) { 
                    this.leftThumb.positionStart = this.leftThumb.getBoundingClientRect().left;
                };     

                this.leftThumb.ondragstart = () => false;

                document.addEventListener('pointermove', this.moveLeftThumb);
                break;
            
            case this.rightThumb:
                if (!this.rightThumb.positionStart) { 
                    this.rightThumb.positionStart = this.rightThumb.getBoundingClientRect().right;
                };

                this.rightThumb.ondragstart = () => false;
                document.addEventListener('pointermove', this.moveRightThumb);
                break;
            
            default:
                break;
        }
    };

    moveLeftThumb = (evt) => {  

        if ((evt.clientX <= this.leftThumb.positionStart) && (this.leftThumb.positionStart < this.sliderLine.getBoundingClientRect().left)) {
            this.leftThumb.style.cssText = `z-index: 10000; left: 0%`;
            this.leftBoundry.textContent = this.formatValue(this.min);
        } else { 
            this.leftThumb.style.cssText = `
                z-index: 10000;
                left: ${(evt.clientX - this.leftThumb.positionStart) / this.sliderLine.width * 100}%
            `;
            
            this.leftBoundry.textContent = this.formatValue(Math.round(this.min + this.sliderScaleRange * (evt.clientX - this.leftThumb.positionStart) / this.sliderLine.width));
        }

        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 
            this.leftThumb.style.cssText = `
                z-index: 10000;
                left: ${100 - parseFloat(this.rightThumb.style.right)}%;
            `;
        }

        this.progressLine.style.left = `${parseFloat(this.leftThumb.style.left)}%`;

        document.addEventListener('pointerup', this.pointerLeftUp);
    }

    moveRightThumb = (evt) => { 

        if (evt.clientX > this.rightThumb.positionStart) {
            this.rightThumb.style.cssText = `z-index: 10000; right: 0%`;
        } else { 
            this.rightThumb.style.cssText = `
                z-index: 10000;
                right: ${(this.rightThumb.positionStart - evt.clientX) / this.sliderLine.width * 100}%
            `;
        }
        
        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 

            this.rightThumb.style.cssText = `
                z-index: 10000;
                right: ${100 - parseFloat(this.leftThumb.style.left)}%;
            `;  
        }
        
        this.progressLine.style.right = `${parseFloat(this.rightThumb.style.right)}%`;

        document.addEventListener('pointerup', this.pointerRightUp);
    }

    pointerLeftUp = () => { 
        document.removeEventListener('pointermove', this.moveLeftThumb);
        document.removeEventListener('pointerup', this.pointerLeftUp);
    }

    pointerRightUp = () => { 
        document.removeEventListener('pointermove', this.moveRightThumb);
        document.removeEventListener('pointerup', this.pointerRightUp);
    }

    destroy() { 
        this.element.remove();
    }
}
