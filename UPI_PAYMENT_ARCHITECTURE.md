# UPI Payment System - Visual Flow & Architecture

## Customer Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CUSTOMER FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   1. SHOP    │ ───> │  2. CART     │ ───> │ 3. CHECKOUT  │
│              │      │              │      │              │
│ Add Products │      │ Review Items │      │ Select Items │
└──────────────┘      └──────────────┘      └──────────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │  SHIPPING INFO   │
                                           │                  │
                                           │ • Name           │
                                           │ • Email          │
                                           │ • Address        │
                                           │ • City/Pincode   │
                                           │ • Phone          │
                                           └──────────────────┘
                                                    │
                                                    ▼
                                           ┌──────────────────┐
                                           │ PAYMENT METHOD   │
                                           │                  │
                                           │ [Selected: UPI]  │
                                           └──────────────────┘
                                                    │
                                                    ▼
                    ┌─────────────────────────────────────────┐
                    │    ORDER CREATED IN DATABASE            │
                    │    Status: pending                       │
                    │    Payment Status: pending               │
                    └─────────────────────────────────────────┘
                                    │
                                    ▼
            ┌────────────────────────────────────────────┐
            │   4. PAYMENT PAGE (/payment/:orderId)      │
            │                                            │
            │   ┌──────────────────────────────────────┐ │
            │   │ Amount to Pay: ₹XXXX                 │ │
            │   └──────────────────────────────────────┘ │
            │                                            │
            │   ┌──────────────────────────────────────┐ │
            │   │          QR CODE                     │ │
            │   │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │ │
            │   │   ▓                                ▓ │ │
            │   │   ▓   Click to scan with GPay    ▓ │ │
            │   │   ▓                                ▓ │ │
            │   │   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓    │ │
            │   └──────────────────────────────────────┘ │
            │                                            │
            │   ┌──────────────────────────────────────┐ │
            │   │ UPI ID: yourname@upi    [COPY BTN]  │ │
            │   └──────────────────────────────────────┘ │
            │                                            │
            │   ┌──────────────────────────────────────┐ │
            │   │  Payment Instructions:               │ │
            │   │  1. Open UPI app                     │ │
            │   │  2. Scan QR or enter UPI ID         │ │
            │   │  3. Enter amount ₹XXXX              │ │
            │   │  4. Complete payment                │ │
            │   │  5. Take screenshot                 │ │
            │   │  6. Upload screenshot               │ │
            │   └──────────────────────────────────────┘ │
            │                                            │
            │   ┌──────────────────────────────────────┐ │
            │   │ Upload Screenshot:                   │ │
            │   │ [Click to select or drag & drop]     │ │
            │   │                                      │ │
            │   │ [✓] I confirm payment is genuine     │ │
            │   │ [Upload Screenshot Button]          │ │
            │   └──────────────────────────────────────┘ │
            └────────────────────────────────────────────┘
                                    │
                                    ▼
            ┌────────────────────────────────────────────┐
            │   SCREENSHOT UPLOADED                      │
            │   Payment Status: pending_approval         │
            │   Message: "Payment Under Verification"   │
            └────────────────────────────────────────────┘
