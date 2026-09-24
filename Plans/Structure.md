project-root/
│
├── backend/
│   │
│   ├── manage.py
│   │
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── users/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── migrations/
│   │
│   ├── catalog/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── migrations/
│   │
│   ├── carts/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── migrations/
│   │
│   ├── orders/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── migrations/
│   │
│   └── payments/
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── services.py
│       ├── gateways/
│       │   └── zarinpal.py
│       └── migrations/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── ProductCard/
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Profile/
│   │   │   ├── Store/
│   │   │   ├── Product/
│   │   │   ├── Cart/
│   │   │   ├── Checkout/
│   │   │   ├── Orders/
│   │   │   └── OrderDetail/
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   │   └── payments.ts
│   │   │
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── product.ts
│   │   │   ├── cart.ts
│   │   │   ├── order.ts
│   │   │   └── payment.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── ...
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── bots/
│   │
│   ├── telegram/
│   │   ├── bot.py
│   │   ├── config.py
│   │   └── handlers/
│   │       └── start.py
│   │
│   └── bale/
│       ├── bot.py
│       ├── config.py
│       └── handlers/
│           └── start.py
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── business-rules.md
│
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md