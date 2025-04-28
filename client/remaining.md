# Remaining Features and Implementation Tasks

This document lists all the specific features, flows, and requirements from the user flow that are not yet implemented in the codebase as of 2025-04-22. Each item is actionable and described in detail, with no code included.

---

## 1. Batch Creation and Production
### 1.1. Production Planner
- [x] **AI-powered scheduling tool integration**: Batch scheduling now uses an AI-powered tool (Gemini AI integration) to suggest optimal production schedules during batch creation.

### 1.2. Production Line Operator
- [x] **Interface to record deviations from planned parameters**: Operators/Admins can log deviations (parameter, expected/actual values, reason) via the batch details view.

### 1.3. Quality Control Personnel
- [ ] **Quality Control Dashboard**: No dedicated dashboard for quality control personnel to manage and review batches.
- [ ] **Recording quality control measurements (e.g., pH, viscosity)**: No UI or API endpoint for capturing specific quality measurements per batch.
- [ ] **Comparison against predefined thresholds**: No logic to compare recorded measurements with quality standards.
- [ ] **Batch approval/rejection workflow**: No explicit approval/rejection system for batches based on quality results.

---

## 2. Inventory Management
### 2.1. Inventory Manager
- [ ] **System alerts for low stock levels**: No notification or alert system for low inventory is present.
- [ ] **Purchase order creation for replenishment**: No UI or API for creating and managing purchase orders.
- [ ] **Receiving inventory**: No workflow for recording the receipt of new inventory items.
- [ ] **Tracking inventory consumption by batch**: No mechanism to link inventory consumption directly to specific production batches.
- [ ] **Inventory adjustments (e.g., spoilage)**: No UI or process for adjusting inventory due to spoilage or other reasons.

---

## 3. Sales and Order Fulfillment
### 3.1. Sales Representative
- [ ] **Sales Order Management module**: No dedicated module for managing sales orders from creation to fulfillment.
- [ ] **Customer information management**: No interface for managing customer details linked to sales orders.
- [ ] **Product availability check**: No real-time check or warning for insufficient inventory during order creation.

### 3.2. Order Fulfillment Staff
- [ ] **Order allocation and packing workflow**: No workflow for allocating inventory, packing, and fulfilling orders.
- [ ] **Shipping document and invoice generation**: No system for generating shipping documents or invoices.
- [ ] **Order status updates (e.g., shipped, delivered)**: No order status tracking or update mechanism.
- [ ] **Customer notification of shipment**: No automated notification to customers when orders are shipped.

---

## 4. Reporting and Analysis
### 4.1. Plant Manager / Business Analyst
- [ ] **Comprehensive reporting dashboards**: Only basic stats exist; detailed dashboards for production, inventory, sales, and quality are missing.
- [ ] **Quality control reports (defect rates, trends)**: No dedicated reports for quality metrics and trends.
- [ ] **Process improvement analytics**: No analytics or recommendations for process optimization.
- [ ] **KPI monitoring**: No explicit KPI dashboard for production, inventory, and sales.

---

## General / Cross-cutting
- [ ] **Role-based access for all modules**: Ensure that all modules are accessible only to the appropriate roles as per user flow.
- [ ] **Notifications and alerts system**: Implement a real-time notification system for alerts (inventory, quality, etc.).
- [ ] **Audit trails and logs**: No evidence of audit logging for critical actions (batch changes, inventory adjustments, order fulfillment, etc.).

---

**Note:**
- This list is based on the current state of the codebase and the requirements/user flow document. If any of these features are implemented elsewhere or under development, update this checklist accordingly.
- Each item should be addressed with both backend and frontend (UI/API) as needed for full functionality.
