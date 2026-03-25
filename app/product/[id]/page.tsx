'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products, dietaryAddons, cakeFillings } from '@/lib/products';
import { useCart } from '@/context/CartContext';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const product = products.find((p) => p.id === params.id);
  const { items, addItem, updateItem, removeItem } = useCart();

  const editCartItemId = searchParams.get('edit');
  const editingItem = editCartItemId ? items.find((i) => i.id === editCartItemId) : null;

  const storageKey = `product-selections-${params.id}`;

  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<number>(0);
  const [selectedFilling, setSelectedFilling] = useState<string>(product?.category === 'cakes' ? 'vanilla-buttercream' : '');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(product?.minOrder || 1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Restore selections from edit param or sessionStorage on mount
  useEffect(() => {
    if (initialized) return;

    if (editingItem) {
      setSelectedFlavors(editingItem.flavor.split(', '));
      setSelectedColor(editingItem.color || '');
      setSelectedSize(editingItem.size || 0);
      setSelectedFilling(editingItem.filling || (product?.category === 'cakes' ? 'vanilla-buttercream' : ''));
      setSelectedAddons([...editingItem.dietaryOptions]);
      setNotes(editingItem.notes || '');
      setQuantity(editingItem.quantity);
      setInitialized(true);
      return;
    }

    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedFlavors(data.flavors || []);
        setSelectedColor(data.color || '');
        setSelectedSize(data.size || 0);
        setSelectedFilling(data.filling || (product?.category === 'cakes' ? 'vanilla-buttercream' : ''));
        setSelectedAddons(data.addons || []);
        setNotes(data.notes || '');
        const savedQuantity = data.quantity || (product?.minOrder || 1);
        setQuantity(Math.max(savedQuantity, product?.minOrder || 1));
      } catch {}
    } else if (product?.minOrder) {
      setQuantity(product.minOrder);
    }
    setInitialized(true);
  }, [editingItem, initialized, storageKey]);

  // Save selections to sessionStorage whenever they change
  useEffect(() => {
    if (!initialized || editCartItemId) return;
    sessionStorage.setItem(
      storageKey,
      JSON.stringify({
        flavors: selectedFlavors,
        color: selectedColor,
        size: selectedSize,
        filling: selectedFilling,
        addons: selectedAddons,
        notes,
        quantity,
      })
    );
  }, [selectedFlavors, selectedColor, selectedSize, selectedFilling, selectedAddons, notes, quantity, initialized, editCartItemId, storageKey]);

  if (!product) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Mock images for gallery (in real app, these would come from product data)
  // const images = [1, 2, 3, 4];

  const maxFlavorCount = product.maxFlavors || 1;

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(flavor)) {
        return prev.filter((f) => f !== flavor);
      } else {
        if (prev.length < maxFlavorCount) {
          return [...prev, flavor];
        }
        return prev;
      }
    });
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotalPrice = () => {
    const sizePrice = product.sizes && product.sizes.length > 0
      ? product.sizes[selectedSize].price
      : product.basePrice;
    let total = sizePrice * quantity;
    if (selectedFilling) {
      const filling = cakeFillings.find((f) => f.id === selectedFilling);
      if (filling) total += filling.price * quantity;
    }
    selectedAddons.forEach((addonId) => {
      const addonPrice = product.dietaryPrices?.[addonId] ?? dietaryAddons.find((a) => a.id === addonId)?.price ?? 0;
      total += addonPrice * quantity;
    });
    return total;
  };

  const needsColor = product.colors && product.colors.length > 0;

  const handleAddToCart = () => {
    if (selectedFlavors.length === 0) return;
    if (needsColor && !selectedColor) return;

    const itemPrice = calculateTotalPrice() / quantity; // Price per item including addons

    const newItem = {
      id: editCartItemId || `${product.id}-${selectedFlavors.sort().join('-')}-${selectedAddons.sort().join('-')}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      flavor: selectedFlavors.join(', '),
      color: selectedColor || undefined,
      size: product.sizes && product.sizes.length > 0 ? selectedSize : undefined,
      filling: selectedFilling || undefined,
      dietaryOptions: selectedAddons,
      quantity: quantity,
      price: itemPrice,
      image: product.image,
      notes: notes || undefined,
    };

    if (editCartItemId) {
      updateItem(editCartItemId, newItem);
      router.push('/cart');
      return;
    }

    addItem(newItem);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-gray-900">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden mb-4">
              <div className="absolute inset-4">
                <Image
                  src={
                    product.colors
                      ? selectedColor === 'Pink' && product.secondaryImage
                        ? product.secondaryImage
                        : product.image
                      : activeImage === 0
                      ? product.image
                      : (product.secondaryImage || product.image)
                  }
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* Thumbnails */}
            {product.secondaryImage && !product.colors && (
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveImage(0)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === 0 ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                </button>
                <button
                  onClick={() => setActiveImage(1)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    activeImage === 1 ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={product.secondaryImage} alt={`${product.name} - alternate`} fill className="object-contain p-1" />
                </button>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-3xl font-bold text-gray-900">
                ${calculateTotalPrice().toFixed(2)}
              </span>
              <span className="text-gray-500 ml-2">
                (Base: ${product.basePrice})
              </span>
            </div>

            {/* Flavor Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Select Flavor{maxFlavorCount > 1 && `(s) - Choose up to ${maxFlavorCount}`} <span className="text-red-500">*</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => toggleFlavor(flavor)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedFlavors.includes(flavor)
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
              {maxFlavorCount > 1 && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedFlavors.length}/{maxFlavorCount} selected
                </p>
              )}
            </div>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Select Colour <span className="text-red-500">*</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        selectedColor === color
                          ? 'bg-gray-900 text-white shadow-md'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection (if applicable) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                {product.sizes.length === 1 ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {product.sizes[0].name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {product.sizes[0].serves}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        ${product.sizes[0].price}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(index)}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                          selectedSize === index
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-sm">{size.name}</div>
                        <div className="text-sm">${size.price}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Filling Selection (cakes only) */}
            {product.category === 'cakes' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Filling
                </h3>
                <div className="space-y-3">
                  {cakeFillings.map((filling) => (
                    <label
                      key={filling.id}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedFilling === filling.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="filling"
                          value={filling.id}
                          checked={selectedFilling === filling.id}
                          onChange={() => setSelectedFilling(filling.id)}
                          className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                        />
                        <span className={`ml-3 font-medium ${selectedFilling === filling.id ? 'text-white' : 'text-gray-900'}`}>
                          {filling.name}
                          {filling.id === 'vanilla-buttercream' && (
                            <span className={`text-sm ml-2 ${selectedFilling === filling.id ? 'text-gray-300' : 'text-gray-500'}`}>(Default)</span>
                          )}
                        </span>
                      </div>
                      <span className={`font-semibold ${selectedFilling === filling.id ? 'text-white' : 'text-gray-900'}`}>
                        {filling.price > 0 ? `+$${filling.price}` : 'Included'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Add-ons */}
            {product.id !== 'party-wedding-favours' && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Dietary Options (Optional)
                </h3>
                <div className="space-y-3">
                  {dietaryAddons.map((addon) => (
                    <label
                      key={addon.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedAddons.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-500"
                        />
                        <span className="ml-3 text-gray-900 font-medium">
                          {addon.name}
                        </span>
                      </div>
                      <span className="text-gray-900 font-semibold">
                        +${product.dietaryPrices?.[addon.id] ?? addon.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Field */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Special Instructions - Specify Colours (Optional)
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specify your preferred colours, any special requests, dietary restrictions, or custom messages..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Maximum 500 characters
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(product.minOrder || 1, quantity - 1))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
              {product.minOrder && (
                <p className="text-sm text-gray-600 mt-2">
                  Minimum order: {product.minOrder}
                </p>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="relative">
              {showSuccess && (
                <div className="absolute -top-16 left-0 right-0 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg text-center font-semibold">
                  ✓ Added to cart!
                </div>
              )}
              <button
                onClick={handleAddToCart}
                disabled={selectedFlavors.length === 0 || (needsColor && !selectedColor)}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  selectedFlavors.length > 0 && (!needsColor || selectedColor)
                    ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedFlavors.length === 0
                  ? `Please Select ${maxFlavorCount > 1 ? `up to ${maxFlavorCount}` : 'a'} Flavor`
                  : needsColor && !selectedColor
                  ? 'Please Select a Colour'
                  : (editCartItemId ? 'Update Cart' : 'Add to Cart')}
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="w-full mt-3 py-4 rounded-lg font-bold text-lg bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 transition-all"
              >
                View Cart
              </button>
            </div>

            {/* Product Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Handcrafted with premium ingredients</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Same-day delivery available</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Customization options available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {products
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                    <div className="relative aspect-square bg-white">
                      <div className="absolute inset-3">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-gray-900">
                        ${relatedProduct.basePrice}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
