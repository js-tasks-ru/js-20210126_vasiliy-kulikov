export default class DoubleSlider {
    constructor({ min, max, formatValue, selected = {} } = {}) { 
        this.min = min;
        this.max = max;
        this.formatValue = formatValue;
        this.selected = selected;
        this.from = selected.from;
        this.to = selected.to;
        //console.log(this.from);
        //this.to = sliderConfig.selected.to;
        //this.sliderConfig = sliderConfig;

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
        return `
            <div class="range-slider">
                <span data-element='from'>${this.formatValue(this.min)}</span>
                    <div class="range-slider__inner">
                        <span class="range-slider__progress"></span>
                        <span class="range-slider__thumb-left"></span>
                        <span class="range-slider__thumb-right"></span>
                    </div>
                <span data-element='to'>$${this.formatValue(this.max)}</span>
            </div>
        `
    }

    initialization() { 
        this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
        this.leftBoundry = this.element.querySelector('span[data-element="from"]')

        this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
        this.rightBoundry = this.element.querySelector('span[data-element="to"]');

        this.sliderLine = this.element.querySelector('.range-slider__inner');
        this.progressLine = this.element.querySelector('.range-slider__progress');

        this.scaleRange = this.max - this.min;
        /*
        if (this.selected) { 

            this.leftBoundry.textContent = this.formatValue(this.from);
            this.rightBoundry.textContent = this.formatValue(this.to);

            this.progressLine.style.left = (this.from - this.min) / this.scaleRange * 100 + '%';
            this.leftThumb.style.left = this.progressLine.style.left;

            this.progressLine.style.right = (this.max - this.to) / this.scaleRange * 100 + '%';
            this.rightThumb.style.right = this.progressLine.style.right;
        }
        */

        this.leftBoundry.textContent = this.formatValue(this.from);
        this.rightBoundry.textContent = this.formatValue(this.to);

        this.progressLine.style.left = (this.from - this.min) / this.scaleRange * 100 + '%';
        this.leftThumb.style.left = this.progressLine.style.left;

        this.progressLine.style.right = (this.max - this.to) / this.scaleRange * 100 + '%';
        this.rightThumb.style.right = this.progressLine.style.right;

        this.element.addEventListener('pointerdown', this.pointerDown);
    }

    pointerDown = (evt) => {

        if (evt.target !== this.leftThumb && evt.target !== this.rightThumb) return;
        
        this.initSliderLine();

        this.initThumb(evt);
    }

    initSliderLine() { 
        this.sliderLine.width = this.sliderLine.getBoundingClientRect().width;
        this.sliderLine.leftX = this.sliderLine.getBoundingClientRect().left;
        this.sliderLine.rightX = this.sliderLine.getBoundingClientRect().right;
    }

    initThumb(evt) {

        let activeThumb;
        
        (evt.target === this.leftThumb) ? activeThumb = this.leftThumb : activeThumb = this.rightThumb;
       
        let { left, right } = activeThumb.getBoundingClientRect();
        
        activeThumb.leftX = left;
        activeThumb.rightX = right;

        (activeThumb === this.leftThumb) ? activeThumb.positionStart = left : activeThumb.positionStart = right;

        activeThumb.shiftX = evt.clientX - activeThumb.positionStart;

        activeThumb.ondragstart = () => false;

        this.activeThumb = activeThumb;
        document.addEventListener('pointermove', this.moveThumb);
    }       
    
    moveThumb = (evt) => {  

        this.activeThumb.style.cssText = 'z-index: 10000';

        (this.activeThumb === this.leftThumb) ? this.moveLeftThumb(evt) : this.moveRightThumb(evt);

        document.addEventListener('pointerup', this.pointerUp);
    }

    moveLeftThumb(evt) { 

        if (evt.clientX <= this.sliderLine.leftX) {
            this.leftThumb.style.left = `0%`;
            this.leftBoundry.textContent = this.formatValue(this.min);
        } else { 
            this.leftThumb.style.left = (evt.clientX + this.leftThumb.shiftX - this.sliderLine.leftX) / this.sliderLine.width * 100 + '%';
            
            this.leftBoundry.textContent = this.formatValue(
                Math.round(
                    this.min + this.scaleRange * (evt.clientX - this.sliderLine.leftX) / this.sliderLine.width
                )
            );
        }
        
        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 
            this.leftThumb.style.left = 100 - parseFloat(this.rightThumb.style.right) + '%';
        
            this.leftBoundry.textContent = this.formatValue(
                Math.round(
                    parseFloat(this.leftThumb.style.left) / 100 * this.scaleRange + this.min
                )
            );
        }
        
        this.progressLine.style.left = `${parseFloat(this.leftThumb.style.left)}%`;
    }

    moveRightThumb(evt) { 

        if (evt.clientX >= this.sliderLine.rightX) {
            this.rightThumb.style.right = '0%';
            this.rightBoundry.textContent = this.formatValue(this.max);
        } else { 
            this.rightThumb.style.right = (this.sliderLine.rightX - this.rightThumb.shiftX - evt.clientX) / this.sliderLine.width * 100 + `%`;

            this.rightBoundry.textContent = this.formatValue(
                Math.round(
                    this.max + this.scaleRange * (evt.clientX - this.sliderLine.rightX) / this.sliderLine.width
                )
            );
        }
        
        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 

            this.rightThumb.style.right = 100 - parseFloat(this.leftThumb.style.left) +`%`;

            this.rightBoundry.textContent = this.formatValue(
                Math.round(
                    this.max - parseFloat(this.rightThumb.style.right) / 100 * this.scaleRange
                )
            );
        }
        
        this.progressLine.style.right = `${parseFloat(this.rightThumb.style.right)}%`;
    }
    
    pointerUp = () => { 
        let evtRangeSelect = new CustomEvent('range-select', {
            bubles: true,
            /*detail: {
                from: ,
                to: 
            }*/
        });

        this.element.dispatchEvent(evtRangeSelect);

        document.removeEventListener('pointermove', this.moveThumb);
        document.removeEventListener('pointerup', this.pointerUp);
    }

    destroy() { 
        this.element.remove();
    }
};


