# UPI Payment System - Visual Reference Guide

## 🎯 What You Need to Know

### The Three Parties Involved

```
┌─────────────────┐         ┌──────────────┐         ┌──────────────┐
│   CUSTOMER      │         │   PAYMENT    │         │    ADMIN     │
│   (Frontend)    │◄───────►│   (Backend)  │◄───────►│   (Panel)    │
│                 │         │              │         │              │
│ • Shop          │         │ • APIs       │         │ • Verify     │
│ • Cart          │         │ • Database   │         │ • Approve    │
│ • Checkout      │         │ • File Store │         │ • Configure  │
│ • Payment       │         │ • Security   │         │ • Settings   │
└─────────────────┘         └──────────────┘         └──────────────┘
     Port 5173                 Port 3000               Port 5174
```

---

## 🔄 The Complete Flow

### Phase 1: Shopping
```
┌─────────────────┐
│  CUSTOMER       │
│  Browses Shop   │ ← Frontend: localhost:5173/shop
│  Adds to Cart   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CHECKOUT       │
│  Fills Address  │ ← Frontend: localhost:5173/checkout
│  Selects UPI    │
└────────┬────────┘
```

### Phase 2: Order Creation
```
┌─────────────────────────────────────────────────┐
│ API CALL: POST /api/orders                      │
│ Backend creates order                           │
│ Status: pending, payment_status: pending        │
│ Returns: Order ID, Order Number (AK-XXXXX)     │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ Order Created    │
         │ in Database      │
         │ Ready to Pay     │
         └──────────────────┘
```

### Phase 3: Payment Page
```
CUSTOMER IS REDIRECTED TO:
/payment/{orderId}

API CALLS:
├─ GET /api/payment/settings
│  ├─ UPI ID
│  ├─ QR Code Image
│  └─ Instructions
│
└─ GET /api/payment/order/{orderId}
   ├─ Order Details
   ├─ Amount to Pay
   └─ Items List

CUSTOMER SEES:
┌─────────────────────────────────┐
│ Payment Page                    │
├─────────────────────────────────┤
│ Amount: ₹2,500                  │
│                                 │
│ QR Code [████████]              │
│                                 │
│ UPI ID: test@upi                │
│                                 │
│ Instructions:                   │
│ 1. Open GPay                    │
│ 2. Scan QR Code                 │
│ 3. Enter Amount                 │
│ 4. Complete Payment             │
│ 5. Upload Screenshot            │
│                                 │
│ [Upload Screenshot Button]      │
│                                 │
│ [✓] I accept T&C                │
└─────────────────────────────────┘
```

### Phase 4: Payment Action
```
CUSTOMER ACTIONS:
1. Opens UPI App (GPay/PhonePe)
2. Scans QR or Enters UPI ID
3. Completes Payment
4. Takes Screenshot
5. Returns to Payment Page
6. Uploads Screenshot
7. Accepts Terms
8. Clicks Upload

API CALL: POST /api/payment/upload-screenshot/{orderId}
├─ Auth: Bearer {token}
├─ File: screenshot image
├─ Validation: MIME type, 5MB limit
└─ Result: File saved, Order updated
   ├─ payment_screenshot: path/to/file
   ├─ payment_screenshot_uploaded_at: Date
   └─ payment_status: pending_approval

CUSTOMER SEES:
┌──────────────────────────────┐
│ ✅ Success Message            │
│ Screenshot uploaded!         │
│                              │
│ ⏳ Status:                     │
│ Payment Under Verification   │
│                              │
│ Redirecting to Profile...    │
└──────────────────────────────┘
```

### Phase 5: Admin Review
```
ADMIN ACCESSES:
http://localhost:5174/payments

API CALL: GET /api/admin/payments/pending-payments
├─ Returns: All pending payments
├─ Shows:
│  ├─ Order Number
│  ├─ Customer Name
│  ├─ Amount
│  └─ Upload Date
│
└─ Admin Clicks: Review

ADMIN SEES:
┌─────────────────────────────────┐
│ Order #AK-100001                │
├─────────────────────────────────┤
│ Customer: John Doe              │
│ Amount: ₹2,500                  │
│ Items:                          │
│  • Product 1 x 2                │
│  • Product 2 x 1                │
│                                 │
│ Screenshot Preview: [Image]     │
│                                 │
│ Notes (Optional): [Textarea]    │
│                                 │
│ [APPROVE] [REJECT]              │
└─────────────────────────────────┘
```

