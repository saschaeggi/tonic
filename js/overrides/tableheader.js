((Drupal, once) => {
  Drupal.behaviors.tonicTableHeader = {
    attach: (context) => {
      Drupal.tonicTableHeader.init(context);
    },
  };

  Drupal.tonicTableHeader = {
    init: function (context) {
      once('tonicTableHeader', '.sticky-enabled', context).forEach(el => {
        // Watch sticky table header.
        const stickyOffsetTop = this.stickyPosition();
        const observer = new IntersectionObserver(
          ([e]) => {
            if (context.querySelector('.tonic-table-scroll-wrapper')) {
              if (!e.isIntersecting && e.rootBounds.top === stickyOffsetTop) {
                context.querySelector('.tonic-table-scroll-wrapper').classList.add('--is-sticky');
              } else {
                context.querySelector('.tonic-table-scroll-wrapper').classList.remove('--is-sticky');
              }
            }
          },
          { threshold: 1.0, rootMargin: `-${stickyOffsetTop}px 0px 0px 0px` }
        );
        observer.observe(el.querySelector('thead'));

        // Create sticky element.
        this.createStickyHeader(el);

        // SelectAll handling.
        this.syncSelectAll();

        // Watch resize event.
        window.onresize = () => {
          Drupal.debounce(this.handleResize(el), 150);
        };
      });
    },
    stickyPosition: () => {
      let offsetTop = 0;
      if (document.body.classList.contains('tonic--classic-toolbar')) {
        offsetTop = document.querySelector('#toolbar-bar').clientHeight;
      } else {
        const toolbar = document.querySelector('#gin-toolbar-bar');
        offsetTop = document.querySelector('.region-sticky').clientHeight;
        if (toolbar) {
          offsetTop += toolbar.clientHeight;
        }
      }

      return offsetTop;
    },
    createStickyHeader: function createStickyHeader(table) {
      const header = table.querySelector(':scope > thead');
      const stickyTable = document.createElement('table');
      stickyTable.className = 'sticky-header';
      stickyTable.append(header.cloneNode(true));
      table.insertBefore(stickyTable, header);
      this.handleResize(table);
    },
    syncSelectAll: () => {
      document.querySelectorAll('table.sticky-header > thead th.select-all').forEach(tableHeaderSticky => {
        const table = tableHeaderSticky.closest('table');
        table.querySelectorAll(':scope th.select-all').forEach(tableHeader => {
          tableHeader.addEventListener('click', event => {
            if (event.target.matches('input[type="checkbox"]')) {
              table.nextSibling.querySelectorAll('th.select-all').forEach(siblingTableHeader => {
                siblingTableHeader.childNodes[0].click();
              });
            }
          });
        });
      });
    },
    handleResize: (table) => {
      const header = table.querySelector(':scope > thead');
      header.querySelectorAll('th').forEach((el, i) => {
        table.querySelector(`table.sticky-header > thead thead th:nth-of-type(${i+1})`).style.width = `${el.offsetWidth}px`;
        table.querySelector(`table.sticky-header > thead`).style.width = `${el.parentNode.offsetWidth}px`;
      });
    },

  };

})(Drupal, once);
