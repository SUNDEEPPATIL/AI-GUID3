import React from 'react';

type Product = {
  id: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
};

type Props = {
  product?: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
  if (!product) {
    // Guard against null/undefined product
    return null;
  }

  const price = product.price ?? 0;
  const stock = product.stock ?? 0;

  return (
    <div className="product-modal">
      <button onClick={onClose}>Close</button>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${price.toFixed(2)}</p>
      <p>In stock: {stock}</p>
    </div>
  );
}