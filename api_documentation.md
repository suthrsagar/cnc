# Backend API Documentation

This file contains a list of all the APIs available in the backend along with their respective functions.

## 1. Root Route

### `GET /`
- **Kaam (Function):** API ka status check karne ke liye (Health check). Return karta hai "CNC Wood Design API is running... 🚀" agar server properly chal raha ho.

---

## 2. Design APIs (Base URL: `/api/designs`)

### `GET /api/designs`
- **Kaam (Function):** Database se saare designs fetch karne ke liye. 
- **Features:** Aap `category` (jaise 'All' ya koi specific category) aur `search` (title ke hisaab se) query parameters bhej kar designs ko filter bhi kar sakte hain.

### `POST /api/designs`
- **Kaam (Function):** Ek naya design add karne ke liye.
- **Data Required:** `title`, `category`, `price`, aur `image` (ya toh Cloudinary ke through image file upload karke ya fir direct `imageUrl` bhej kar).

### `DELETE /api/designs/:id`
- **Kaam (Function):** Kisi specific design ko uske `id` ke basis par database se delete karne ke liye.

---

## 3. Order APIs (Base URL: `/api/orders`)

### `POST /api/orders`
- **Kaam (Function):** Ek naya order create karne ke liye.
- **Data Required:** User ka `name`, `phone`, `address`, aur jiss design ka order hai uska `designId`. By default order ka status 'Pending' set ho jata hai.

### `GET /api/orders`
- **Kaam (Function):** Saare orders ki list fetch karne ke liye. Isme har order ke andar uska corresponding design details bhi populate hokar aata hai.
- **Features:** Aap `phone` query parameter bhej kar kisi specific user (phone number) ke orders filter kar sakte hain.

### `PATCH /api/orders/:id`
- **Kaam (Function):** Kisi specific order ke status ko update karne ke liye (uski `id` ke basis par). For example: Order status ko 'Pending' se 'Completed' karna.
