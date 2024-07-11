import { RefObject, useEffect } from "react";

type EventType = MouseEvent | TouchEvent;

/**
 * Hook that handles clicks outside a specified element.
 * @param ref RefObject to the element to detect clicks outside of.
 * @param handler Function to call when a click outside is detected.
 */
export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: EventType) => void
) => {
  useEffect(() => {
    const listener = (event: EventType) => {
      // Ignore clicks inside the ref element or if ref is null
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      
      handler(event); // Call the provided handler function
    };

    // Attach event listeners when the component mounts
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Detach event listeners when the component unmounts or when ref or handler change
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // Re-run effect if ref or handler function changes
};
