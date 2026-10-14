"use client";

import { useEffect, useRef } from "react";

export default function TabIndicator({ listRef }: { listRef: React.RefObject<HTMLDivElement | null> }) {
    const indicatorRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        const list = listRef.current;
        const indicator = indicatorRef.current;
        if (!list || !indicator) return;

        const update = () => {
            const active = list.querySelector<HTMLElement>('[data-state="active"]');
            if (!active) {
                indicator.style.opacity = '0';
                return;
            }

            if (!hasInitialized.current) {
                indicator.style.transition = 'none';
            }

            indicator.style.width = `${active.offsetWidth}px`;
            indicator.style.left = `${active.offsetLeft}px`;
            indicator.style.top = `${active.offsetTop + active.offsetHeight - 2}px`;
            indicator.style.opacity = '1';

            if (!hasInitialized.current) {
                void indicator.offsetHeight; // force reflow before enabling transition
                indicator.style.transition = '';
                hasInitialized.current = true;
            }
        };

        update();

        const mo = new MutationObserver(update);
        mo.observe(list, { attributes: true, subtree: true, attributeFilter: ['data-state'], childList: true });

        const ro = new ResizeObserver(update);
        ro.observe(list);

        window.addEventListener('resize', update);

        return () => {
            mo.disconnect();
            ro.disconnect();
            window.removeEventListener('resize', update);
        };
    }, [listRef]);

    return <div ref={indicatorRef} className="tabs-indicator" />;
}
