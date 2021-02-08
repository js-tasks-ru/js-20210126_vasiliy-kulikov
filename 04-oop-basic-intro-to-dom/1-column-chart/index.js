export default class ColumnChart {
    constructor({data, label, value, ...rest}) { 
        this.data = data;
        this.label = label;
        this.value = value;
    }

    render() { 
        let div 
        let targetContainer = document.body.querySelector(`#${this.label}`);
        /*
        switch (this.label) { 
            case 'orders':
                targetContainer = document.body.querySelector('')
                break;
            case 'sales':
                break;
            case 'customers':
                break;
        }
        */
        

    }
}
