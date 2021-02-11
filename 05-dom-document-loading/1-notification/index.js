export default class NotificationMessage {
    static quantityElemsOnPage = 0;

    constructor(message, { duration, type } = {}) { 
        this.message = message;
        this.duration = duration;
        this.type = type;
        this.render();
    }

    render() { 
        const notification = document.createElement('div');
        notification.className = `notification ${this.type}`;
        notification.style.cssText = `--value:${this.duration / 1000}s`;
        notification.innerHTML = `
            <div class="timer"></div>
            <div class="inner-wrapper">
                <div class="notification-header">${this.type}</div>
                <div class="notification-body">
                    ${this.message}
                </div>
            </div>
        `

        this.element = notification;
    }

    show(targetRenderElement = document.body) { 

        if (NotificationMessage.quantityElemsOnPage !== 0) return;
        
        targetRenderElement.append(this.element);
        NotificationMessage.quantityElemsOnPage++;

        setTimeout(() => {
            this.remove();
            NotificationMessage.quantityElemsOnPage--;
        }, this.duration);
    }

    remove() { 
        this.element.remove();
    }

    destroy() { 
        this.remove();
    }
}
