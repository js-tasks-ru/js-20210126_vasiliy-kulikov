export default class DoubleSlider {
    constructor() { 
        this.render();
    }

    getTemplate() { 
        return `
            <div class="range-slider">
                <span>$100</span>
                    <div class="range-slider__inner">
                        <span class="range-slider__progress"></span>
                        <span class="range-slider__thumb-left"></span>
                        <span class="range-slider__thumb-right"></span>
                    </div>
                <span>$100</span>
            </div>
        `
    }

    render() { 
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate();

        this.element = wrapper.firstElementChild;

        wrapper.remove();

        this.initialization();
    }

    initialization() { 
        this.leftThumb = this.element.querySelector('.range-slider__thumb-left');
        this.rightThumb = this.element.querySelector('.range-slider__thumb-right');
        this.progressLine = this.element.querySelector('.range-slider__progress');

        this.element.addEventListener('pointerdown', this.pointerDown);

    }

    pointerDown = (evt) => {
        

        if (evt.target !== this.leftThumb && evt.target !== this.rightThumb) return;

        this.progressLine.width = this.progressLine.getBoundingClientRect().width;
        //console.log(this.progressLine.width);
        
        (evt.target === this.leftThumb) ? this.activeThumb = this.leftThumb : this.activeThumb = this.rightThumb;

        switch (this.activeThumb) { 
            
            case this.leftThumb:
                console.log(this.leftThumb.positionStart);
                if (!this.leftThumb.positionStart) { 
                    
                    this.leftThumb.positionStart = this.leftThumb.getBoundingClientRect().left;
                    this.leftThumb.shiftX = evt.clientX - this.leftThumb.positionStart;
                    console.log(this.leftThumb.positionStart);
                };     

                document.addEventListener('pointermove', this.moveLeftThumb);
                break;
            
            case this.rightThumb:
                if (!this.rightThumb.positionStart) { 
                    this.rightThumb.positionStart = this.rightThumb.getBoundingClientRect().right;
                    this.rightThumb.shiftX = this.rightThumb.positionStart - evt.clientX;
                };

                document.addEventListener('pointermove', this.moveRightThumb);
                break;
            
            default:
                break;
        }
    };

    moveLeftThumb = (evt) => {  
        document.addEventListener('pointerup', this.pointerLeftUp);

        if (evt.clientX < this.leftThumb.positionStart) {
            this.leftThumb.style.cssText = `position: absolute; z-index: 10000; left: 0%`;
        } else { 
            this.leftThumb.style.cssText = `
                position: absolute; z-index: 10000;
                left: ${(evt.clientX - this.leftThumb.positionStart) / this.progressLine.width * 100}%
            `;
        }

        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 

            this.leftThumb.style.cssText = `
                position: absolute; z-index: 10000;
                left: ${100 - parseFloat(this.rightThumb.style.right)}%;
            `;
            
        }

        this.progressLine.style.left = `${parseFloat(this.leftThumb.style.left)}%`;
    }

    moveRightThumb = (evt) => { 
        document.addEventListener('pointerup', this.pointerRightUp);

        if (evt.clientX > this.rightThumb.positionStart) {
            this.rightThumb.style.cssText = `position: absolute; z-index: 10000; right: 0%`;
        } else { 
            this.rightThumb.style.cssText = `
                position: absolute; z-index: 10000;
                right: ${(this.rightThumb.positionStart - evt.clientX - this.rightThumb.shiftX) / this.progressLine.width * 100}%
            `;
        }
        
        if (this.leftThumb.getBoundingClientRect().right >= this.rightThumb.getBoundingClientRect().left) { 

            this.rightThumb.style.cssText = `
                position: absolute; z-index: 10000;
                right: ${100 - parseFloat(this.leftThumb.style.left)}%;
            `;  
        }
        
        this.progressLine.style.right = `${parseFloat(this.rightThumb.style.right)}%`;
    }

    pointerLeftUp = () => { 
        document.removeEventListener('pointermove', this.moveLeftThumb);
        document.removeEventListener('pointerup', this.pointerLeftUp);
    }

    pointerRightUp = () => { 
        document.removeEventListener('pointermove', this.moveRightThumb);
        document.removeEventListener('pointerup', this.pointerRightUp);
    }













    /*
    pointerMove = (evt) => { 
        let activeThumbPositionPercentage = (evt.clientX - this.activeThumbLeftStart - this.shiftX) / this.sliderLineWidth * 100;
        console.log(`Старт Мыши: ${evt.clientX} / Старт Тумбы: ${this.activeThumbLeftStart} / Шифт: ${this.shiftX}`);
        this.activeThumb.style.left = `${activeThumbPositionPercentage}%`;

        if (activeThumbPositionPercentage <= 0) this.activeThumb.style.left = '0%';

        document.addEventListener('pointerup', this.pointerUp);
    }

    pointerUp = () => { 
        document.removeEventListener('pointermove', this.pointerMove);
        document.removeEventListener('pointerup', this.pointerUp);
    }
    */
}
