// //Empecher la navigation tab en dehors des modal
// document.querySelectorAll('.modal').forEach(modal=> {
//     modal.addEventListener('show.bs.modal', () => {
//         document.body.setAttribute('aria-hidden', 'true');
//     });
//     modal.addEventListener('hidden.bs.modal', () => {
//         document.body.removeAttribute('aria-hidden');
//     });
// });

// // Manage arrow navigation when outside modals
// document.querySelectorAll('.modal').forEach(modal => {
//     modal.addEventListener('shown.bs.modal', () => {
//         const focusableElements = modal.querySelectorAll('button, a, input. select, textarea');
//         const firstElement = focusableElements[0];
//         const lastElement = focusableElements[focusableElements.length - 1];

//         modal.addEventListener('keydown', (e) => {
//             if (e.key === 'Tab') {
//                 if (e.shiftKey) {
//                     if (document.activeElement === firstElement) {
//                         e.preventDefault();
//                         lastElement.focus();
//                     }
//                 } else {
//                     if (document.activeElement === lastElement) {
//                         e.preventDefault();
//                         firstElement.focus();
//                     }
//                 }
//             }
//         });
//     });
// });

// // Manage navigation in chrome and pong
// document.addEventListener("DOMContentLoaded", () => {
//     const focusableSelectors = `a[href], area[href], input:not([disabled]), select:not([disabled]), 
//     textarea:not([disabled]), button:not([disabled]), iframe, 
//     [tabindex]:not([tabindex="-1"]), [contenteditable]`;

//     function trapFocus(container) {
//         const focusableElements = container.querySelectorAll(focusableSelectors);
//         if (focusableElements.lenght === 0)
//             return;
//         const firstElement = focusableElements[0];
//         const lastElement = focusableElements[focusableElements.length - 1];
//         container.addEventListener('keydown', (e) => {
//             if (e.key === 'Tab') {
//                 if (e.shiftKey) {
//                     // Shift + Tab
//                     if (document.activeElement === firstElement) {
//                         e.preventDefault();
//                         lastElement.focus();
//                     }
//                 } else {
//                     // Tab
//                     if (document.activeElement === lastElement) {
//                         e.preventDefault();
//                         firstElement.focus();
//                     }
//                 }
//             }
//         });
//     }
//     const appContainer = document.body;
//     trapFocus(appContainer);
// });