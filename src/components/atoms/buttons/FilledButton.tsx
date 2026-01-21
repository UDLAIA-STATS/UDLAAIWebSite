import { createSignal, type Component, createEffect } from "solid-js";

interface Props {
    icon?: string;
    className?: string;
    alt: string; 
    id: string;
    onClick?: () => void;
    label: string
}

export const FilledButton: Component<Props> = ({
    icon,
    alt,
    id,
    onClick,
    className,
    label
}: Props) => {
    const [clicked, setClicked] = createSignal(false);
    createEffect(() => {
        if (clicked()) {
            setClicked(!clicked());
            onClick && onClick();
        }

    });

    return (
        <div class={`flex flex-col justify-center align-middle w-fit h-fit p-0 m-0 ${className}`}>
        <button 
        id={id} 
        onClick={() => setClicked(true)} 
        aria-label={alt} 
        class={`flex text-white bg-[#C10230] border-[#C10230] border-solid border-2 cursor-pointer px-4 py-2 gap-2 rounded-md align-middle justify-center`}>
            {label}
            {icon && <img src={icon} alt={alt} class="flex size-7 align-middle justify-center" />}
        </button>
        </div>
    )
}