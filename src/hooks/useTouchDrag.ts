import { useRef, useCallback } from 'react';

interface UseTouchDragOptions<T> {
  onDrop: (item: T, dropZoneId: string) => void;
  onDragStart?: (item: T) => void;
  onDragEnd?: () => void;
  onDragOverZone?: (zoneId: string | null) => void;
}

export function useTouchDrag<T>({ onDrop, onDragStart, onDragEnd, onDragOverZone }: UseTouchDragOptions<T>) {
  const itemRef = useRef<T | null>(null);
  const cloneRef = useRef<HTMLElement | null>(null);
  const sourceRef = useRef<HTMLElement | null>(null);

  const findDropZone = useCallback((x: number, y: number): string | null => {
    const elements = document.elementsFromPoint(x, y);
    for (const el of elements) {
      const zone = (el as HTMLElement).dataset?.dropZone;
      if (zone) return zone;
    }
    return null;
  }, []);

  const cleanup = useCallback(() => {
    if (cloneRef.current) {
      cloneRef.current.remove();
      cloneRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.style.opacity = '';
      sourceRef.current = null;
    }
    itemRef.current = null;
    onDragEnd?.();
    onDragOverZone?.(null);
  }, [onDragEnd, onDragOverZone]);

  const getTouchHandlers = useCallback((item: T) => ({
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      const target = e.currentTarget as HTMLElement;

      itemRef.current = item;
      sourceRef.current = target;

      const rect = target.getBoundingClientRect();
      const clone = target.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.left = `${touch.clientX - rect.width / 2}px`;
      clone.style.top = `${touch.clientY - rect.height / 2}px`;
      clone.style.zIndex = '9999';
      clone.style.opacity = '0.85';
      clone.style.pointerEvents = 'none';
      clone.style.transform = 'scale(1.1)';
      clone.style.transition = 'none';
      document.body.appendChild(clone);
      cloneRef.current = clone;

      target.style.opacity = '0.3';
      onDragStart?.(item);
    },
    onTouchMove: (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const clone = cloneRef.current;
      if (clone) {
        clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
        clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;
      }

      const zone = findDropZone(touch.clientX, touch.clientY);
      onDragOverZone?.(zone);
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const touch = e.changedTouches[0];
      const zone = findDropZone(touch.clientX, touch.clientY);

      if (zone && itemRef.current) {
        onDrop(itemRef.current, zone);
      }

      cleanup();
    },
  }), [onDrop, onDragStart, findDropZone, cleanup, onDragOverZone]);

  return { getTouchHandlers };
}
