((Drupal, drupalSettings, once) => {
  Drupal.behaviors.tonicAccent = {
    attach: function(context) {
      once("tonicAccent", "body", context).forEach((() => {
        Drupal.tonicAccent.checkDarkmode(), Drupal.tonicAccent.setAccentColor(), Drupal.tonicAccent.setFocusColor();
      }));
    }
  }, Drupal.tonicAccent = {
    setAccentColor: function() {
      let preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      const accentColorPreset = null != preset ? preset : drupalSettings.tonic.preset_accent_color;
      document.body.setAttribute("data-tonic-accent", accentColorPreset), "custom" === accentColorPreset && this.setCustomAccentColor(color);
    },
    setCustomAccentColor: function() {
      let color = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, element = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.body;
      const accentColor = null != color ? color : drupalSettings.tonic.accent_color;
      if (accentColor) {
        this.clearAccentColor(element);
        const strippedAccentColor = accentColor.replace("#", ""), darkAccentColor = this.mixColor("ffffff", strippedAccentColor, 65).replace("#", ""), style = document.createElement("style");
        style.className = "tonic-custom-colors", style.innerHTML = `\n          [data-tonic-accent="custom"] {\n            --tonic-color-primary-rgb: ${this.hexToRgb(accentColor)};\n            --tonic-color-primary-hover: ${this.shadeColor(accentColor, -10)};\n            --tonic-color-primary-active: ${this.shadeColor(accentColor, -15)};\n            --tonic-bg-app-rgb: ${this.hexToRgb(this.mixColor("ffffff", strippedAccentColor, 97))};\n            --tonic-bg-header: ${this.mixColor("ffffff", strippedAccentColor, 85)};\n            --tonic-color-sticky-rgb: ${this.hexToRgb(this.mixColor("ffffff", strippedAccentColor, 92))};\n          }\n          .tonic--dark-mode[data-tonic-accent="custom"],\n          .tonic--dark-mode [data-tonic-accent="custom"] {\n            --tonic-color-primary-rgb: ${this.hexToRgb(darkAccentColor)};\n            --tonic-color-primary-hover: ${this.mixColor("ffffff", strippedAccentColor, 55)};\n            --tonic-color-primary-active: ${this.mixColor("ffffff", strippedAccentColor, 50)};\n            --tonic-bg-header: ${this.mixColor("2A2A2D", darkAccentColor, 88)};\n          }\n        `, 
        element.append(style);
      }
    },
    clearAccentColor: function() {
      let element = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.body;
      if (element.querySelectorAll(".tonic-custom-colors").length > 0) {
        const removeElement = element.querySelector(".tonic-custom-colors");
        removeElement.parentNode.removeChild(removeElement);
      }
    },
    setFocusColor: function() {
      let preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      const focusColorPreset = null != preset ? preset : drupalSettings.tonic.preset_focus_color;
      document.body.setAttribute("data-tonic-focus", focusColorPreset), "custom" === focusColorPreset && this.setCustomFocusColor(color);
    },
    setCustomFocusColor: function() {
      let color = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, element = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.body;
      const accentColor = null != color ? color : drupalSettings.tonic.focus_color;
      if (accentColor) {
        this.clearFocusColor(element);
        const strippedAccentColor = accentColor.replace("#", ""), darkAccentColor = this.mixColor("ffffff", strippedAccentColor, 65), style = document.createElement("style");
        style.className = "tonic-custom-focus", style.innerHTML = `\n          [data-tonic-focus="custom"] {\n            --tonic-color-focus: ${accentColor};\n          }\n          .tonic--dark-mode[data-tonic-focus="custom"],\n          .tonic--dark-mode [data-tonic-focus="custom"] {\n            --tonic-color-focus: ${darkAccentColor};\n          }`, 
        element.append(style);
      }
    },
    clearFocusColor: function() {
      let element = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.body;
      if (element.querySelectorAll(".tonic-custom-focus").length > 0) {
        const removeElement = element.querySelector(".tonic-custom-focus");
        removeElement.parentNode.removeChild(removeElement);
      }
    },
    checkDarkmode: () => {
      const darkmodeClass = drupalSettings.tonic.darkmode_class;
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e => {
        e.matches && "auto" === localStorage.getItem("Drupal.tonic.darkmode") && document.querySelector("html").classList.add(darkmodeClass);
      })), window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e => {
        e.matches && "auto" === localStorage.getItem("Drupal.tonic.darkmode") && document.querySelector("html").classList.remove(darkmodeClass);
      }));
    },
    hexToRgb: hex => {
      hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(m, r, g, b) {
        return r + r + g + g + b + b;
      }));
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    },
    mixColor: (color_1, color_2, weight) => {
      function h2d(h) {
        return parseInt(h, 16);
      }
      weight = void 0 !== weight ? weight : 50;
      for (var color = "#", i = 0; i <= 5; i += 2) {
        for (var v1 = h2d(color_1.substr(i, 2)), v2 = h2d(color_2.substr(i, 2)), val = Math.floor(v2 + weight / 100 * (v1 - v2)).toString(16); val.length < 2; ) val = "0" + val;
        color += val;
      }
      return color;
    },
    shadeColor: (color, percent) => {
      const num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 255) + amt, G = (255 & num) + amt;
      return `#${(16777216 + 65536 * (R < 255 ? R < 1 ? 0 : R : 255) + 256 * (B < 255 ? B < 1 ? 0 : B : 255) + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1)}`;
    }
  };
})(Drupal, drupalSettings, once);