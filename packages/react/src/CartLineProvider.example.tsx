import {CartLineProvider, useCartLine} from '@shopify/storefront-kit-react';
import type {Cart} from '@shopify/storefront-kit-react/storefront-api-types';

export function CartWrapper({cart}: {cart: Cart}) {
  const firstCartLine = cart.lines.nodes[0];
  return (
    <CartLineProvider line={firstCartLine}>
      <CartLineQuantity />
    </CartLineProvider>
  );
}

function CartLineQuantity() {
  const cartLine = useCartLine();

  return <div>{cartLine.quantity}</div>;
}