### Phase 6: Admin Action
```
OPTION A: APPROVE
│
├─ API CALL: POST /api/admin/payments/approve-payment/{orderId}
│  ├─ Body: {adminNotes: "Payment verified"}
│  ├─ Order Status Updated:
│  │  ├─ payment_status: "verified"
│  │  ├─ admin_approved: true
│  │  ├─ admin_approval_date: Date
│  │  ├─ order status: "confirmed"
│  │  └─ order ready for shipment
│  │
│  └─ Result: ✅ Payment Confirmed
│
├─ Database Update:
│  ├─ orders collection
│  └─ payment_status: "verified"
│
└─ Customer Notification:
   Payment Verified!
   Order Confirmed
   Ready to Ship


OPTION B: REJECT
│
├─ API CALL: POST /api/admin/payments/reject-payment/{orderId}
│  ├─ Body: {rejectionReason: "Invalid payment proof"}
│  ├─ Order Status Updated:
│  │  ├─ payment_status: "rejected"
│  │  ├─ payment_screenshot: deleted
│  │  ├─ admin_notes: reason
│  │  └─ order status: "payment_rejected"
│  │
│  └─ Result: ❌ Payment Rejected
│
├─ Database Update:
│  ├─ orders collection
│  └─ payment_status: "rejected"
│
└─ Customer Notification:
   Payment Rejected
   Reason: Invalid payment proof
   Please upload again
```

### Phase 7: Customer Sees Result
```
APPROVED PATH:
Payment Page Shows:
┌────────────────────────────┐
│ ✅ Payment Verified!       │
│                            │
│ Your payment has been      │
│ verified. Your order is    │
│ confirmed and will be      │
│ processed soon.            │
└────────────────────────────┘

Order Status: CONFIRMED
Can track and receive order


REJECTED PATH:
Payment Page Shows:
┌────────────────────────────┐
│ ❌ Payment Rejected        │
│                            │
│ Reason: Invalid payment    │
│ proof - Please try again   │
│                            │
│ [Upload Again Button]      │
└────────────────────────────┘

Order Status: PAYMENT_REJECTED
Can upload screenshot again
```

---

## 📱 Screen-by-Screen Guide

### Frontend: Payment Page

```
URL: /payment/1
Component: PaymentPage.jsx

State Variables:
├─ paymentSettings
│  ├─ upi_id
│  ├─ account_holder
│  ├─ qr_code_image
│  └─ instructions[]
│
├─ order
│  ├─ id
│  ├─ order_number
│  ├─ total_amount
│  ├─ customer_name
│  ├─ items[]
│  └─ payment_status
│
├─ file (screenshot)
├─ preview (image data)
├─ termsAccepted (boolean)
├─ uploading (boolean)
└─ uploadStatus (success/error)

Key Sections:
┌─────────────────────────────────────────────────┐
│ PAGE: Payment Page                              │
├─────────────────────────────────────────────────┤
│                                                 │
│ HEADER SECTION:                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ Amount to Pay: ₹2,500                     │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ QR CODE SECTION:                               │
│ ┌───────────────────────────────────────────┐  │
│ │ QR Code [████]                            │  │
│ │ UPI ID: test@upi [COPY]                   │  │
│ │ Account: Rahul Shah                       │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ INSTRUCTIONS SECTION:                          │
│ ┌───────────────────────────────────────────┐  │
│ │ 1. Open GPay                              │  │
│ │ 2. Scan QR Code                           │  │
│ │ 3. Enter Amount                           │  │
│ │ 4. Complete Payment                       │  │
│ │ 5. Upload Screenshot                      │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ UPLOAD SECTION:                                │
│ ┌───────────────────────────────────────────┐  │
│ │ [Click to upload or drag & drop]          │  │
│ │                                           │  │
│ │ [Preview Image if selected]               │  │
│ │                                           │  │
│ │ [✓] I accept Terms                        │  │
│ │                                           │  │
│ │ [Upload Screenshot]                       │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ STATUS SECTION:                                │
│ ┌───────────────────────────────────────────┐  │
│ │ ⏳ Payment Under Verification              │  │
│ │    Admin will verify shortly               │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ SIDEBAR: Order Summary                         │
│ ┌───────────────────────────────────────────┐  │
│ │ Product 1 x 2          ₹1,000             │  │
│ │ Product 2 x 1          ₹1,500             │  │
│ │ ────────────────────────────────          │  │
│ │ Total:                 ₹2,500             │  │
│ │                                           │  │
│ │ Order: AK-100001                         │  │
│ │ Status: pending_approval                 │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Admin: Payment Verification Page

```
URL: /payments
Component: PaymentManagement.jsx

