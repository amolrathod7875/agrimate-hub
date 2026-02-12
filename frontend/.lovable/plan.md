

# Agrisahayak — Agritech Frontend App

## 1. Landing Page
- Full-screen welcome page with "Welcome, Kisan" header and earthy green/yellow color scheme
- 3 large clickable category cards in a row (stacked on mobile): **Agriculture**, **Horticulture**, **Floriculture** — each with a relevant Lucide icon
- Clicking any card navigates to a shared Dashboard with that category's context

## 2. Dashboard Shell
- **Collapsible sidebar** with navigation: Crop Recommendation, Plant Disease Prediction, Government Schemes, Mandi Price Prediction, Market for Selling, Profile
- **Top header bar** with app title and circular profile avatar (top-right) linking to Profile
- **Main content area** that dynamically renders based on sidebar selection
- Fully responsive — sidebar collapses to icons on mobile

## 3. Crop Recommendation ("Smart Crop Advisor")
- Form with range sliders for: Nitrogen, Phosphorus, Potassium, Temperature, pH, Rainfall — each showing its live value
- "Predict Best Crop" button → shows a mock result card with crop name and placeholder image

## 4. Plant Disease Prediction ("Dr. Crop")
- Drag-and-drop / click-to-upload zone for leaf images with image preview
- "Analyze Disease" button → mock result showing Disease Name, Confidence Score, and Cure/Remedy text

## 5. Government Schemes ("Find Your Benefits")
- Multi-step filter form with dropdowns: State, District, Caste Category, Gender, Land Size input
- "Find Schemes" button → list of mock scheme cards with title, description, and "Apply Now" button

## 6. Mandi Price Prediction ("Mandi Bhav Forecast")
- Three cascading dropdowns: State → District → Subdivision
- "Check Prices" button → table/chart of mock predicted prices for major crops (using Recharts)

## 7. Market for Selling ("Sell Your Produce")
- Dropdowns for State and District, plus a "Use My Current Location" button
- Output: list of nearby mock markets/mandis with name, address, and contact details

## 8. Farmer Profile
- Editable form: circular profile picture upload with preview, Name, Age, Gender (radio), State & District (dropdowns), Current Location with "Detect" button
- "Save Profile" button — updates the header avatar to match the uploaded picture (stored in React state)

## 9. Design System
- Earthy color palette: greens for primary, warm yellows/oranges for accents, white/gray backgrounds
- Clean sans-serif typography, large touch targets for accessibility
- Lucide-React icons throughout
- All data is hardcoded/mock — no backend required