```

## Admin Payment Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ADMIN FLOW                                      │
└─────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  ADMIN PANEL    │
                    │  LOGIN          │
                    └─────────────────┘
                            │
            ┌───────────────┬┴──────────────────────┐
            │               │                       │
            ▼               ▼                       ▼
    ┌──────────────┐ ┌──────────────┐   ┌──────────────────┐
    │   Payment    │ │   Payment    │   │  Other Features  │
    │ Verification │ │  Settings    │   │  (Products, etc)│
    └──────────────┘ └──────────────┘   └──────────────────┘
            │               │
            ▼               ▼
    ┌──────────────────┐ ┌──────────────────┐
    │ Pending Payments │ │ Configure UPI:   │
    │                  │ │ • Set UPI ID     │
    │ ┌────────────────┤ │ • Upload QR Code │
    │ │Order #AK-100001│ │ • Account Name   │
    │ │Customer: John  │ │ • Instructions   │
    │ │Amount: ₹2500   │ │                  │
    │ │[Review Button] │ └──────────────────┘
    │ └────────────────┤        │
    │ │Order #AK-100002│        ▼
    │ │Customer: Sarah │   ┌──────────────────┐
    │ │Amount: ₹5000   │   │ Settings Saved   │
    │ │[Review Button] │   │ Ready for        │
    │ └────────────────┤   │ Customers        │
    └──────────────────┘   └──────────────────┘
            │
            ▼
    ┌──────────────────────────────────┐
    │   PAYMENT DETAILS VIEW           │
    │                                  │
    │ Order: #AK-100001                │
    │ Customer: John Doe               │
    │ Email: john@email.com            │
    │ Amount: ₹2500                    │
    │                                  │
    │ Items:                           │
    │ • Product 1 x 2                  │
    │ • Product 2 x 1                  │
    │                                  │
    │ ┌──────────────────────────────┐ │
    │ │  Screenshot Preview:         │ │
    │ │  [Image of payment proof]     │ │
    │ │  [View Full Image]            │ │
    │ └──────────────────────────────┘ │
    │                                  │
    │ Notes (Optional):                │
    │ [Text area for admin notes]      │
    │                                  │
    │ Rejection Reason (If rejecting): │
    │ [Text area]                      │
    │                                  │
    │ ┌─────────────┐ ┌─────────────┐  │
    │ │  [APPROVE]  │ │  [REJECT]   │  │
    │ └─────────────┘ └─────────────┘  │
    └──────────────────────────────────┘
            │                    │
    ┌───────┴────────┐   ┌──────┴──────────┐
    ▼                │   │                 ▼
APPROVED             │   │          REJECTED
    │                │   │                 │
    ▼                │   │                 ▼
Payment Status: verified
Order Status: confirmed
Admin Approval Date: [Date]
Admin Notes: [If any]

Order proceeds to
fulfillment

    │                │   │                 │
    │                │   │                 ▼
    │                │   │   Payment Status: rejected
    │                │   │   Order Status: payment_rejected
    │                │   │   Admin Notes: [Reason]
    │                │   │
    │                │   │   Customer sees rejection
    │                │   │   and can upload again
    │                └───┴──────────────────
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                      MONGODB COLLECTIONS                    │
└─────────────────────────────────────────────────────────────┘

orders (Collection)
├── id: Number (unique)
├── order_number: String "AK-100001"
├── user_id: Number
├── customer_name: String
├── customer_email: String
├── customer_phone: String (NEW)
├── customer_address: String (NEW)
├── total_amount: Number
├── status: String (pending, confirmed, payment_rejected)
├── payment_status: String (NEW - pending, pending_approval, verified, rejected)
├── payment_method: String (NEW - default: 'upi')
├── payment_screenshot: String (NEW - file path)
├── payment_screenshot_uploaded_at: Date (NEW)
├── admin_approved: Boolean (NEW)
├── admin_approval_date: Date (NEW)
├── admin_notes: String (NEW)
├── items: [
│   ├── product_id: Number
│   ├── product_name: String
│   ├── quantity: Number
│   ├── price: Number
│   └── subtotal: Number
│ ]
└── created_at: Date

payment_settings (Collection) [NEW]
├── id: Number
├── payment_method: String enum['upi', 'bank_transfer']
├── upi_id: String
├── qr_code_image: String (file path)
├── bank_account: String
├── bank_ifsc: String
├── account_holder: String
├── instructions: [String]
│   └── "1. Open GPay app"
│   └── "2. Scan QR code"
│   └── "3. Enter amount"
│   └── "4. Complete payment"
│   └── "5. Take screenshot"
│   └── "6. Upload here"
├── is_active: Boolean
├── created_at: Date
└── updated_at: Date

File Structure
├── uploads/
│   ├── payment-screenshots/
│   │   ├── 1704067200000-123456789.jpg
│   │   ├── 1704067201000-987654321.png
│   │   └── ...
│   └── qr-codes/
│       ├── 1704067200000-qrcode.png
│       └── ...
```

## API Request/Response Flow

```
CUSTOMER SIDE
─────────────

1. GET /api/payment/settings
   Response: {
     upi_id: "test@upi",
     account_holder: "Test Name",
     qr_code_image: "uploads/qr-codes/...",
     instructions: [...]
   }

2. POST /api/payment/upload-screenshot/1
   Headers: Authorization: Bearer {token}
   Body: FormData {
     screenshot: File
   }
   Response: {
     message: "Screenshot uploaded successfully!",
     order: { id, payment_status: "pending_approval", ... }
   }

3. GET /api/payment/order/1
   Headers: Authorization: Bearer {token}
   Response: {
     id, order_number, payment_status, admin_approved, ...
   }

ADMIN SIDE
──────────

1. GET /api/admin/payments/pending-payments
   Headers: Authorization: Bearer {admin_token}
   Response: [{...orders with pending_approval status...}]

2. POST /api/admin/payments/approve-payment/1
   Headers: Authorization: Bearer {admin_token}
   Body: {adminNotes: "Payment verified"}
   Response: {
     message: "Payment approved successfully",
     order: {..., payment_status: "verified", admin_approved: true}
   }

3. POST /api/admin/payments/reject-payment/1
   Headers: Authorization: Bearer {admin_token}
   Body: {rejectionReason: "Duplicate payment"}
   Response: {
     message: "Payment rejected",
     order: {..., payment_status: "rejected"}
   }

4. POST /api/admin/payments/settings
   Headers: Authorization: Bearer {admin_token}
   Body: FormData {
     upi_id: "newupi@bank",
     account_holder: "New Name",
     instructions: ["step1", "step2"],
     qrCode: File (optional)
   }
   Response: {
     message: "Payment settings updated",
     settings: {...}
   }
```

