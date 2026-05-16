// tables.js
export class VirtualTable {
    constructor(containerId, columns, rowHeight = 48) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.columns = columns; // Array of { key, label, render }
        this.rowHeight = rowHeight;
        this.data = [];
        this.filteredData = [];
        this.scrollTop = 0;
        this.viewportHeight = 400; // default, will update
        this.sortKey = null;
        this.sortDesc = false;
        this.onRowClick = null;

        this.initDOM();
    }

    initDOM() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="table-wrapper" style="height: ${this.viewportHeight}px; overflow-y: auto; position: relative;">
                <div id="${this.containerId}-spacer" style="width: 1px;"></div>
                <table style="position: absolute; top: 0; left: 0; right: 0;">
                    <thead id="${this.containerId}-thead" style="position: sticky; top: 0; z-index: 10; background: var(--bg-primary);"></thead>
                    <tbody id="${this.containerId}-tbody">
                    </tbody>
                </table>
            </div>
        `;

        this.wrapper = this.container.querySelector('.table-wrapper');
        this.thead = document.getElementById(`${this.containerId}-thead`);
        this.tbody = document.getElementById(`${this.containerId}-tbody`);
        this.spacer = document.getElementById(`${this.containerId}-spacer`);

        this.renderHeader();

        this.wrapper.addEventListener('scroll', () => {
            this.scrollTop = this.wrapper.scrollTop;
            window.requestAnimationFrame(() => this.renderRows());
        });
    }

    renderHeader() {
        let tr = document.createElement('tr');
        this.columns.forEach(col => {
            let th = document.createElement('th');
            th.textContent = col.label;
            if(this.sortKey === col.key) {
                th.textContent += this.sortDesc ? ' ▼' : ' ▲';
            }
            th.addEventListener('click', () => this.sort(col.key));
            tr.appendChild(th);
        });
        this.thead.innerHTML = '';
        this.thead.appendChild(tr);
    }

    setData(data) {
        this.data = data;
        this.filteredData = [...data];
        if (this.sortKey) this.applySort();
        this.renderHeader(); // update sort icons
        this.renderRows();
    }

    setFilter(filterFn) {
        this.filteredData = this.data.filter(filterFn);
        if (this.sortKey) this.applySort();
        this.scrollTop = 0;
        if(this.wrapper) this.wrapper.scrollTop = 0;
        this.renderRows();
    }

    sort(key) {
        if (this.sortKey === key) {
            this.sortDesc = !this.sortDesc;
        } else {
            this.sortKey = key;
            this.sortDesc = false;
        }
        this.applySort();
        this.renderHeader();
        this.renderRows();
    }

    applySort() {
        this.filteredData.sort((a, b) => {
            let valA = a[this.sortKey];
            let valB = b[this.sortKey];
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return this.sortDesc ? 1 : -1;
            if (valA > valB) return this.sortDesc ? -1 : 1;
            return 0;
        });
    }

    renderRows() {
        if (!this.tbody) return;

        const totalItems = this.filteredData.length;
        const totalHeight = totalItems * this.rowHeight;

        // Spacer to force scrollbar
        this.spacer.style.height = `${totalHeight}px`;

        const startIndex = Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - 5);
        const visibleRows = Math.ceil(this.viewportHeight / this.rowHeight) + 10;
        const endIndex = Math.min(totalItems, startIndex + visibleRows);

        // Calculate offset for absolutely positioned rows
        const startOffset = startIndex * this.rowHeight;

        // Create document fragment for performance
        const fragment = document.createDocumentFragment();

        // Position the table relative to the visible area
        this.container.querySelector('table').style.top = `${startIndex * this.rowHeight}px`;

        for (let i = startIndex; i < endIndex; i++) {
            const item = this.filteredData[i];
            const tr = document.createElement('tr');
            tr.style.height = `${this.rowHeight}px`;

            if(this.onRowClick) {
                tr.classList.add('clickable-row');
                tr.addEventListener('click', () => this.onRowClick(item));
            }

            this.columns.forEach(col => {
                const td = document.createElement('td');
                if (col.render) {
                    td.innerHTML = col.render(item[col.key], item);
                } else {
                    td.textContent = item[col.key] !== undefined ? item[col.key] : '';
                }
                tr.appendChild(td);
            });
            fragment.appendChild(tr);
        }

        // Clear existing rows (keep spacer)
        Array.from(this.tbody.children).forEach(child => {
            if (child.id !== `${this.containerId}-spacer`) {
                this.tbody.removeChild(child);
            }
        });

        this.tbody.appendChild(fragment);
    }
}
