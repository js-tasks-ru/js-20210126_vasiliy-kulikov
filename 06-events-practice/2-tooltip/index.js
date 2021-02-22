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
        document.body.addEventListener('pointerout', this.hide);
    }

    hide = (evt) => { 
        if (!evt.target.dataset.tooltip) return;
        this.element.remove();
        document.body.removeEventListener('pointerout', this.hide);
    }

    destroy() { 
        this.element.remove();
    }
}

const tooltip = new Tooltip();

export default tooltip;
