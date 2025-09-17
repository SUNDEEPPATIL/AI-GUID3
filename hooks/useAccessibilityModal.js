import { useEffect, useRef } from 'react';
/**
 * A reusable hook for managing modal accessibility features.
 * - Traps focus within the modal.
 * - Restores focus to the element that opened the modal when it closes.
 * - Allows closing the modal with the 'Escape' key.
 *
 * @param onClose The function to call when the modal should be closed.
 * @param modalRef A React ref attached to the modal's main container element.
 */
export const useAccessibilityModal = (onClose, modalRef) => {
    const triggerRef = useRef(null);
    useEffect(() => {
        // Save the element that had focus before the modal opened.
        triggerRef.current = document.activeElement;
        const modalNode = modalRef.current;
        if (!modalNode)
            return;
        // Find all focusable elements within the modal.
        const focusableElements = modalNode.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        // Set initial focus on the first focusable element.
        if (firstElement) {
            firstElement.focus();
        }
        const handleKeyDown = (e) => {
            // Close modal on 'Escape' key press.
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            // Trap focus within the modal on 'Tab' key press.
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Handle Shift+Tab
                    if (document.activeElement === firstElement) {
                        lastElement?.focus();
                        e.preventDefault();
                    }
                }
                else { // Handle Tab
                    if (document.activeElement === lastElement) {
                        firstElement?.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        modalNode.addEventListener('keydown', handleKeyDown);
        // Cleanup function to run when the component unmounts.
        return () => {
            modalNode.removeEventListener('keydown', handleKeyDown);
            // Restore focus to the element that originally opened the modal.
            triggerRef.current?.focus();
        };
    }, [onClose, modalRef]);
};
