export interface TableActions {
    icon: string;
    alt: string;
    type: "button" | "link";
    href?: string;
    action?: (args: any) => void;
 }

 // Can be rows or headers
 export interface TableContent {
    data: string;
    isVisible?: boolean;
 }

 export interface SortOptions {
   searchParam: string;
   displayName: string;
 }