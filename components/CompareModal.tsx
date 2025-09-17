import React from 'react';

type Product = {
  id: string;
  name: string;
  price?: number;
  rating?: number;
};

type CompareModalProps = {
  products: Product[];
  onClose: () => void;
};

export default function CompareModal({ products, onClose }: CompareModalProps) {
  return (
    <div className="compare-modal">
      <button onClick={onClose}>Close</button>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{(p.price ?? 0).toFixed(2)}</td>
              <td>{(p.rating ?? 0).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}