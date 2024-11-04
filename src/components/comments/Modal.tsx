import { ReactNode, useEffect, useRef, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
      setIsAnimating(true); // Start animation when opening
    } else {
      setIsAnimating(false); // Reset animation state when closing
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close modal when clicking outside
    >
      <div 
        ref={modalRef}
        className={`bg-white pt-1  rounded-lg shadow-lg max-w-lg w-full mx-4 sm:mx-0 transition-opacity duration-300 ease-in-out ${isAnimating ? 'opacity-100' : 'opacity-0'}`} // Changed scaling to opacity
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        tabIndex={-1}
        role="dialog" // Accessibility improvement
        aria-modal="true" // Accessibility improvement
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-red-500 hover:text-gray-700 text-2xl mb-3 focus:outline-none focus:ring-2 bg-white rounded-full w-8 h-8 flex items-center justify-center pb-2 focus:ring-blue-500" // Improved button styles
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
