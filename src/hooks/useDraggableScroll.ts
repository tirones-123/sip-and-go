import { useEffect, useRef, useMemo, ForwardedRef } from 'react';
import { Platform } from 'react-native';
import type { ScrollView, FlatList } from 'react-native';
import { mergeRefs } from 'react-merge-refs';

type ScrollableComponent = ScrollView | FlatList<any>;

type Props<Scrollable extends ScrollableComponent = ScrollableComponent> = {
  cursor?: string;
  outerRef?: ForwardedRef<Scrollable>;
};

export function useDraggableScroll<
  Scrollable extends ScrollableComponent = ScrollableComponent
>({ outerRef, cursor = 'grab' }: Props<Scrollable> = {}) {
  const ref = useRef<Scrollable>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !ref.current) {
      return;
    }

    // For React Native Web, we can directly access the DOM element
    const scrollableElement = ref.current as any;
    const slider = scrollableElement._nativeTag || scrollableElement;

    // If we still can't get the DOM element, try to find it through the component's structure
    let domElement: HTMLElement | null = null;
    
    if (slider && slider.nodeType === Node.ELEMENT_NODE) {
      domElement = slider as HTMLElement;
    } else if (scrollableElement.getScrollableNode) {
      domElement = scrollableElement.getScrollableNode();
    } else if (scrollableElement._component && scrollableElement._component.getScrollableNode) {
      domElement = scrollableElement._component.getScrollableNode();
    }

    if (!domElement) {
      console.warn('Could not find DOM element for draggable scroll');
      return;
    }

    let isMouseDown = false;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const mouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      startX = e.pageX - domElement!.offsetLeft;
      scrollLeft = domElement!.scrollLeft;
      domElement!.style.cursor = 'grabbing';
    };

    const mouseLeave = () => {
      isMouseDown = false;
      isDragging = false;
      domElement!.style.cursor = cursor;
    };

    const mouseUp = () => {
      isMouseDown = false;
      isDragging = false;
      domElement!.style.cursor = cursor;
    };

    const mouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      e.preventDefault();
      
      if (!isDragging) {
        isDragging = true;
      }

      const x = e.pageX - domElement!.offsetLeft;
      const walk = (x - startX) * 2;
      domElement!.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    domElement.addEventListener('mousedown', mouseDown);
    domElement.addEventListener('mouseleave', mouseLeave);
    domElement.addEventListener('mouseup', mouseUp);
    domElement.addEventListener('mousemove', mouseMove);
    domElement.style.cursor = cursor;

    // Cleanup function
    return () => {
      if (domElement) {
        domElement.removeEventListener('mousedown', mouseDown);
        domElement.removeEventListener('mouseleave', mouseLeave);
        domElement.removeEventListener('mouseup', mouseUp);
        domElement.removeEventListener('mousemove', mouseMove);
        domElement.style.cursor = 'auto';
      }
    };
  }, [cursor]);

  const combinedRef = useMemo(() => {
    if (outerRef) {
      return mergeRefs([ref, outerRef]);
    }
    return ref;
  }, [outerRef]);

  return combinedRef;
} 