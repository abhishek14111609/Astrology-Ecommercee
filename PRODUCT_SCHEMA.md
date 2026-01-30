# Product Schema & Management Guide

## Complete Product Schema

### Product Fields:
1. **id** (Number, Auto-generated) - Unique product identifier
2. **name** (String, Required) - Product name
3. **slug** (String, Auto-generated) - URL-friendly version of name
4. **description** (String, Optional) - Detailed product description
5. **price** (Number, Required) - Product price in ₹
6. **stock** (Number, Required) - Available quantity
7. **category_id** (Number, Required) - Category reference
8. **sub_category_id** (Number, Optional) - Sub-category reference
9. **zodiac_sign** (String, Optional) - Associated zodiac sign
10. **image_url** (String, Optional) - Product image URL
11. **is_bestseller** (Boolean, Default: false) - Bestseller flag
12. **tags** (Array of Strings, Optional) - Product tags for filtering
13. **created_at** (Date, Auto-generated) - Creation timestamp

## How to Use Product Management

### Adding a New Product:
1. **Product Name** - Enter the product name (slug auto-generates)
2. **Price** - Enter price in rupees
3. **Stock Quantity** - Enter available quantity
4. **Category** - Select from dropdown (required)
5. **Sub-Category** - Select from dropdown (auto-populated based on category)
6. **Product Image** - Upload or provide URL
7. **Zodiac Sign** - Select associated zodiac sign
8. **Description** - Add detailed description
9. **Tags** - Add comma-separated tags (e.g., "Healing, Meditation, Energy")
10. **Bestseller** - Check if product is a bestseller

### Category & Sub-Category Hierarchy:
- Categories are fetched with their subcategories
- When you select a category, only its subcategories appear
- Both category and sub-category are linked by ID

### Tags Feature:
- Enter tags separated by commas
- Tags are displayed as badges in the product card
- Useful for search and filtering

### Stock Management:
- Track available quantity for each product
- Displayed in product cards
- Updated when creating/editing products

## API Endpoints

### Products:
- **POST** `/admin/products` - Create new product
- **PUT** `/admin/products/:id` - Update product
- **DELETE** `/admin/products/:id` - Delete product
- **GET** `/products` - Get all products

### Categories:
- **GET** `/admin/categories` - Get all categories with subcategories
- **POST** `/admin/categories` - Create category
- **PUT** `/admin/categories/:id` - Update category
- **DELETE** `/admin/categories/:id` - Delete category

### Sub-Categories:
- **GET** `/admin/subcategories` - Get all subcategories
- **POST** `/admin/subcategories` - Create subcategory
- **PUT** `/admin/subcategories/:id` - Update subcategory
- **DELETE** `/admin/subcategories/:id` - Delete subcategory

## Bulk Upload via Excel/CSV

### Template Format:
```csv
name,price,description,zodiac_sign,is_bestseller,tags,stock
Sample Product,1999.00,Product description here,Aries,FALSE,"Healing, Meditation",50
```

### Steps:
1. Click "Bulk Upload" button
2. Download template (CSV format)
3. Fill in product data
4. Upload the file
5. View success/failure summary

## Features Implemented:

✅ Complete product schema with all fields
✅ Category and sub-category selection with hierarchy
✅ Stock quantity tracking
✅ Tags system with visual badges
✅ Image upload support
✅ Bestseller marking
✅ Zodiac sign association
✅ Bulk upload via Excel/CSV
✅ Edit and delete functionality
✅ Real-time form updates
✅ Product search
✅ Responsive design

## Data Validation:
- Name, Price, Stock, and Category are required fields
- Sub-category is optional but depends on category selection
- Tags are automatically parsed from comma-separated input
- Stock defaults to 0 if not provided
- is_bestseller defaults to false

## UI Features:
- Clean split-view layout (form on left, products on right)
- Real-time tag display as badges
- Stock quantity shown in product cards
- Category hierarchy in product display
- Image preview before upload
- Scroll-to-top when editing
- Smooth animations and transitions
