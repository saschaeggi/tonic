/* eslint-disable func-names, no-mutable-exports, no-continue, comma-dangle, strict */

'use strict';

(function ($, Drupal, displace) {
  function TableHeader(table) {
    var $table = $(table);

    this.$originalTable = $table;

    this.$originalHeader = $table.children('thead');

    this.$originalHeaderCells = this.$originalHeader.find('> tr > th');

    this.displayWeight = null;
    this.$originalTable.addClass('sticky-table');

    // Wrap table for vertical scrolling ability
    this.$originalTable.wrap('<div class="gin-table-scroll-wrapper"></div>');

    this.tableHeight = $table[0].clientHeight;
    this.tableOffset = this.$originalTable.offset();

    this.$originalTable.on('columnschange', { tableHeader: this }, function (e, display) {
      var tableHeader = e.data.tableHeader;
      if (tableHeader.displayWeight === null || tableHeader.displayWeight !== display) {
        tableHeader.recalculateSticky();
      }
      tableHeader.displayWeight = display;
    });

    this.createSticky();
  }

  function forTables(method, arg) {
    var tables = TableHeader.tables;
    var il = tables.length;
    for (var i = 0; i < il; i++) {
      tables[i][method](arg);
    }
  }

  function tableHeaderInitHandler(e) {
    var $tables = $(e.data.context).find('table.sticky-enabled').once('tableheader');
    var il = $tables.length;
    for (var i = 0; i < il; i++) {
      TableHeader.tables.push(new TableHeader($tables[i]));
    }
    forTables('onScroll');
  }

  Drupal.behaviors.tableHeader = {
    attach: function attach(context) {
      $(window).one('scroll.TableHeaderInit', { context: context }, tableHeaderInitHandler);
    }
  };

  function scrollValue(position) {
    return document.documentElement[position] || document.body[position];
  }

  function tableHeaderResizeHandler(e) {
    forTables('recalculateSticky');
  }

  function tableHeaderOnScrollHandler(e) {
    forTables('onScroll');
  }

  function tableHeaderOffsetChangeHandler(e, offsets) {
    forTables('stickyPosition', offsets.top);
  }

  $(window).on({
    'resize.TableHeader': tableHeaderResizeHandler,

    'scroll.TableHeader': tableHeaderOnScrollHandler
  });

  $(document).on({
    'columnschange.TableHeader': tableHeaderResizeHandler,

    'drupalViewportOffsetChange.TableHeader': tableHeaderOffsetChangeHandler
  });

  $.extend(TableHeader, {
    tables: []
  });

  $.extend(TableHeader.prototype, {
    minHeight: 100,

    tableOffset: null,

    tableHeight: null,

    stickyVisible: false,

    setOffsetTop: function setOffsetTop() {
      var offsetTop = 0;

      if (!document.querySelector('body').classList.contains('gin--classic-toolbar')) {
        if (window.innerWidth < 976) {
          offsetTop = document.querySelector('#toolbar-bar').clientHeight - 2;
        } else {
          offsetTop = document.querySelector('#toolbar-bar').clientHeight + document.querySelector('.region-sticky').clientHeight - 2;
        }
      } else if (document.querySelector('body').classList.contains('toolbar-tray-open')) {
        offsetTop = 79;
      } else {
        offsetTop = 39;
      }

      return offsetTop;
    },
    createSticky: function createSticky() {
      var $stickyHeader = this.$originalHeader.clone(true);

      this.$stickyTable = $('<table class="sticky-header"></table>').css({
        visibility: 'hidden',
        position: 'fixed',
        top: '0px'
      }).append($stickyHeader).insertBefore(this.$originalTable);

      this.$stickyHeaderCells = $stickyHeader.find('> tr > th');

      this.recalculateSticky();
    },
    stickyPosition: function stickyPosition(offsetTop, offsetLeft) {
      var css = {};

      offsetTop = this.setOffsetTop();

      if (typeof offsetTop === 'number') {
        css.top = offsetTop + 'px';
      }
      if (typeof offsetLeft === 'number') {
        css.left = this.tableOffset.left - offsetLeft + 'px';
      }
      return this.$stickyTable.css(css);
    },
    checkStickyVisible: function checkStickyVisible() {
      var scrollTop = scrollValue('scrollTop');
      var headerTop = 0;
      var visible = false;

      headerTop = this.setOffsetTop();

      var tableTop = this.tableOffset.top - headerTop;
      var tableBottom = tableTop + this.tableHeight;

      if (tableTop < scrollTop && scrollTop < tableBottom - this.minHeight) {
        visible = true;
      }

      this.stickyVisible = visible;
      return visible;
    },
    onScroll: function onScroll(e) {
      this.checkStickyVisible();

      this.stickyPosition(null, scrollValue('scrollLeft'));
      this.$stickyTable.css('visibility', this.stickyVisible ? 'visible' : 'hidden');
    },
    recalculateSticky: function recalculateSticky(event) {
      this.tableHeight = this.$originalTable[0].clientHeight;

      // displace.offsets.top = displace.calculateOffset('top');
      displace.offsets.top = this.setOffsetTop();

      this.tableOffset = this.$originalTable.offset();
      this.stickyPosition(displace.offsets.top, scrollValue('scrollLeft'));

      var $that = null;
      var $stickyCell = null;
      var display = null;

      var il = this.$originalHeaderCells.length;
      for (var i = 0; i < il; i++) {
        $that = $(this.$originalHeaderCells[i]);
        $stickyCell = this.$stickyHeaderCells.eq($that.index());
        display = $that.css('display');
        if (display !== 'none') {
          $stickyCell.css({ width: $that.css('width'), display: display });
        } else {
          $stickyCell.css('display', 'none');
        }
      }
      this.$stickyTable.css('width', this.$originalTable.outerWidth());
    }
  });

  Drupal.TableHeader = TableHeader;
})(jQuery, Drupal, window.Drupal.displace);
