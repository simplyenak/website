// Simply Enak Conversion Tracking Setup
// Add to: /src/layouts/Layout.astro before </head>

<!-- Google Analytics 4 - Enhanced Conversion Tracking -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script is:inline>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Replace GA_MEASUREMENT_ID with your actual ID (262711985)
  gtag('config', 'GA_MEASUREMENT_ID', {
    'enhanced_conversion': true,
    'allow_google_signals': true,
    'custom_map': {'custom_parameter_1': 'tour_name'}
  });
</script>

<!-- TicketingHub Conversion Tracking -->
<script is:inline>
  // Track when TicketingHub widget loads
  window.addEventListener('load', function() {
    if (typeof window.THCheckout !== 'undefined') {
      window.THCheckout.on('checkout_completed', function(data) {
        // Send conversion to GA4
        gtag('event', 'purchase', {
          'transaction_id': data.id,
          'value': parseFloat(data.total),
          'currency': 'MYR',
          'items': [{
            'item_id': window.location.pathname.split('/').pop(),
            'item_name': document.title.split(' - ')[0],
            'category': 'food_tour',
            'quantity': 1,
            'price': parseFloat(data.total)
          }]
        });
        
        // Track for Simply Enak analytics
        console.log('Conversion tracked:', data);
      });
      
      window.THCheckout.on('checkout_started', function(data) {
        gtag('event', 'begin_checkout', {
          'items': [{
            'item_id': window.location.pathname.split('/').pop(),
            'item_name': document.title.split(' - ')[0],
            'category': 'food_tour'
          }]
        });
      });
    }
  });
</script>

<!-- Enhanced E-commerce Tracking -->
<script is:inline>
  // Track tour page views with enhanced data
  function trackTourPageView() {
    const tourName = document.title.split(' - ')[0];
    const tourPrice = document.querySelector('[data-price]')?.getAttribute('data-price') || '0';
    const tourLocation = document.querySelector('[data-location]')?.getAttribute('data-location') || 'Unknown';
    
    gtag('event', 'view_item', {
      'item_list_name': 'Food Tours',
      'items': [{
        'item_id': window.location.pathname.split('/').pop(),
        'item_name': tourName,
        'category': 'food_tour',
        'location_id': tourLocation,
        'price': parseFloat(tourPrice.replace(/[^0-9.]/g, ''))
      }]
    });
  }
  
  // Track CTA clicks
  document.addEventListener('click', function(e) {
    if (e.target.closest('a[href*="ticketinghub"]') || e.target.closest('button[data-widget]')) {
      gtag('event', 'select_item', {
        'item_list_name': 'Food Tours',
        'items': [{
          'item_id': window.location.pathname.split('/').pop(),
          'item_name': document.title.split(' - ')[0],
          'category': 'food_tour'
        }]
      });
    }
  });
</script>