## File Upload Locations

```
Directory Structure
──────────────────
Backend/
├── uploads/
│   ├── payment-screenshots/          ← Customer payment proofs
│   │   └── {timestamp}-{random}.jpg
│   │
│   ├── qr-codes/                     ← Admin QR codes
│   │   └── {timestamp}-{random}.png
│   │
│   └── products/                     ← Existing products
│       └── ...
```

## Payment Status Lifecycle

```
CUSTOMER PERSPECTIVE:
────────────────────

Order Created
     │
     ▼
pending ──────────────────────────────────┐
     │                                    │
     ▼                                    │
pending_approval (Screenshot uploaded)   │
     │                                    │
     ├──────────────┬────────────────────┘
     ▼              ▼
verified       rejected
(Order       (User must
Confirmed)   retry)
     │              │
     ▼              ▼
Ready for    Upload Again
Shipment     (payment_screenshot
             cleared)


ADMIN PERSPECTIVE:
──────────────────

pending_approval (screenshot waiting)
     │
     ├──────────────┬──────────────────────┐
     ▼              ▼                      ▼
  APPROVE       REJECT              (no action)
     │              │                      │
     ▼              ▼                      │
verified       rejected            pending_approval
  │              │                      │
  └──────────────┘                      │
     │                                   │
     ▼                                   │
Admin Approval Date logged              │
Admin Notes saved                       │
Order Status: confirmed                 │
                                        │
                    ┌───────────────────┘
                    │
         Customer sees rejection
         and can re-upload
```

## Security Flow

```
AUTHENTICATION & AUTHORIZATION
──────────────────────────────

Customer Actions:
├─ Verify JWT token validity
├─ Check user_id matches order.user_id
├─ Allow only own order payment uploads
└─ Enforce terms acceptance

Admin Actions:
├─ Verify JWT token for admin user
├─ Verify admin role/permission
├─ Log all approval/rejection actions
└─ Validate all inputs

File Upload Security:
├─ MIME type validation (image/* only)
├─ File size limits (5MB max)
├─ Unique filename generation
├─ Secure file storage
├─ Path traversal prevention
└─ Virus scanning (optional future)
```

## Component Communication

```
FRONTEND COMPONENT TREE
───────────────────────

App.jsx
├── <BrowserRouter>
│   ├── MasterLayout/
│   │   ├── Header
│   │   ├── Footer
│   │   └── Routes
│   │       └── /payment/:orderId
│   │           └── PaymentPage.jsx
│   │               ├── State Management
│   │               │   ├── paymentSettings
│   │               │   ├── order
│   │               │   ├── file (screenshot)
│   │               │   └── uploadStatus
│   │               │
│   │               ├── API Calls
│   │               │   ├── GET /payment/settings
│   │               │   ├── GET /payment/order/:id
│   │               │   └── POST /payment/upload-screenshot
│   │               │
│   │               └── UI Components
│   │                   ├── Payment Amount Display
│   │                   ├── QR Code Section
│   │                   ├── UPI ID with Copy
│   │                   ├── Instructions List
│   │                   ├── File Upload Area
│   │                   ├── Status Messages
│   │                   └── Order Summary Sidebar
│   │
│   └── Checkout.jsx
│       └── Redirects to PaymentPage
│           after order creation

ADMIN COMPONENT TREE
────────────────────

App.jsx
├── <BrowserRouter>
│   └── Layout/
│       ├── Sidebar (with Payment links)
│       └── Routes
│           ├── /payments
│           │   └── PaymentManagement.jsx
│           │       ├── State: pendingPayments, selectedOrder
│           │       ├── API: GET /admin/payments/pending-payments
│           │       ├── API: POST /admin/payments/approve-payment
│           │       ├── API: POST /admin/payments/reject-payment
│           │       └── UI: Payment list + Details panel
│           │
│           └── /payment-settings
│               └── PaymentSettings.jsx
│                   ├── State: settings, newInstruction
│                   ├── API: POST /admin/payments/settings
│                   ├── API: GET /admin/payments/settings
│                   └── UI: Form controls + File upload
```

This complete architecture ensures secure, scalable UPI payment processing with clear separation between customer and admin functionality.
