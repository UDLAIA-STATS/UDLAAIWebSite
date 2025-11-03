export interface TableActions {
    icon: string;
    alt: string;
    type: "button" | "link";
    href?: string;
    action?: (args: any) => void;
 }

 export interface TableRow {
    data: string[] | number[];
    allowSorting: boolean;
    isVisible?: boolean;
 }

 export interface TableHeaders {
    headers: string[];
    allowSorting: boolean;
    isVisible?: boolean;
 }

 export interface SortOptions {
   searchParam: string;
   displayName: string;
 }