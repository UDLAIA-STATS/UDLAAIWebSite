import type { Partido } from "@interfaces/index";
import type { Component } from "solid-js";

interface Props {
    partidos: Partido[];
}

export const FormularioVideo: Component<Props> = ({ partidos }: Props) => {
    return (
        <form id="form-analisis-video" class="">
            
        </form>
    )
}