Data Fetched:
├─ API: GET /api/admin/payments/pending-payments
├─ Returns: Array of pending orders
└─ Properties: Order details + screenshot path

Layout:
┌─────────────────────────────────────────────────┐
│ PAGE: Payment Verification                      │
├─────────────────────────────────────────────────┤
│                                                 │
│ PENDING PAYMENTS TABLE:                        │
│ ┌───────────────────────────────────────────┐  │
│ │ Order  │ Customer  │ Amount  │  Action    │  │
│ ├───────┼──────────┼────────┼────────────┤  │
│ │AK-001 │ John Doe │ ₹2,500 │ [REVIEW]   │  │
│ │AK-002 │ Jane Doe │ ₹5,000 │ [REVIEW]   │  │
│ │AK-003 │ Bob Smith│ ₹1,200 │ [REVIEW]   │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ DETAILS PANEL (On Review Click):               │
│ ┌───────────────────────────────────────────┐  │
│ │ Order #AK-100001                          │  │
│ │ ───────────────────────────────────────   │  │
│ │ Customer: John Doe                        │  │
│ │ Email: john@test.com                      │  │
│ │ Amount: ₹2,500                            │  │
│ │                                           │  │
│ │ Items:                                    │  │
│ │ • Product 1 x 2                           │  │
│ │ • Product 2 x 1                           │  │
│ │                                           │  │
│ │ Screenshot Preview:                       │  │
│ │ [Image Display]                           │  │
│ │                                           │  │
│ │ Approval Notes:                           │  │
│ │ [Textarea - optional]                     │  │
│ │                                           │  │
│ │ Rejection Reason (if rejecting):          │  │
│ │ [Textarea]                                │  │
│ │                                           │  │
│ │ [APPROVE] [REJECT] [CLOSE]               │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Admin: Payment Settings Page

