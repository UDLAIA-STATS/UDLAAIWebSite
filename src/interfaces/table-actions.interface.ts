export interface TableActions {
    icon: string;
    alt: string;
    type: "button" | "link";
    href?: string;
    action?: () => void;
 }