import { AfterChangeHook, BeforeChangeHook } from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { Access, CollectionConfig } from "payload/types";
import { Product, User } from "../../payload-types";
import { stripe } from "../../lib/stripe";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => ({
  ...data,
  user: req.user.id,
});

const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
  });

  if (!fullUser || typeof fullUser !== 'object') return;

  const userProductIDs = new Set<string>(
    fullUser.products?.map((product) =>
      typeof product === 'object' ? product.id : product
    ) || []
  );

  userProductIDs.add(doc.id);

  await req.payload.update({
    collection: 'users',
    id: fullUser.id,
    data: {
      products: Array.from(userProductIDs),
    },
  });
};

const isAdminOrHasAccess = (): Access => ({ req }) => {
  const user = req.user as User | undefined;

  if (!user) return false;
  if (user.role === 'admin') return true;

  const userProductIDs = new Set<string>(
    (user.products || []).map((product) =>
      typeof product === 'string' ? product : product.id
    )
  );

  return { id: { in: Array.from(userProductIDs) } };
};

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      async (args) => {
        const { operation, data } = args;

        if (operation === 'create') {
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: 'USD',
              unit_amount: Math.round(data.price * 100),
            },
          });

          return {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };
        } else if (operation === 'update' && data.stripeId) {
          const updatedProduct = await stripe.products.update(data.stripeId, {
            name: data.name,
            default_price: data.priceId,
          });

          return {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          };
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product details',
    },
    {
      name: 'price',
      label: 'Price in USD',
      min: 0,
      max: 1000,
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: 'product_files',
      label: 'Product file(s)',
      type: 'relationship',
      required: true,
      relationTo: 'product_files',
      hasMany: false,
    },
    {
      name: 'approvedForSale',
      label: 'Product Status',
      type: 'select',
      defaultValue: 'pending',
      access: {
        create: ({ req }) => req.user.role === 'admin',
        read: ({ req }) => req.user.role === 'admin',
        update: ({ req }) => req.user.role === 'admin',
      },
      options: [
        { label: 'Pending verification', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Denied', value: 'denied' },
      ],
    },
    {
      name: 'priceId',
      access: { create: () => false, read: () => false, update: () => false },
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'stripeId',
      access: { create: () => false, read: () => false, update: () => false },
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: { singular: 'Image', plural: 'Images' },
      fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
    },
  ],
};
