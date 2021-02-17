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

        this.element.addEventListener('pointerdown', (evt) => {
            if (evt.target.className !== 'range-slider__thumb-left' &&
                evt.target.className !== 'range-slider__thumb-right') return;
            
            this.move(evt);
        });
    }

    move(evt) { 
        
    }

    /*let event = new Event('range-select', {

    })*/
}
