import React from 'react';

type Product = {
  id: string;
  title: string;
  price?: number;
  discount?: number;
};

type Props = {
  product: Product;
  onClick?: () => void;
};

export default function ProductCard({ product, onClick }: Props) {
  const price = product.price ?? 0;
  const discount = product.discount ?? 0;
  const finalPrice = price - discount;

  return (
    <div className="product-card" onClick={onClick}>
      <h3>{product.title}</h3>
      <p>Price: ${price.toFixed(2)}</p>
      <p>Discount: ${discount.toFixed(2)}</p>
      <p>Final: ${finalPrice.toFixed(2)}</p>
    </div>
  );
}