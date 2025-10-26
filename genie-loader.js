(function() {
  'use strict';

  // Detect shop domain
  const script = document.currentScript;
  const shopDomain = script.dataset.shop || 
                    (window.Shopify && window.Shopify.shop) || 
                    window.location.hostname;

  console.log('Aladdyn Genie loaded for ' + shopDomain);

  // Prevent multiple loads
  if (window.AladdynGenieLoaded) return;
  window.AladdynGenieLoaded = true;

  // Configuration
  const config = {
    shopDomain: shopDomain,
    bundleUrl: script.src.replace('genie-loader.js', 'chatbot.bundle.js'),
    reactUrl: 'https://unpkg.com/react@18/umd/react.production.min.js',
    reactDomUrl: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'
  };

  // Load script helper
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Initialize chatbot
  async function initializeChatbot() {
    try {
      // Load React if not available
      if (!window.React) {
        await loadScript(config.reactUrl);
      }
      if (!window.ReactDOM) {
        await loadScript(config.reactDomUrl);
      }

      // Load chatbot bundle
      await loadScript(config.bundleUrl);

      // Create container
      const container = document.createElement('div');
      container.id = 'aladdyn-genie-chatbot';
      container.dataset.shop = config.shopDomain;
      document.body.appendChild(container);

      // Render chatbot
      if (window.AladdynChatbot && window.AladdynReactDOM) {
        window.AladdynReactDOM.render(
          window.AladdynReact.createElement(window.AladdynChatbot, { 
            shopDomain: config.shopDomain 
          }), 
          container
        );
      }

    } catch (error) {
      console.error('Failed to load Aladdyn Genie:', error);
    }
  }

  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
  } else {
    initializeChatbot();
  }
})();