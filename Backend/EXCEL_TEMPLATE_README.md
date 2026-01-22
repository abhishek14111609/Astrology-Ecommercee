# Excel Upload Template for Products

## Required Columns

Your Excel file should have the following columns:

| Column Name      | Required | Type    | Example                          | Description                                    |
|------------------|----------|---------|----------------------------------|------------------------------------------------|
| name             | Yes      | Text    | "Amethyst Crystal Cluster"       | Product name                                   |
| price            | Yes      | Number  | 2499.00                          | Product price                                  |
| slug             | No       | Text    | "amethyst-crystal-cluster"       | URL-friendly name (auto-generated if missing)  |
| description      | No       | Text    | "Natural healing crystal..."     | Product description                            |
| category_id      | No       | Number  | 1                                | Category ID from database                      |
| sub_category_id  | No       | Number  | 2                                | Sub-category ID from database                  |
| zodiac_sign      | No       | Text    | "Aries"                          | Zodiac sign (default: Aries)                   |
| image_url        | No       | Text    | "/images/product.jpg"            | Image URL or path                              |
| is_bestseller    | No       | Boolean | TRUE / FALSE                     | Mark as bestseller (default: FALSE)            |
| tags             | No       | Text    | "Healing, Meditation, Peace"     | Comma-separated tags                           |
| stock            | No       | Number  | 50                               | Stock quantity (default: 0)                    |

## Sample Excel Format

```
name                        | price   | description                  | zodiac_sign | is_bestseller | tags                    | stock
Amethyst Crystal Cluster    | 2499.00 | Natural healing crystal      | Pisces      | TRUE          | Healing, Meditation     | 50
Rose Quartz Heart           | 1299.00 | Love and emotional healing   | Taurus      | TRUE          | Love, Healing           | 30
Tarot Card Deck             | 1999.00 | Classic divination deck      | Scorpio     | FALSE         | Divination, Guidance    | 20
```

## Notes

- The first row must contain the column headers
- Required fields: **name** and **price**
- All other fields are optional and will use default values if not provided
- Tags should be comma-separated
- Boolean values can be: TRUE/FALSE, true/false, 1/0
- File must be in .xlsx or .xls format
