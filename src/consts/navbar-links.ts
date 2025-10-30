import type { Link } from "@interfaces/link.interface";
import { roles } from "@consts/roles"
import {  privateRoutesMap, publicRoutesMap } from "@consts/routes"
import type { LoggedUser } from "@interfaces/user.interface";
import type { Partido } from "@interfaces/partido.interface";

export const getNavbarLinks = (user?: LoggedUser) => {
  let links: Link[] = [
    { name: "Inicio", href: publicRoutesMap.HOME },
    { name: "Visualizar Estadísticas", href: publicRoutesMap.PLAYER_STATS }
  ]

  if (!user) return links;

  if ( user.rol === roles.profesor ) {
    links = [...links,
    { name: "Análisis", href: privateRoutesMap.VIDEO_ANALYSIS },
    { name: "Administrar Jugadores", href: privateRoutesMap.AUTH_ADMIN },
    { name: "Administrar Partidos y Torneos", href: privateRoutesMap.ADMIN_PARTIDOS }
  ]
  }

  if ( user.rol === roles.super ) {
    links = [...links,
    { name: "Analizar Video", href: privateRoutesMap.VIDEO_ANALYSIS },
    { name: "Administrar Usuarios", href: privateRoutesMap.ADMINS_USERS },
    { name: "Administrar Jugadores", href: privateRoutesMap.ADMIN_JUGADORES },
    { name: "Administrar Partidos y Torneos", href: privateRoutesMap.ADMIN_PARTIDOS },
    ]
  }
  return links;
} 

export const navbarLinks: Link[] = [
  { name: "Inicio", href: publicRoutesMap.HOME },
  { name: "Estadísticas", href: publicRoutesMap.PLAYER_STATS },
  { name: "Herramienta", href: privateRoutesMap.VIDEO_ANALYSIS }
];

export const ejemplosPartidos: Partido[] = [
  { nombrePartido: "Partido 1",  portada: "", fecha: "2023-10-01" },
  { nombrePartido: "Partido 2",  portada: "", fecha: "2023-10-15" },
  { nombrePartido: "Partido 3",  portada: "", fecha: "2023-11-05" },
  { nombrePartido: "Partido 4",  portada: "", fecha: "2023-11-20" },
  { nombrePartido: "Partido 5",  portada: "", fecha: "2023-12-01" },
  { nombrePartido: "Partido 6",  portada: "", fecha: "2023-12-15" },
  { nombrePartido: "Partido 7",  portada: "", fecha: "2024-01-05" },
  { nombrePartido: "Partido 8",  portada: "", fecha: "2024-01-20" },
  { nombrePartido: "Partido 9",  portada: "", fecha: "2024-02-01" },
  { nombrePartido: "Partido 10", portada: "",  fecha: "2024-02-15" },
  { nombrePartido: "Partido 11", portada: "",  fecha: "2024-03-05" },
  { nombrePartido: "Partido 12", portada: "",  fecha: "2024-03-20" },
  { nombrePartido: "Partido 13", portada: "",  fecha: "2024-04-01" },
  { nombrePartido: "Partido 14", portada: "",  fecha: "2024-04-15" },
  { nombrePartido: "Partido 15", portada: "",  fecha: "2024-05-05" }, 
  { nombrePartido: "Partido 16", portada: "",  fecha: "2024-05-20" },
  { nombrePartido: "Partido 17", portada: "",  fecha: "2024-06-01" },
  { nombrePartido: "Partido 18", portada: "",  fecha: "2024-06-15" },
  { nombrePartido: "Partido 19", portada: "",  fecha: "2024-07-05" },
  { nombrePartido: "Partido 20", portada: "",  fecha: "2024-07-20" },
  { nombrePartido: "Partido 21", portada: "",  fecha: "2024-08-01" },
  { nombrePartido: "Partido 22", portada: "",  fecha: "2024-08-15" },
  { nombrePartido: "Partido 23", portada: "",  fecha: "2024-09-05" },
  { nombrePartido: "Partido 24", portada: "",  fecha: "2024-09-20" },
  { nombrePartido: "Partido 25", portada: "",  fecha: "2024-10-01" },
];