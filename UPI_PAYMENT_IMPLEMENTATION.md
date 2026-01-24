# UPI Payment System Implementation Guide

## Overview
A complete UPI payment system has been implemented for the Auric Krystal e-commerce platform. Customers can now pay via UPI (GPay, PhonePe, etc.) by viewing a QR code, scanning/entering UPI ID, and uploading a payment screenshot for verification.

## Features

### Customer-Side Features
1. **Payment Page** (`/payment/:orderId`)
   - Display payment amount
   - QR code for scanning
   - UPI ID with one-click copy functionality
   - Step-by-step payment instructions
   - Payment screenshot upload with preview
   - Terms & conditions acceptance
   - Real-time payment status (Pending, Verified, Rejected)
   - Order summary sidebar

2. **Order Integration**
   - Payment page automatically opened after order placement
   - Order status tracking
   - Payment approval status visibility

### Admin-Side Features
1. **Payment Verification Page** (`/payments`)
   - List of all pending payments
   - View customer details and order information
   - Preview payment screenshots
   - Approve or reject payments with notes
   - Bulk action capability

2. **Payment Settings Page** (`/payment-settings`)
   - Configure UPI ID
   - Upload QR code image
   - Set account holder name
   - Add/edit payment instructions
   - Manage payment settings

## File Structure

### Backend Files Created/Modified
```
Backend/
├── models/
│   ├── Order.js (MODIFIED - Added payment fields)
│   └── Payment.js (NEW - Payment settings model)
├── routes/
│   ├── payment.js (NEW - Customer payment APIs)
│   └── admin-payments.js (NEW - Admin payment APIs)
└── server.js (MODIFIED - Added new routes)
```

### Frontend Files Created/Modified
```
Frontend/
├── src/
│   ├── pages/
│   │   ├── PaymentPage.jsx (NEW - Customer payment page)
│   │   └── Checkout.jsx (MODIFIED - Redirect to payment)
│   └── App.jsx (MODIFIED - Added payment route)
```

### Admin Files Created/Modified
```
Admin Auric Krystal/
├── src/
│   ├── pages/
│   │   ├── PaymentManagement.jsx (NEW - Admin payment verification)
│   │   └── PaymentSettings.jsx (NEW - Admin settings)
│   ├── components/
│   │   └── Sidebar.jsx (MODIFIED - Added payment links)
│   └── App.jsx (MODIFIED - Added payment routes)
```

## API Endpoints

### Customer APIs (`/api/payment`)
- `GET /settings` - Get active payment settings
- `POST /upload-screenshot/:orderId` - Upload payment screenshot
- `GET /order/:orderId` - Get order payment status

### Admin APIs (`/api/admin/payments`)
- `GET /pending-payments` - Get all pending payments
- `POST /approve-payment/:orderId` - Approve payment
- `POST /reject-payment/:orderId` - Reject payment
- `POST /settings` - Update payment settings
- `GET /settings` - Get payment settings

## Database Updates

### Order Model Changes
New fields added to Order schema:
```javascript
{
  payment_method: String,           // Default: 'upi'
  payment_screenshot: String,       // File path
  payment_screenshot_uploaded_at: Date,
  admin_approved: Boolean,          // Default: false
  admin_approval_date: Date,
  admin_notes: String,
  customer_phone: String,           // Added
  customer_address: String          // Added
}
```

### New Payment Settings Model
```javascript
{
  payment_method: String,           // enum: ['upi', 'bank_transfer']
  upi_id: String,
  qr_code_image: String,
  bank_account: String,
  bank_ifsc: String,
  account_holder: String,
  instructions: [String],
  is_active: Boolean,
  created_at: Date,
  updated_at: Date
}
```

## Installation & Setup

### 1. Install Dependencies
```bash
cd Backend
npm install multer  # For file uploads (should already be installed)
```

### 2. Database Seeding (Optional)
The system automatically creates necessary collections and indices. No manual migration needed.

### 3. Environment Setup
No additional environment variables needed. Use existing API_BASE_URL configuration.

## Usage Flow

### Customer Payment Flow
1. Customer adds items to cart and proceeds to checkout
2. Fills shipping details and selects "UPI Payment"
3. Order is created and customer is redirected to `/payment/:orderId`
4. On payment page:
   - Scans QR code or copies UPI ID
   - Makes payment through UPI app
   - Takes screenshot of successful payment
   - Uploads screenshot on the payment page
   - Checks "I confirm..." checkbox
   - Clicks "Upload Screenshot" button
5. Status shows "Pending Verification"
6. Admin reviews and approves/rejects
7. Customer receives notification and order status updates

### Admin Payment Management Flow
1. Admin logs into admin panel
2. Navigates to "Payment Verification" under Payments section
3. Reviews list of pending payments
4. Clicks "Review" to view order details and screenshot
5. Can:
   - Add approval notes (optional)
   - Click "Approve" to verify payment and confirm order
   - Add rejection reason and click "Reject" to send back to customer
6. Can configure payment settings in "Payment Settings" page:
   - Update UPI ID
   - Upload/change QR code
   - Set account holder name
   - Add payment instructions

## Screenshot Upload Location
Payment screenshots are stored in: `Backend/uploads/payment-screenshots/`
QR codes are stored in: `Backend/uploads/qr-codes/`

## File Validation
- **Supported Formats**: JPG, PNG, WEBP
- **Max File Size**: 5MB
- **Validation**: MIME type checking on upload

## Order Status States

### Payment Status Values
- `pending` - Initial state before payment
- `pending_approval` - Screenshot uploaded, awaiting admin verification
- `verified` - Admin approved payment
- `rejected` - Admin rejected payment
- `paid` - Final confirmation (after approval)

### Order Status Values
- `pending` - Initial order state
- `confirmed` - After payment verification
- `payment_rejected` - If payment was rejected
- (Other statuses can be added as needed)

## Security Features
1. **Authentication**: JWT token required for payment upload and admin actions
2. **Authorization**: Users can only upload for their own orders
3. **File Upload Security**: 
   - MIME type validation
   - File size limits
   - Unique filename generation
4. **Data Validation**: Customer phone and address fields in orders
5. **Admin Notes**: Tracked for all payment actions

## Customization Options

### Modify Payment Instructions
Edit in Admin Panel → Payment Settings → Payment Instructions

### Change UPI ID
Edit in Admin Panel → Payment Settings → UPI Details

### Change QR Code
Upload new image in Admin Panel → Payment Settings → QR Code

### Customize Payment Page
Edit `Frontend/src/pages/PaymentPage.jsx` to modify:
- Colors and styling
- Instructions text
- Layout and components
- Error messages

## Troubleshooting

### Payment Screenshot Not Uploading
- Check file format (must be JPG, PNG, or WEBP)
- Verify file size is less than 5MB
- Ensure you're logged in (valid token in localStorage)

### Cannot see Payment Settings
- Ensure admin is logged in
- Check user has admin role (if role-based access implemented)

### Screenshot Not Showing in Admin Panel
- Check uploads folder exists and has correct permissions
- Verify API_BASE_URL is correctly configured
- Check browser console for CORS errors

## Future Enhancements
1. SMS/Email notifications to customer when payment is approved/rejected
2. Automatic order fulfillment after payment verification
3. Payment gateway integration (Razorpay, Stripe)
4. Multiple UPI ID support for different payment streams
5. Payment receipt generation and download
6. Payment history and analytics
7. Refund management system

## Support
For issues or questions, check:
1. Backend logs for API errors
2. Browser console for frontend errors
3. MongoDB collections for data validation