```
URL: /payment-settings
Component: PaymentSettings.jsx

Fields:
├─ UPI ID Input
├─ Account Holder Name Input
├─ QR Code File Upload
├─ Payment Instructions List
└─ Save Button

Layout:
┌──────────────────────────────────────────────┐
│ PAGE: Payment Settings                       │
├──────────────────────────────────────────────┤
│                                              │
│ SECTION 1: UPI DETAILS                      │
│ ┌────────────────────────────────────────┐  │
│ │ UPI ID:                                │  │
│ │ [Input: test@upi]                      │  │
│ │                                        │  │
│ │ Account Holder Name:                   │  │
│ │ [Input: Rahul Shah]                    │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ SECTION 2: QR CODE                          │
│ ┌────────────────────────────────────────┐  │
│ │ QR Code Image:                         │  │
│ │ [████ Current QR]                      │  │
│ │                                        │  │
│ │ [Click to upload new QR Code]          │  │
│ │ [File Preview if uploading]            │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ SECTION 3: PAYMENT INSTRUCTIONS             │
│ ┌────────────────────────────────────────┐  │
│ │ Add Instruction:                       │  │
│ │ [Input: "Step text"] [Add Button]      │  │
│ │                                        │  │
│ │ Current Instructions:                  │  │
│ │ ① Open GPay app              [Delete]  │  │
│ │ ② Scan QR Code               [Delete]  │  │
│ │ ③ Enter Amount               [Delete]  │  │
│ │ ④ Complete Payment           [Delete]  │  │
│ │ ⑤ Upload Screenshot          [Delete]  │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ [Save Settings Button]                      │
│                                              │
│ Success Message (if applicable):            │
│ ✅ Settings updated successfully!           │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 📊 Database Schema Quick View

```
ORDERS Collection
├─ id: 1
├─ order_number: "AK-100001"
├─ user_id: 1
├─ customer_name: "John Doe"
├─ customer_email: "john@test.com"
├─ customer_phone: "9876543210"    [NEW]
├─ customer_address: "123 St"       [NEW]
├─ total_amount: 2500
│
├─ payment_status: "pending"        [NEW]
│  Options: pending, pending_approval, verified, rejected
│
├─ payment_method: "upi"            [NEW]
├─ payment_screenshot: "path/file"  [NEW]
├─ payment_screenshot_uploaded_at: Date [NEW]
├─ admin_approved: false            [NEW]
├─ admin_approval_date: null        [NEW]
├─ admin_notes: ""                  [NEW]
│
├─ items: [
│  {product_id: 1, product_name: "Gem", quantity: 2, price: 1000}
│  {product_id: 2, product_name: "Stone", quantity: 1, price: 1500}
│ ]
│
└─ created_at: Date


PAYMENT_SETTINGS Collection  [NEW]
├─ id: 1
├─ payment_method: "upi"
├─ upi_id: "test@upi"
├─ account_holder: "Rahul Shah"
├─ qr_code_image: "uploads/qr-codes/..."
├─ instructions: [
│  "Open GPay app",
│  "Scan QR Code",
│  "Enter amount",
│  "Complete payment",
│  "Upload screenshot"
│ ]
├─ is_active: true
├─ created_at: Date
└─ updated_at: Date
```

---

## 🔌 API Call Sequence Diagram

```
CUSTOMER FLOW:

1. /payment/:orderId page loads
   │
   ├─► GET /api/payment/settings
   │   ├─ Fetch UPI ID
   │   ├─ Fetch QR Code
   │   └─ Fetch Instructions
   │
   └─► GET /api/payment/order/:orderId
       ├─ Fetch Order Details
       ├─ Fetch Items
       └─ Fetch Amount

2. Customer uploads screenshot
   │
   └─► POST /api/payment/upload-screenshot/:orderId
       ├─ Validate File
       ├─ Save File
       ├─ Update Order
       └─ Return Success


ADMIN FLOW:

1. /payments page loads
   │
   └─► GET /api/admin/payments/pending-payments
       ├─ Fetch Pending Orders
       └─ Display in Table

2. Admin clicks Review
   │
   └─ Shows order details (already fetched)

3. Admin clicks Approve
   │
   └─► POST /api/admin/payments/approve-payment/:orderId
       ├─ Validate Admin
       ├─ Update Order Status
       ├─ Log Action
       └─ Return Success

   OR Admin clicks Reject
   │
   └─► POST /api/admin/payments/reject-payment/:orderId
       ├─ Validate Admin
       ├─ Update Order Status
       ├─ Delete Screenshot
       ├─ Log Reason
       └─ Return Success
```

---

## 🎨 Color & Status Reference

### Payment Status Colors
```
pending          → Gray      (Initial)
pending_approval → Yellow    (Waiting for verification)
verified         → Green     (Approved)
rejected         → Red       (Need to re-upload)
```

### UI Elements
```
✅ Green    → Success, Approved, Complete
⏳ Yellow   → Pending, In Progress, Warning
❌ Red      → Error, Rejected, Failed
ℹ️ Blue     → Information, Instructions
```

---

## 🚀 Ready to Use!

This visual guide provides:
- ✅ Complete flow visualization
- ✅ Screen-by-screen breakdown
- ✅ Database structure
- ✅ API sequences
- ✅ State variables
- ✅ Status indicators

**Next**: Read `QUICK_START_UPI_PAYMENT.md` for implementation
