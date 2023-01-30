import {
  sendShopifyAnalytics,
  getClientBrowserParameters,
  AnalyticsEventName,
  useShopifyCookies,
} from '@shopify/storefront-kit-react';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

function sendPageView(analyticsPageData) {
  const payload = {
    ...getClientBrowserParameters(),
    ...analyticsPageData,
  };
  sendShopifyAnalytics({
    eventName: AnalyticsEventName.PAGE_VIEW,
    payload,
  });
}

// Hook into your router's page change events to fire this analytics event:
// for example, in NextJS:

const analyticsShopData = {
  shopId: 'gid://shopify/Shop/{your-shop-id}',
  currency: 'USD',
  acceptedLanguage: 'en',
};

export default function App({Component, pageProps}) {
  const router = useRouter();

  // eslint-disable-next-line no-undef
  const hasUserConsent = yourFunctionToDetermineIfUserHasConsent();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const analytics = {
    hasUserConsent,
    ...analyticsShopData,
    ...pageProps.analytics,
  };
  const pagePropsWithAppAnalytics = {
    ...pageProps,
    analytics,
  };

  useEffect(() => {
    const handleRouteChange = () => {
      sendPageView(analytics);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [analytics, router.events]);

  useShopifyCookies();

  return <Component {...pagePropsWithAppAnalytics} />;
}