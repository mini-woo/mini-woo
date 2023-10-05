# Tech doc

woocommerce apis(https://woocommerce.github.io/woocommerce-rest-api-docs/)

TODO: product attributes, product variations, create order, order list (search)
TESTS: do we need to create a customer for placing an order?

categories list (search): 
/wp-json/wc/v3/products/categories
```
[
  {
    "id": 15,
    "name": "Albums",
    "slug": "albums",
    "parent": 11,
    "description": "",
    "display": "default",
    "image": [],
    "menu_order": 0,
    "count": 4,
    "_links": {
      "self": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories/15"
        }
      ],
      "collection": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories"
        }
      ],
      "up": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories/11"
        }
      ]
    }
  },
  {
    "id": 9,
    "name": "Clothing",
    "slug": "clothing",
    "parent": 0,
    "description": "",
    "display": "default",
    "image": {
      "id": 730,
      "date_created": "2017-03-23T00:01:07",
      "date_created_gmt": "2017-03-23T03:01:07",
      "date_modified": "2017-03-23T00:01:07",
      "date_modified_gmt": "2017-03-23T03:01:07",
      "src": "https://example.com/wp-content/uploads/2017/03/T_2_front.jpg",
      "name": "",
      "alt": ""
    },
    "menu_order": 0,
    "count": 36,
    "_links": {
      "self": [
        {
          "href": "https://example/wp-json/wc/v3/products/categories/9"
        }
      ],
      "collection": [
        {
          "href": "https://example/wp-json/wc/v3/products/categories"
        }
      ]
    }
  },
  {
    "id": 10,
    "name": "Hoodies",
    "slug": "hoodies",
    "parent": 9,
    "description": "",
    "display": "default",
    "image": [],
    "menu_order": 0,
    "count": 6,
    "_links": {
      "self": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories/10"
        }
      ],
      "collection": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories"
        }
      ],
      "up": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories/9"
        }
      ]
    }
  },
  {
    "id": 11,
    "name": "Music",
    "slug": "music",
    "parent": 0,
    "description": "",
    "display": "default",
    "image": [],
    "menu_order": 0,
    "count": 7,
    "_links": {
      "self": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories/11"
        }
      ],
      "collection": [
        {
          "href": "https://example.com/wp-json/wc/v3/products/categories"
        }
      ]
    }
  }
]
```

get product:
/wp-json/wc/v3/products/<id>
```
{
  "id": 794,
  "name": "Premium Quality",
  "slug": "premium-quality-19",
  "permalink": "https://example.com/product/premium-quality-19/",
  "date_created": "2017-03-23T17:01:14",
  "date_created_gmt": "2017-03-23T20:01:14",
  "date_modified": "2017-03-23T17:01:14",
  "date_modified_gmt": "2017-03-23T20:01:14",
  "type": "simple",
  "status": "publish",
  "featured": false,
  "catalog_visibility": "visible",
  "description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n",
  "short_description": "<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>\n",
  "sku": "",
  "price": "21.99",
  "regular_price": "21.99",
  "sale_price": "",
  "date_on_sale_from": null,
  "date_on_sale_from_gmt": null,
  "date_on_sale_to": null,
  "date_on_sale_to_gmt": null,
  "price_html": "<span class=\"woocommerce-Price-amount amount\"><span class=\"woocommerce-Price-currencySymbol\">&#36;</span>21.99</span>",
  "on_sale": false,
  "purchasable": true,
  "total_sales": 0,
  "virtual": false,
  "downloadable": false,
  "downloads": [],
  "download_limit": -1,
  "download_expiry": -1,
  "external_url": "",
  "button_text": "",
  "tax_status": "taxable",
  "tax_class": "",
  "manage_stock": false,
  "stock_quantity": null,
  "stock_status": "instock",
  "backorders": "no",
  "backorders_allowed": false,
  "backordered": false,
  "sold_individually": false,
  "weight": "",
  "dimensions": {
    "length": "",
    "width": "",
    "height": ""
  },
  "shipping_required": true,
  "shipping_taxable": true,
  "shipping_class": "",
  "shipping_class_id": 0,
  "reviews_allowed": true,
  "average_rating": "0.00",
  "rating_count": 0,
  "related_ids": [
    53,
    40,
    56,
    479,
    99
  ],
  "upsell_ids": [],
  "cross_sell_ids": [],
  "parent_id": 0,
  "purchase_note": "",
  "categories": [
    {
      "id": 9,
      "name": "Clothing",
      "slug": "clothing"
    },
    {
      "id": 14,
      "name": "T-shirts",
      "slug": "t-shirts"
    }
  ],
  "tags": [],
  "images": [
    {
      "id": 792,
      "date_created": "2017-03-23T14:01:13",
      "date_created_gmt": "2017-03-23T20:01:13",
      "date_modified": "2017-03-23T14:01:13",
      "date_modified_gmt": "2017-03-23T20:01:13",
      "src": "https://example.com/wp-content/uploads/2017/03/T_2_front-4.jpg",
      "name": "",
      "alt": ""
    },
    {
      "id": 793,
      "date_created": "2017-03-23T14:01:14",
      "date_created_gmt": "2017-03-23T20:01:14",
      "date_modified": "2017-03-23T14:01:14",
      "date_modified_gmt": "2017-03-23T20:01:14",
      "src": "https://example.com/wp-content/uploads/2017/03/T_2_back-2.jpg",
      "name": "",
      "alt": ""
    }
  ],
  "attributes": [],
  "default_attributes": [],
  "variations": [],
  "grouped_products": [],
  "menu_order": 0,
  "meta_data": [],
  "_links": {
    "self": [
      {
        "href": "https://example.com/wp-json/wc/v3/products/794"
      }
    ],
    "collection": [
      {
        "href": "https://example.com/wp-json/wc/v3/products"
      }
    ]
  }
}
```

product list:
/wp-json/wc/v3/products, accept parameters like category and ... see https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-products
```
[{product}]
```

