import { Access, CollectionConfig } from "payload/types";

type Request = {
  req: {
    user: {
      role: string;
      id: string;
    };
  };
};

const isAdmin = (req: Request["req"]) => req.user.role === 'admin';

const yourOwn: Access = ({ req }: Request) => isAdmin(req) ? true : { user: { equals: req.user?.id } };

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'Your Orders',
    description: 'A summary of all your orders on FlashCommerce.',
  },
  access: {
    read: yourOwn,
    update: ({ req }: Request) => isAdmin(req),
    delete: ({ req }: Request) => isAdmin(req),
    create: ({ req }: Request) => isAdmin(req),
  },
  fields: [
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: ({ req }: Request) => isAdmin(req),
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      admin: {
        hidden: true,
      },
      relationTo: 'users',
      required: true,
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: true,
    },
  ],
};
