import React, { useState, useRef, useEffect } from "react";
import { Card } from "./ui/card";

const CustomPopover = ({ trigger, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);

    // Close the popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={popoverRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex-shrink-0 p-1 size-6 text-muted-foreground hover:text-primary hover:bg-transparent"
            >
                {trigger}
            </button>

            {/* Popover Content */}
            {isOpen && (
                <Card className="borde bg-popover min-w-48 p-1 absolute rounded-lg">
                    {children}
                </Card>
            )}
        </div>
    );
};

export default CustomPopover;