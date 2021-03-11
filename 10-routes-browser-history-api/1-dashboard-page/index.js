import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
    dates = {
        from: new Date((new Date).getTime() - 30 * 24 * 3600 * 1000),
        to: new Date()
    }

    async render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'dashboard full-height flex-column';

        wrapper.innerHTML = `
            <div class="content__top-panel">
                <h2 class="page-title">Панель управления</h2>
            </div>
            <div class="dashboard__charts">
            </div>
            <h3 class="block-title">Лидеры продаж</h3>
        `;

        const rangePicker = new RangePicker({
            from: this.dates.from,
            to: this.dates.to
        });
        
        const sortableTable = new SortableTable(header, {
            url: 'api/rest/products'
        });
        
        const chartOrders = new ColumnChart({
            url: 'api/dashboard/orders',
            range: {
                from: this.dates.from,
                to: this.dates.to,
            },
            label: 'orders',
            link: '#'
        });

        const chartSales = new ColumnChart({
            url: 'api/dashboard/sales',
            range: {
              from: this.dates.from,
              to: this.dates.to,
            },
            label: 'sales',
            formatHeading: data => `$${data}`
          });

        const chartCustomers = new ColumnChart({
            url: 'api/dashboard/customers',
            range: {
              from: this.dates.from,
              to: this.dates.to,
            },
            label: 'customers',
          });

        wrapper.querySelector('.content__top-panel').append(rangePicker.element);
        wrapper.querySelector('.dashboard__charts').append(chartOrders.element);
        wrapper.querySelector('.dashboard__charts').append(chartSales.element);
        wrapper.querySelector('.dashboard__charts').append(chartCustomers.element);
        wrapper.append(sortableTable.element);

        

        this.element = wrapper;
        this.subElements = {
            rangePicker: rangePicker.element,
            sortableTable: sortableTable.element,
            ordersChart: chartOrders.element,
            customersChart: chartCustomers.element,
            salesChart: chartSales.element 
        }

        wrapper.remove();

        this.initEventListeners();

        return this.element;
    }

    initEventListeners() {
        this.element.addEventListener('date-select', (evt) => {
            this.dates.from = evt.detail.from;
            this.dates.to = evt.detail.to;
            this.render();
        });
    }

    destroy() {
        this.remove();
    }

    remove() {
        this.element.remove();
    }
}
