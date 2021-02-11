export default class ColumnChart {
    constructor({ data = [], label, value, link, chartHeight = 50 } = {}) { 
        this.data = data;
        this.label = label;
        this.value = value;
        this.link = link;
        this.chartHeight = chartHeight;

        this.render();
    }

    render() { 

        const chart = document.createElement('div');
        chart.classList.add('column-chart');
        chart.style.cssText = `--chart-height: ${this.chartHeight}`;

        let chartData = this.makeDataRightValue();

        chartData = chartData.map((item) => {
            return `<div style="--value: ${Math.floor(item)}" data-tooltip="${Math.round(item / this.chartHeight * 100)}%"></div>`
        });

        chart.innerHTML = `
            <div class="column-chart__title">
                    Total ${this.label}
                    <a href="${this.link}" class="column-chart__link">View all</a>
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.value}</div>
                <div data-element="body" class="column-chart__chart">${chartData.join('')}</div>
            </div>
        `;

        if (this.data.length === 0) {
            chart.classList.add('column-chart_loading');
        }
            
        this.element = chart;
    }

    makeDataRightValue() { 
        let coefValues, newChartData;
        let maxValue = Math.max(...this.data);

        coefValues = this.chartHeight / maxValue;
        newChartData = this.data.map(item => item * coefValues);

        return newChartData;
    }

    update(data) {
        this.data = data;
        this.render();
    }

    destroy() { 

    }

    remove() {
        this.element.remove();
    }
}
