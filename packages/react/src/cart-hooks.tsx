import {useState, useCallback} from 'react';
import {useShop} from './ShopifyProvider.js';
import {flattenConnection} from './flatten-connection.js';
import {CartInput} from './storefront-api-types.js';
import {CartCreate, defaultCartFragment} from './cart-queries.js';
import {
  CartCreateMutation,
  CartCreateMutationVariables,
} from './graphql/CartCreateMutation.js';
import {Cart} from './types.js';
import {
  SHOPIFY_STOREFRONT_ID_HEADER,
  STOREFRONT_API_PUBLIC_TOKEN_HEADER,
  SHOPIFY_STOREFRONT_Y_HEADER,
  SHOPIFY_STOREFRONT_S_HEADER,
  SHOPIFY_Y,
  SHOPIFY_S,
} from './constants.js';
import {parse} from 'worktop/cookie';

export function useCartFetch() {
  const {storeDomain, storefrontApiVersion, storefrontToken, storefrontId} =
    useShop();

  return useCallback(
    <T, K>({
      query,
      variables,
    }: {
      query: string;
      variables: T;
    }): Promise<{data: K | undefined; errors: unknown}> => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-SDK-Variant': 'hydrogen',
        'X-SDK-Version': storefrontApiVersion,
        [STOREFRONT_API_PUBLIC_TOKEN_HEADER]: storefrontToken,
      };

      if (storefrontId) {
        headers[SHOPIFY_STOREFRONT_ID_HEADER] = storefrontId;
      }

      // Find Shopify cookies
      const cookieData = parse(document.cookie);
      if (cookieData[SHOPIFY_Y] && cookieData[SHOPIFY_S]) {
        headers[SHOPIFY_STOREFRONT_Y_HEADER] = cookieData[SHOPIFY_Y];
        headers[SHOPIFY_STOREFRONT_S_HEADER] = cookieData[SHOPIFY_S];
      }

      return fetch(
        `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query: query.toString(),
            variables,
          }),
        }
      )
        .then((res) => res.json())
        .catch((error) => {
          return {
            data: undefined,
            errors: error.toString(),
          };
        });
    },
    [storeDomain, storefrontApiVersion, storefrontToken, storefrontId]
  );
}

export function useInstantCheckout() {
  const [cart, updateCart] = useState<Cart | undefined>();
  const [checkoutUrl, updateCheckoutUrl] = useState<Cart['checkoutUrl']>();
  const [error, updateError] = useState<string | undefined>();

  const fetch = useCartFetch();

  const createInstantCheckout = useCallback(
    async (cartInput: CartInput) => {
      const {data, errors} = await fetch<
        CartCreateMutationVariables,
        CartCreateMutation
      >({
        query: CartCreate(defaultCartFragment),
        variables: {
          input: cartInput,
        },
      });

      if (errors) {
        updateError(errors.toString());
        updateCart(undefined);
        updateCheckoutUrl(undefined);
      }

      if (data?.cartCreate?.cart) {
        const dataCart = data.cartCreate.cart;
        updateCart({
          ...dataCart,
          lines: flattenConnection(dataCart.lines),
          note: dataCart.note ?? undefined,
        });
        updateCheckoutUrl(dataCart.checkoutUrl);
      }
    },
    [fetch]
  );

  return {cart, checkoutUrl, error, createInstantCheckout};
}