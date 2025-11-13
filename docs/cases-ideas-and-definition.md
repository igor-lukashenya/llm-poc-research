# Cases Ideas and Definition

Each industry section below contains three types of cases:

- **UI-only POC:** Focused on frontend/user interface demonstration without backend integration.
- **UI and API Integration:** Combines frontend with backend or external API connectivity.
- **Tech Integration:** Involves deeper technical or backend integration, such as third-party services or advanced data processing.

## E-commerce

- **Product Catalog Page:** Build a responsive UI for browsing products, including filters, sorting, and product cards. No backend integration required.
  - Must support filtering by category, price range, and brand.
  - Product images should be high-resolution and support zoom.
  - Include product ratings and reviews.
  - Responsive design for mobile and desktop.
  - Option to mark products as favorites.
- **Order Tracking Dashboard:** Create a dashboard where users can enter an order ID and view real-time order status, shipping updates, and estimated delivery, integrating with a mock or real API.
  - Users can enter order ID or track via account.
  - Display shipment status, estimated delivery, and carrier info.
  - Show order history and allow download of invoices.
  - Notify users of delivery updates via email/SMS.
  - Support for multiple languages.
- **Payment Gateway Integration:** Implement a backend service that connects to a third-party payment provider (e.g., Stripe or PayPal), handling payment initiation, status updates, and error handling.
  - Support major payment providers (Stripe, PayPal, etc.).
  - Handle payment errors and retries gracefully.
  - Store transaction logs for audit.
  - Secure handling of payment data (PCI compliance).
  - Allow refunds and cancellations via API.

- **Dynamic Product Recommendation Carousel:** Showcase personalized product suggestions based on user behavior (mocked data).
  - Recommendations based on user browsing and purchase history.
  - Option to refresh or dismiss recommendations.
  - Track click-through rates for analytics.
  - Display personalized offers.
- **Real-Time Inventory Checker:** Allow users to check product availability across multiple warehouses via API.
  - Show stock levels for each warehouse.
  - Alert users when stock is low or out.
  - Integrate with supplier APIs for restock info.
- **Automated Price Comparison Service:** Integrate with competitor APIs to fetch and compare prices, updating your catalog dynamically.
  - Fetch competitor prices daily.
  - Highlight price differences on product page.
  - Notify admin of significant price gaps.

---

## Fintech

- **Personal Finance Overview:** Design a UI for users to visualize their spending categories, monthly budgets, and savings goals using charts and cards. No backend logic.
  - Visualize spending by category and time period.
  - Set and track monthly budgets.
  - Export data to PDF/CSV.
  - Support for multiple currencies.
  - Secure user authentication.
- **Transaction Search & Export:** Build a page where users can search/filter their transactions and export results to CSV, integrating with a mock or real transaction API.
  - Search by date, amount, merchant, or category.
  - Bulk export selected transactions.
  - Pagination for large datasets.
  - Show transaction details and receipts.
- **Bank Account Aggregation:** Develop a backend service that connects to multiple banking APIs (e.g., Plaid, Yodlee) to fetch and normalize account balances and transaction data.
  - Connect to multiple banks securely.
  - Normalize data formats across banks.
  - Refresh account balances on demand.
  - Handle connection errors and expired tokens.

- **Interactive Loan Calculator:** Users adjust sliders for amount, term, and interest to see real-time payment breakdowns.
  - Adjustable sliders for amount, term, interest.
  - Show monthly payment breakdown.
  - Compare loan offers from different providers.
- **Fraud Detection Alerts:** Display flagged transactions and allow users to confirm or dispute them, integrating with a fraud detection API.
  - Real-time flagging of suspicious transactions.
  - Allow users to confirm or dispute alerts.
  - Log all user actions for compliance.
- **Blockchain Transaction Logger:** Implement a backend that records financial transactions to a blockchain for auditability.
  - Record transactions on blockchain for audit.
  - Provide immutable transaction history.
  - Support for querying blockchain records.

---

## Healthcare

- **Appointment Booking Calendar:** Create a UI for patients to select a doctor, view available slots, and book appointments. No backend required.
  - Select doctor by specialty and availability.
  - View and book available time slots.
  - Send booking confirmation via email/SMS.
  - Allow rescheduling and cancellations.
- **Patient Record Viewer:** Build a page to search for patients and display their medical history, integrating with a mock or real EHR (Electronic Health Record) API.
  - Search by patient name, ID, or date of birth.
  - Display medical history, prescriptions, and lab results.
  - Role-based access control for sensitive data.
  - Export records to PDF.
- **HL7/FHIR Data Exchange:** Implement a backend service to parse, validate, and exchange healthcare data using HL7 or FHIR standards with external systems.
  - Parse and validate HL7/FHIR messages.
  - Support for sending and receiving patient data.
  - Log all data exchanges for compliance.

- **Symptom Checker Wizard:** Users input symptoms and receive possible conditions (using static logic, no backend).
  - Step-by-step symptom input.
  - Provide possible conditions and next steps.
  - Option to book appointment based on results.
- **Telemedicine Chat:** Integrate a chat UI with a mock API for doctor-patient messaging and appointment scheduling.
  - Secure messaging between patient and doctor.
  - Schedule video calls.
  - Store chat history in patient record.
- **Medical Image Analysis Pipeline:** Integrate with an external service to upload and analyze medical images (e.g., X-rays), returning diagnostic results.
  - Upload and store medical images securely.
  - Integrate with external diagnostic service.
  - Display analysis results to clinicians.
