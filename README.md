# Wall Calendar Application

## Overview

The Wall Calendar Application is a modern, interactive web-based calendar built using React. It provides an intuitive interface for managing dates, notes, and holidays while maintaining a clean and visually refined design.

The application emphasizes user experience, structured interaction, and practical functionality such as date selection, range selection, and categorized note management. It is designed to reflect real-world product development standards.


## Screenshots:

 <img width="1897" height="905" alt="Screenshot 2026-04-08 214457" src="https://github.com/user-attachments/assets/1e3d05d0-45f6-420b-9b35-60673528a8c7" />

 <img width="1898" height="906" alt="Screenshot 2026-04-08 214550" src="https://github.com/user-attachments/assets/f2e2b7b7-d034-41e4-97b5-41396e3e42f9" />

  <img width="1896" height="902" alt="Screenshot 2026-04-08 215056" src="https://github.com/user-attachments/assets/6e1bc629-d7cc-421c-89e5-89065b1e931b" />


## Features:

### Calendar Interface
- Monthly calendar view with accurate date alignment  
- Navigation between months  
- Highlighting of the current day  
- Selection of individual dates  
- Responsive layout with smooth transitions  

### Range Selection
- Toggle-based range selection mode  
- Selection of start and end dates  
- Visual highlighting of the selected range  
- Clear distinction between start, end, and intermediate dates  

### Notes System
- Add notes to specific dates  
- Add general notes independent of dates  
- Categorize notes into Personal, Work, and Urgent  
- Persistent storage using local storage  

### Holiday Integration
- Dynamic holiday generation based on year  
- Includes fixed and computed holidays such as Easter and Good Friday  
- Holiday indicators displayed on calendar cells  
- Selected date displays holiday details  

### UI and UX Enhancements
- Glassmorphism-based interface design  
- Background image changes based on the current month  
- Custom dropdown component replacing native select  
- Smooth hover and interaction effects  
- Clean and minimal visual hierarchy  

## Tech Stack:

- React  
- JavaScript (ES6+)  
- Tailwind CSS  
- Framer Motion  
- date-fns  
- Local Storage  

## Project Structure:

```
src/
├── components/
│   ├── Calendar.jsx
│   └── CustomDropdown.jsx
│
├── data/
│   └── holidays.js
│
├── hooks/
│   └── useLocalStorage.js
│
└── main.jsx

public/
├── favicon.png
└── design_guidelines.json
```

## Key Implementation Details:

### Dynamic Holiday System
- Holidays are generated programmatically for any year  
- Includes both fixed dates and calculated holidays  
- No external API dependency, fully frontend-based  

### Custom Dropdown
- Built using React instead of native select  
- Fully styled to match application theme  
- Supports animations and outside click handling  

### Range Selection Logic
- First click sets start date  
- Second click sets end date  
- Automatically resets when selecting a new range  
- Efficient date comparison logic for highlighting  

### State Management
- React hooks used for all state handling  
- Local storage used for persistence  
- Clear separation between UI and logic  

## Setup Instructions:

1. Clone the repository  

```
git clone <your-repo-url>
```

2. Install dependencies  

```
npm install
```

3. Run the development server  

```
npm run dev
```

4. Open in browser  

```
http://localhost:5173
```

## Design Approach:

The application follows a user-focused design approach with emphasis on clarity, usability, and visual balance.

- Minimal clutter  
- Clear interaction patterns  
- Consistent spacing and color usage  
- Immediate visual feedback for user actions  

The goal was to create a calendar experience that feels intuitive, modern, and production-ready.

## Future Improvements:

- Drag-based range selection  
- Range-based note creation  
- Enhanced mobile responsiveness  
- Event indicators inside calendar cells  
- Export or synchronization features  

## Conclusion:

This project demonstrates the ability to build interactive and scalable frontend applications with strong focus on user experience and design consistency.

It highlights practical implementation of state management, dynamic data handling, and modern UI development practices.
