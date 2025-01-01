# 🛍 FRAME - eCommerce Website

FRAME is a fully-featured eCommerce platform developed using Django REST Framework, React, and Redux. It provides a seamless experience for both administrators and customers with powerful features such as product management, user registration, login/logout functionality, shopping cart management, and secure payment processing via PayPal and credit card integration.

## ✨ Key Features

- 🔧 Custom Admin Panel:  
  - Efficiently manage products, orders, and user accounts.  
  - Admin access to view, add, update, and delete products, manage user accounts, and monitor order statuses.

- 👤 User Panel:  
  - User registration and login/logout functionality.  
  - Shopping cart management with add, remove, and update item features.  
  - Order tracking and order history for customers.
  
- 💳 Payment Integration:  
  - Secure payment gateways via PayPal and credit card processing for easy and safe transactions.

- 🧾 Billing:  
  - Integrated billing functionality for smooth and reliable transactions for customers.

## 🛠 Tech Stack

- Backend: Django, Django REST Framework (DRF)  
- Frontend: React, Redux, Axios  
- Payment Gateway: PayPal, Credit Card Integration  

## ⚙️ Prerequisites

Make sure you have the following installed on your system:  
- Python 
- Node.js 

## 🚀 Setup and Installation

Follow these steps to set up the project on your local machine:

### Backend Setup (Django)
1. Clone the repository:  
   git clone https://github.com/yankkvx/ecommerce-django-react/  
2. Create a `.env` file in the root folder of the Django backend (where `manage.py` is located).  
```plaintext
   SECRET_KEY=your_secret_key_here
   DEBUG=True
```
3. Navigate to the project directory:  
   cd ecommerce-django-react  
4. Create a virtual environment:  
   python -m venv venv  
5. Activate the virtual environment:  
   - On Windows: venv\Scripts\activate  
   - On macOS/Linux: source venv/bin/activate  
6. Install dependencies:  
   pip install -r requirements.txt  
7. Apply migrations:  
   python manage.py migrate  
8. Start the Django server:  
   python manage.py runserver  
9. Create a superuser for admin access:  
   python manage.py createsuperuser  

### Frontend Setup (React)
1. Navigate to the frontend directory:  
   cd frontend  
2. Install npm packages:  
   npm install  
3. Start the React development server:  
   npm start

To enable PayPal integration, create a `.env` file in the frontend folder.
Add the following environment variables to the .env file:
```plaintext
REACT_APP_PAYPAL_SECRET_KEY=your_paypal_secret_key
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Demonstration

![Screenshot 2025-01-01 at 17-33-07 Frame](https://github.com/user-attachments/assets/ffec6f6c-f17f-49a8-81f6-12526c9df821)
✨ More screenshots can be found in the [screenshots](https://github.com/yankkvx/ecommerce-django-react/tree/main/screenshots) folder