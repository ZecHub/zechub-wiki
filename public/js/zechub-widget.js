/**
 * ZecHub Dashboard Embeddable Widget
 * Version: 1.0.0
 *
 * Embeds only the ZcashChart component from ZecHub Dashboard
 *
 * Usage:
 * <div class="zechub-widget" data-theme="dark"></div>
 * <script src="zechub-widget.js"></script>
 *
 * Documentation: https://github.com/ZecHub/zechub-wiki
 */

(function () {
  "use strict";

  // Configuration
  const ZECHUB_CHART_URL = "https://zechub.wiki/embed/zcash"; // Use main dashboard
  const DEFAULT_HEIGHT = "900px";
  const DEFAULT_WIDTH = "100%";

  // Default widget configuration
  const defaultConfig = {
    theme: "dark", // 'dark' or 'light'
    height: DEFAULT_HEIGHT,
    width: DEFAULT_WIDTH,
    border: "none",
    responsive: true,
    showHeader: true, // Show/hide chart header
    showControls: true, // Show/hide chart controls
  };

  /**
   * Initialize all ZecHub widgets on the page
   */
  function initWidgets() {
    const widgets = document.querySelectorAll(".zechub-widget");

    widgets.forEach((widget) => {
      // Skip already initialized widgets
      if (widget.dataset.initialized) return;

      const config = getWidgetConfig(widget);
      injectIframe(widget, config);

      // Mark as initialized
      widget.dataset.initialized = "true";
    });
  }

  /**
   * Extract configuration from data attributes
   * @param {HTMLElement} element - The widget container element
   * @returns {Object} Configuration object
   */
  function getWidgetConfig(element) {
    return {
      theme: element.dataset.theme || defaultConfig.theme,
      height: element.dataset.height || defaultConfig.height,
      width: element.dataset.width || defaultConfig.width,
      border: element.dataset.border || defaultConfig.border,
      responsive: element.dataset.responsive !== "false",
      showHeader: element.dataset.showHeader !== "false",
      showControls: element.dataset.showControls !== "false",
    };
  }

  /**
   * Build the iframe URL with query parameters
   * @param {Object} config - Widget configuration
   * @returns {string} Complete iframe URL
   */
  function buildIframeUrl(config) {
    const params = new URLSearchParams();

    // Add theme parameter
    if (config.theme) {
      params.append("theme", config.theme);
    }

    // Add header visibility parameter
    if (!config.showHeader) {
      params.append("hideHeader", "true");
    }

    // Add controls visibility parameter
    if (!config.showControls) {
      params.append("hideControls", "true");
    }

    // Add embed mode parameter
    params.append("embed", "true");

    // Construct the URL to the Zcash chart
    return params.toString()
      ? `${ZECHUB_CHART_URL}?${params.toString()}`
      : ZECHUB_CHART_URL;
  }

  /**
   * Create and inject iframe into the container
   * @param {HTMLElement} container - The widget container
   * @param {Object} config - Widget configuration
   */
  function injectIframe(container, config) {
    // Create iframe element
    const iframe = document.createElement("iframe");

    // Set iframe attributes
    iframe.src = buildIframeUrl(config);
    iframe.style.width = config.width;
    iframe.style.height = config.height;
    iframe.style.border = config.border;
    iframe.style.borderRadius = "8px";
    iframe.style.display = "block";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "auto");
    iframe.setAttribute("title", "ZecHub Zcash Chart");
    iframe.setAttribute("allow", "fullscreen");

    // Add responsive styling if enabled
    if (config.responsive) {
      iframe.style.maxWidth = "100%";
      container.style.position = "relative";
      container.style.overflow = "hidden";
    }

    // Create and add loading indicator
    const loader = createLoader();
    container.appendChild(loader);

    // Remove loader when iframe loads
    iframe.addEventListener("load", function () {
      setTimeout(function () {
        if (loader.parentNode) {
          loader.remove();
        }
      }, 300);
    });

    // Handle iframe load errors
    iframe.addEventListener("error", function () {
      loader.innerHTML = createErrorMessage();
    });

    // Inject iframe into container
    container.appendChild(iframe);

    // Setup responsive handling if enabled
    if (config.responsive) {
      setupResponsiveHandling(iframe);
    }

    // Setup message listener for iframe communication
    setupMessageListener(iframe);
  }

  /**
   * Create a loading indicator element
   * @returns {HTMLElement} Loading indicator
   */
  function createLoader() {
    const loader = document.createElement("div");
    loader.className = "zechub-widget-loader";
    loader.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      color: #666;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      z-index: 10;
    `;

    loader.innerHTML = `
      <div style="text-align: center;">
        <div class="zechub-spinner" style="
          border: 3px solid #f3f3f3;
          border-top: 3px solid #9333ea;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: zechub-spin 1s linear infinite;
          margin: 0 auto 15px;
        "></div>
        <p style="margin: 0; font-size: 14px; color: #666;">Loading Zcash Charts...</p>
      </div>
    `;

    // Add spinner animation if not already added
    if (!document.getElementById("zechub-widget-styles")) {
      const style = document.createElement("style");
      style.id = "zechub-widget-styles";
      style.textContent = `
        @keyframes zechub-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    return loader;
  }

  /**
   * Create error message HTML
   * @returns {string} Error message HTML
   */
  function createErrorMessage() {
    return `
      <div style="text-align: center; padding: 20px;">
        <div style="
          font-size: 40px;
          margin-bottom: 15px;
        ">⚠️</div>
        <p style="margin: 0; font-size: 14px; color: #e74c3c; font-weight: 600;">
          Failed to load Zcash Charts
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
          Please check your connection and try again
        </p>
      </div>
    `;
  }

  /**
   * Setup responsive iframe handling
   * @param {HTMLElement} iframe - The iframe element
   */
  function setupResponsiveHandling(iframe) {
    // Check if ResizeObserver is available
    if (typeof ResizeObserver === "undefined") {
      return; // Fallback: no responsive handling
    }

    const resizeObserver = new ResizeObserver(function (entries) {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        if (containerWidth > 0) {
          iframe.style.width = containerWidth + "px";
        }
      }
    });

    resizeObserver.observe(iframe.parentElement);

    // Store observer reference for potential cleanup
    iframe._resizeObserver = resizeObserver;
  }

  /**
   * Setup message listener for iframe communication
   * @param {HTMLElement} iframe - The iframe element
   */
  function setupMessageListener(iframe) {
    let lastHeight = 0;
    const HEIGHT_THRESHOLD = 6; // ignore tiny fluctuations
    const MIN_IFRAME_HEIGHT = 200; // pixels
    const MAX_IFRAME_HEIGHT = 880; // pixels (adjust to your biggest chart)

    window.addEventListener("message", function (event) {
      if (event.source !== iframe.contentWindow) return;
      if (!event.data || event.data.type !== "zechub-resize") return;

      let requested = parseInt(event.data.height, 10);
      if (isNaN(requested)) return;

      // clamp height
      requested = Math.max(
        MIN_IFRAME_HEIGHT,
        Math.min(MAX_IFRAME_HEIGHT, requested)
      );

      // apply only if it changed enough
      if (Math.abs(requested - lastHeight) > HEIGHT_THRESHOLD) {
        iframe.style.height = requested + "px";
        lastHeight = requested;
        // console.debug("[widget] applied new height:", requested);
      }
    });
  }

  /**
   * Public API
   */
  window.ZecHubWidget = {
    /**
     * Initialize or re-initialize all widgets
     */
    init: function () {
      initWidgets();
    },

    /**
     * Widget version
     */
    version: "1.0.0",

    /**
     * Configuration defaults (read-only)
     */
    defaults: Object.freeze({
      theme: defaultConfig.theme,
      height: defaultConfig.height,
      width: defaultConfig.width,
      border: defaultConfig.border,
      responsive: defaultConfig.responsive,
      showHeader: defaultConfig.showHeader,
      showControls: defaultConfig.showControls,
    }),
  };

  /**
   * Auto-initialize when DOM is ready
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidgets);
  } else {
    // DOM is already loaded
    initWidgets();
  }

  /**
   * Watch for dynamically added widgets (for SPAs)
   */
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(function (mutations) {
      let shouldInit = false;

      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          // Check if the added node is an element
          if (node.nodeType === 1) {
            // Check if it's a widget or contains widgets
            if (node.classList && node.classList.contains("zechub-widget")) {
              shouldInit = true;
            } else if (node.querySelectorAll) {
              const widgets = node.querySelectorAll(".zechub-widget");
              if (widgets.length > 0) {
                shouldInit = true;
              }
            }
          }
        });
      });

      if (shouldInit) {
        initWidgets();
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Console log for debugging
  console.log(
    "ZecHub Widget v" +
      window.ZecHubWidget.version +
      " initialized - Zcash Charts Only"
  );
})();
