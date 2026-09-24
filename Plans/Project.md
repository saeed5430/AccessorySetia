# Telegram Mini App for Accessories & Jewelry Wholesale

## Overview

The goal of this project is to build a Telegram Mini App for wholesale accessories and jewelry businesses. The application will streamline product presentation, order collection, and customer purchasing workflows through a simple and efficient mobile experience.

---

# Problem Statement

## Seller Problems

* Introducing products to new customers is time-consuming.
* Orders are collected through phone calls and messaging apps, resulting in inefficient workflows.
* Manual order processing increases the risk of human errors.
* Managing previous orders is difficult.
* Answering repetitive customer inquiries consumes significant time.

## Customer Problems

* Customers do not have quick access to available products.
* Placing an order requires direct communication with the seller.
* Purchase history is not easily accessible.
* The ordering process is slower than necessary.

---

# Solution

Develop a Telegram Mini App that:

* Displays products in a structured catalog.
* Enables customers to place orders within a few minutes.
* Provides access to previous purchases.
* Supports online payment integration.
* Serves as a product showcase and marketing channel.

---

# User Profile

After logging in through Telegram, users complete the following profile information:

| Field         | Required |
| ------------- | -------- |
| Telegram ID   | Yes      |
| Full Name     | Yes      |
| Mobile Number | Yes      |
| Address       | Yes      |
| Postal Code   | No       |

---

# Product Catalog

## Product

Represents the base product information.

### Fields

* Category
* Name
* Slug
* Description
* Is Active
* Created At
* Updated At

### Business Rules

* Each product belongs to a single category.
* A product can have multiple variants.
* Only active products are visible to customers.

---

## Product Variant

Represents a specific combination of product, color, and size.

### Fields

* Product
* Color
* Size
* Image
* Price
* In Stock (Boolean)
* Is Active
* Created At
* Updated At

### Business Rules

* Each variant has exactly one image.
* Pricing is defined at the variant level.
* Product availability is controlled using a boolean stock field.
* The combination of Product + Color + Size must be unique.

### Unique Constraint

```text
(product, color, size)
```

---

# Store

## Product Listing

Each product variant displays:

* Image
* Product Name
* Color
* Size
* Price

### Visibility Conditions

Only variants matching the following criteria are displayed:

```text
is_active = True
stock = True
```

---

## Search

Customers can search products by:

* Product Name

---

## Category Filter

Products can be filtered by category.

---

# Shopping Cart

## Cart

Represents the active shopping cart for a user.

### Business Rules

* Each user can have one active cart at a time.
* A cart contains multiple cart items.

---

## Cart Item

Represents an item inside a cart.

### Fields

* Product Variant
* Quantity

### Business Rules

* A cart can contain multiple cart items.
* Quantities can be updated by the customer.
* Items can be removed from the cart.

---

# Checkout

After the customer finalizes the cart:

* Order is created.
* Total amount is calculated.
* User is redirected to the payment process.

---

# Order

An order is created after checkout.

## Purpose

Order data must be frozen at the time of purchase to ensure that future product or pricing changes do not affect historical orders.

---

## Order Status

### Unpaid

The order has been created but payment has not been completed.

### Paid

Payment has been successfully completed.

---

## Frozen Data

The following information is stored within the order:

* Product Name
* Color
* Size
* Unit Price
* Quantity
* Total Amount

---

# Customer Features (MVP)

* Login with Telegram
* Complete Profile
* Browse Products
* Search Products
* View Product Details
* Add Products to Cart
* Manage Shopping Cart
* Checkout
* View Previous Orders
* View Order Details

---

# Admin Features (MVP)

## Product Management

* Create Products
* Update Products
* Disable Products
* Manage Product Variants

## Order Management

* View Orders
* View Customer Information
* View Order Details

---

# Future Features

## Online Payments

* ZarinPal Integration
* Payment Verification
* Callback Handling

## Marketing

* Promotional Banners
* Featured Products
* New Product Announcements

## Customer Experience

* Reorder Previous Purchases
* Favorite Products
* Product Recommendations

## Notifications

* Telegram Bot Notifications
* Order Updates
* Marketing Messages