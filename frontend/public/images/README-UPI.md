# UPI QR Code for Payment

To enable UPI payments in the cart:

1. **Upload your UPI QR code image** to this folder with the filename:
   ```
   upi-qr.png
   ```

   Full path: `frontend/public/images/upi-qr.png`

2. The QR image will be shown in the payment modal when customers choose "UPI – Scan QR & Pay".

3. **(Optional)** To pre-fill the amount in the UPI app, add your UPI ID to `frontend/.env`:
   ```
   VITE_UPI_ID=yourupi@paytm
   ```
   Then customers can click "Open in UPI app" to launch their UPI app with the order amount pre-filled.