// ! дубликаты исходников

/* 
pointerDown = (evt) => {

        if (evt.target !== this.leftThumb && evt.target !== this.rightThumb) return;
        
        this.initSliderLine();

        (evt.target === this.leftThumb) ? this.activeThumb = this.leftThumb : this.activeThumb = this.rightThumb;

        switch (this.activeThumb) { 
            
            case this.leftThumb:

                if (!this.leftThumb.positionStart) { 
                    this.leftThumb.positionStart = this.leftThumb.getBoundingClientRect().left;
                    this.leftThumb.shiftX = evt.clientX - this.leftThumb.positionStart;
                };     

                this.leftThumb.ondragstart = () => false;

                document.addEventListener('pointermove', this.moveLeftThumb);
                break;
            
            case this.rightThumb:
                if (!this.rightThumb.positionStart) { 
                    this.rightThumb.positionStart = this.rightThumb.getBoundingClientRect().right;
                    this.rightThumb.shiftX = evt.clientX - this.rightThumb.positionStart;
                };

                this.rightThumb.ondragstart = () => false;
                document.addEventListener('pointermove', this.moveRightThumb);
                break;
            
            default:
                break;
        }
    };

     moveLeftThumb = (evt) => {  

        this.leftThumb.style.cssText = 'z-index: 10000';

        if (evt.clientX <= this.sliderLine.leftX) {
            this.leftThumb.style.left = `0%`;
            this.leftBoundry.textContent = this.formatValue(this.min);
        } else { 
            this.leftThumb.style.left = (evt.clientX + this.leftThumb.shiftX - this.sliderLine.leftX) / this.sliderLine.width * 100 + '%';
            
            this.leftBoundry.textContent = this.formatValue(
                Math.round(
                    this.min + this.scaleRange * (evt.clientX - this.sliderLine.leftX) / this.sliderLine.width
                )
            );
        }

        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 
            this.leftThumb.style.left = 100 - parseFloat(this.rightThumb.style.right) + '%';

            this.leftBoundry.textContent = this.formatValue(
                Math.round(
                    parseFloat(this.leftThumb.style.left) / 100 * this.scaleRange + this.min
                )
            );
        }

        this.progressLine.style.left = `${parseFloat(this.leftThumb.style.left)}%`;

        document.addEventListener('pointerup', this.pointerUp);
    }

    moveRightThumb = (evt) => { 
        this.rightThumb.cssText = 'z-index: 10000';

        if (evt.clientX >= this.sliderLine.rightX) {
            this.rightThumb.style.right = '0%';
            this.rightBoundry.textContent = this.formatValue(this.max);
        } else { 
            this.rightThumb.style.right = (this.sliderLine.rightX - this.rightThumb.shiftX - evt.clientX) / this.sliderLine.width * 100 + `%`;

            this.rightBoundry.textContent = this.formatValue(
                Math.round(
                    this.max + this.scaleRange * (evt.clientX - this.sliderLine.rightX) / this.sliderLine.width
                )
            );
        }
        
        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 

            this.rightThumb.style.right = 100 - parseFloat(this.leftThumb.style.left) +`%`;

            this.rightBoundry.textContent = this.formatValue(
                Math.round(
                    this.max - parseFloat(this.rightThumb.style.right) / 100 * this.scaleRange
                )
            );
        }
        
        this.progressLine.style.right = `${parseFloat(this.rightThumb.style.right)}%`;

        document.addEventListener('pointerup', this.pointerUp);
    }

    pointerUp = () => { 
        let evtRangeSelect = new CustomEvent('range-select', {
            bubles: true,
            detail: {
                from: ,
                to: 
            }
        });

        this.element.dispatchEvent(evtRangeSelect);

        document.removeEventListener('pointermove', this.moveLeftThumb);
        document.removeEventListener('pointermove', this.moveRightThumb);
        document.removeEventListener('pointerup', this.pointerUp);
    }

    destroy() { 
        this.element.remove();
    }


*/