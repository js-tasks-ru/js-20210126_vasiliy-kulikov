export default class RangePicker {
    constructor( config = {}) { 
        this.from = config.from;
        this.to = config.to;
        this.transformDates(config.from, config.to);
        this.makeMonthsMap();
        this.render();
    }

    makeMonthsMap() { 
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]

        const monthsMap = new Map();
        
        for (const month of months) { 
            monthsMap.set(months.indexOf(month), month)
        }

        this.monthsMap = monthsMap;
    }

    transformDates(from, to) { 
        this.datesNumbers = {
            from: {
                day: from.getDate(),
                month: from.getMonth(), 
                year: from.getFullYear()
            },
            to: {
                day: to.getDate(),
                month: to.getMonth(), 
                year: to.getFullYear()
            }
        };
    }

    render() { 
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.getTemplate(this.datesNumbers.from, this.datesNumbers.to);
        this.element = wrapper.firstElementChild;
        wrapper.remove();

        const elements = this.element.querySelectorAll('[data-element]');

        this.subElements = [...elements].reduce((accum, subElement) => {
            accum[subElement.dataset.element] = subElement;
            return accum;
        }, {});
    }

    getTemplate(from, to) { 
        return `
            <div class="rangepicker rangepicker_open">
                ${this.getInput(from, to)}
                <div class="rangepicker__selector" data-element="selector">
                    <div class="rangepicker__selector-arrow"></div>
                    <div class="rangepicker__selector-control-left"></div>
                    <div class="rangepicker__selector-control-right"></div>
                    ${this.getCalendar(from, 'left')}
                    ${this.getCalendar(to, 'right')}
                </div>
            </div>
        `
    }

    getInput(from, to) { 

        return `
            <div class="rangepicker__input" data-element="input">
              <span data-element="from">${from.day}/${from.month + 1}/${from.year}</span> -
              <span data-element="to">${to.day}/${to.month + 1}/${to.year}</span>
            </div>
        `
    }

    getCalendar(date, side) { 
        console.log(this.monthsMap);
        console.log(date.month);
        return `
            <div class="rangepicker__calendar">
                <div class="rangepicker__month-indicator">
                    <time datetime="${this.monthsMap.get(date.month)}">${this.monthsMap.get(date.month)}</time>
                </div>
                <div class="rangepicker__day-of-week">
                    <div>Пн</div>
                    <div>Вт</div>
                    <div>Ср</div>
                    <div>Чт</div>
                    <div>Пт</div>
                    <div>Сб</div>
                    <div>Вс</div>
                </div>
                <div class="rangepicker__date-grid">
                    ${this.getPickerCell(date, side).join('')}
                </div>
            </div>
        `
    }

    getPickerCell(date, side) { 
        const firstDay = new Date();
        firstDay.setFullYear(date.year);
        firstDay.setMonth(date.month);
        firstDay.setDate(1);

        const lastDate = new Date();
        lastDate.setFullYear(date.year);
        lastDate.setMonth(date.month + 1);
        lastDate.setDate(0);

        const arrayCells = [];

        for (let i = 1; i <= lastDate.getDate(); i++) { 
            let style = '';
            
            (i === 1) ? style = `style="--start-from: ${firstDay.getDay()}"` : style;

            let selectedClass = '';

            if (i === date.day && side === 'left') selectedClass = 'rangepicker__selected-from';
            if (i === date.day && side === 'right') selectedClass = 'rangepicker__selected-to';
            if ((i > date.day && side === 'left') || (i < date.day && side === 'right')) selectedClass = 'rangepicker__selected-between';

            arrayCells.push(`<button type="button" class="rangepicker__cell ${selectedClass}" data-value="${date.year}-${date.month}-${i}T17:53:50.338Z" ${style}>${i}</button>`);
        }

        return arrayCells;
    }
}
 