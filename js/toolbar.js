/* eslint-disable func-names, no-mutable-exports, comma-dangle, strict */

((Drupal, drupalSettings, once) => {
  Drupal.behaviors.tonicToolbar = {
    attach: (context) => {
      Drupal.tonicToolbar.init(context);
    },

  };

  Drupal.tonicToolbar = {
    init: function (context) {
      once('tonicToolbarInit', '#gin-toolbar-bar', context).forEach(() => {
        const toolbarTrigger = document.querySelector('.toolbar-menu__trigger');

        // Check for Drupal trayVerticalLocked and remove it.
        if (drupalSettings.tonic.toolbar_variant != 'classic' && localStorage.getItem('Drupal.toolbar.trayVerticalLocked')) {
          localStorage.removeItem('Drupal.toolbar.trayVerticalLocked');
        }

        // Set sidebarState.
        if (localStorage.getItem('Drupal.tonic.toolbarExpanded') === 'true') {
          document.body.setAttribute('data-toolbar-menu', 'open');
          toolbarTrigger.classList.add('is-active');
        }
        else {
          document.body.setAttribute('data-toolbar-menu', '');
          toolbarTrigger.classList.remove('is-active');
        }

        // Show toolbar navigation with shortcut:
        // OPTION + T (Mac) / ALT + T (Windows)
        document.addEventListener('keydown', e => {
          if (e.altKey === true && e.code === 'KeyT') {
            this.toggleToolbar();
          }
        });
      });

      // Toolbar toggle
      once('tonicToolbarToggle', '.toolbar-menu__trigger', context).forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        this.toggleToolbar();
      }));
    },

    toggleToolbar: () => {
      const toolbarTrigger = document.querySelector('.toolbar-menu__trigger');

      // Toggle active class.
      toolbarTrigger.classList.toggle('is-active');

      // Set active state.
      let active = 'true';
      if (toolbarTrigger.classList.contains('is-active')) {
        document.body.setAttribute('data-toolbar-menu', 'open');
      }
      else {
        document.body.setAttribute('data-toolbar-menu', '');
        active = 'false';
        const elementToRemove = document.querySelector('.tonic-toolbar-inline-styles');
        if (elementToRemove) {
          elementToRemove.parentNode.removeChild(elementToRemove);
        }
      }

      // Write state to localStorage.
      localStorage.setItem('Drupal.tonic.toolbarExpanded', active);

      // Dispatch event.
      const event = new CustomEvent('toolbar-toggle', { detail: active === 'true'})
      document.dispatchEvent(event);
    },

  };

})(Drupal, drupalSettings, once);
