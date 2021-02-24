class Tooltip {

    initialize() { 
        document.body.addEventListener('pointerover', (evt) => {
            const tooltipType = evt.target.dataset.tooltip;

            if (!tooltipType) return;

            this.render(tooltipType);
        });
    }

    render(tooltipType) { 
        const tooltipContainer = document.createElement('div');
        tooltipContainer.className = 'tooltip';

        this.element = tooltipContainer;
        this.element.textContent = tooltipType;

        document.body.append(this.element);
        document.body.addEventListener('pointermove', this.move);
        document.body.addEventListener('pointerout', this.hide);
    }

    move = (evt) => { 
        this.element.style.cssText = `left: ${evt.clientX + 10}px; top: ${evt.clientY + 10}px`;
    }

    hide = (evt) => { 
        if (!evt.target.dataset.tooltip) return;
        this.element.remove();
        document.body.removeEventListener('pointerout', this.hide);
        document.body.removeEventListener('pointermove', this.move);
    }

    destroy() { 
        this.element.remove();
    }
}

const tooltip = new Tooltip();

export default tooltip;
