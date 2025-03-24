# Frontend Currency Converter

## Overview
This project is a simple currency converter. It enhances an existing calculator by adding key features like real-time exchange rates, user input, and a markup calculation.

## Features
- **Dropdown Improvements**: Dropdowns now close when clicking outside of them.
- **User Input Field**: Added an input box on the rates page for users to enter an amount to convert.
- **Conversion Calculation**: Displays both the actual conversion amount and a marked-up amount with a 0.05% adjustment.
- **Live Exchange Rates**: Fetches real-time exchange rates from an API and updates automatically.

## API Integration
- **Endpoint:** `https://rates.staging.api.paytron.com/rate/public`
- **Data Used:** Uses the `retailRate` field from the API response.
- **Auto-Refresh:** Updates the exchange rate whenever the progress bar completes.

## Getting Started
1. Clone the repository:
   ```sh
   git clone https://github.com/l-stockwell/currency-conversion.git
   ```
   
2. Install dependencies:
   ```sh
   npm install
   ```
   
3. Run the development server:
   ```sh
   npm start
   ```

## How It Works
- Choose currencies from the dropdown menus.
- Enter an amount in the input field.
- See the calculated conversion and markup-adjusted amount.
- Live rates refresh automatically when the progress bar completes.
