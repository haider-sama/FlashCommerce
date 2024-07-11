export const PRODUCT_CATEGORIES = [
    {
      label: 'Gift Cards',
      value: 'gift_cards' as const,
      featured: [
        {
          name: 'Popular Gift Cards',
          href: `/products?category=gift_cards`,
          imageSrc: '/nav/gift_cards/mixed.jpg',
        },
        {
          name: 'Steam Gift Cards',
          href: '/products?category=gift_cards&sort=desc',
          imageSrc: '/nav/gift_cards/new.jpg',
        },
        {
          name: 'Google Gift Cards',
          href: '/products?category=gift_cards',
          imageSrc: '/nav/gift_cards/top.jpg',
        },
      ],
    },
];
  