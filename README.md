**Project README**

---

## Task Management Application

This repository contains a task management application implemented using HTML, CSS, and JavaScript. The application allows users to manage tasks across different boards and statuses.

### Changes

1. **Modularization with ES6 Modules:**
   - Refactored the codebase to utilize ES6 modules for better organization and maintainability.
   - Imported functions from separate files (`taskFunctions.js` and `initialData.js`) to promote modularity and separation of concerns.

2. **Consistent Event Handling:**
   - Replaced direct element method invocation with `addEventListener()` for consistent event handling.
   - Improved readability and maintainability of event handling code.

3. **DOM Element Selection:**
   - Utilized efficient DOM selection methods (`getElementById()` and `querySelector()`) for selecting elements instead of populating an object with selected elements.
   - Ensured clarity and performance in DOM manipulation.

4. **Initialization Control:**
   - Implemented controlled initialization within the `init()` function, triggered when the DOM is fully loaded.
   - Enhanced code organization and ensured systematic initialization of data and event listeners.

### Lessons Learned

1. **Modularization and Code Structure:**
   - Understanding the importance of modularizing code using ES6 modules for better organization and scalability.
   - Learned how to structure code into separate files for improved maintainability and ease of collaboration.

2. **Event Handling Best Practices:**
   - Gained insights into best practices for event handling in JavaScript, such as using `addEventListener()` for consistent event binding.
   - Learned how to handle various user interactions efficiently and maintainably.

3. **DOM Manipulation and Performance:**
   - Explored efficient DOM manipulation techniques using native methods like `getElementById()` and `querySelector()`.
   - Improved understanding of selecting and manipulating DOM elements for better performance and code readability.

### Challenges Faced and Solutions

1. **Transition to ES6 Modules:**
   - Challenge: Integrating ES6 modules into an existing codebase required restructuring and understanding module dependencies.
   - Solution: Took a systematic approach to refactor code into modular components, ensuring clear separation of concerns and resolving dependencies effectively.

2. **Event Handling Refactoring:**
   - Challenge: Converting event handling from direct element method invocation to `addEventListener()` required careful consideration of context and event binding.
   - Solution: Reviewed event handling patterns and gradually refactored event binding to ensure consistency and maintainability. Utilized event delegation where applicable.

3. **Data Initialization Control:**
   - Challenge: Ensuring controlled initialization of data and event listeners posed challenges in managing dependencies and timing.
   - Solution: Implemented a centralized initialization function (`init()`) triggered on DOM load, orchestrating data initialization and event listener setup. Ensured proper sequence and dependencies were met.

### Overall Skills Acquired

1. **Modularization and Code Organization:**
   - Developed skills in structuring code into modular components for improved organization and maintainability.
   - Learned how to manage dependencies and facilitate collaboration through modular design.

2. **Event Handling and DOM Manipulation:**
   - Enhanced proficiency in handling user interactions and manipulating the DOM efficiently.
   - Gained insights into best practices for event binding and selecting/manipulating DOM elements for better performance.

3. **Refactoring and Code Quality:**
   - Improved ability to refactor code for clarity, modularity, and adherence to best practices.
   - Learned strategies for enhancing code quality through systematic refactoring and adherence to coding standards.