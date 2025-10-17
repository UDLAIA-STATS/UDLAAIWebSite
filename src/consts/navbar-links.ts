import type { Link } from "@interfaces/link.interface";
import { roles } from "@consts/roles"
import {  privateRoutesMap, publicRoutesMap } from "@consts/routes"
import type { User } from "@interfaces/user.interface";

export const getNavbarLinks = (user?: User) => {
  let links: Link[] = [
    { name: "Inicio", href: publicRoutesMap.HOME },
    { name: "Estadísticas", href: publicRoutesMap.PLAYER_STATS }
  ]

  if (!user) return links;

  if (user.rol === roles.super) {
    links = [...links, { name: "Administrar usuarios", href: privateRoutesMap.AUTH_ADMIN }]
  }

  if ( user.rol === roles.super || user.rol === roles.profesor ) {
    links = [...links,
      { name: "Análisis", href: privateRoutesMap.VIDEO_ANALYSIS }
    ]
  }
  return links;
} 

export const navbarLinks: Link[] = [
  { name: "Inicio", href: publicRoutesMap.HOME },
  { name: "Estadísticas", href: publicRoutesMap.PLAYER_STATS },
  { name: "Herramienta", href: privateRoutesMap.VIDEO_ANALYSIS }
];

export const ejemplosPartidos = [
  { partido: "Partido 1", fecha: "2023-10-01" },
  { partido: "Partido 2", fecha: "2023-10-15" },
  { partido: "Partido 3", fecha: "2023-11-05" },
  { partido: "Partido 4", fecha: "2023-11-20" },
  { partido: "Partido 5", fecha: "2023-12-01" },
  { partido: "Partido 6", fecha: "2023-12-15" },
  { partido: "Partido 7", fecha: "2024-01-05" },
  { partido: "Partido 8", fecha: "2024-01-20" },
  { partido: "Partido 9", fecha: "2024-02-01" },
  { partido: "Partido 10", fecha: "2024-02-15" },
  { partido: "Partido 11", fecha: "2024-03-05" },
  { partido: "Partido 12", fecha: "2024-03-20" },
  { partido: "Partido 13", fecha: "2024-04-01" },
  { partido: "Partido 14", fecha: "2024-04-15" },
  { partido: "Partido 15", fecha: "2024-05-05" }, 
  { partido: "Partido 16", fecha: "2024-05-20" },
  { partido: "Partido 17", fecha: "2024-06-01" },
  { partido: "Partido 18", fecha: "2024-06-15" },
  { partido: "Partido 19", fecha: "2024-07-05" },
  { partido: "Partido 20", fecha: "2024-07-20" },
  { partido: "Partido 21", fecha: "2024-08-01" },
  { partido: "Partido 22", fecha: "2024-08-15" },
  { partido: "Partido 23", fecha: "2024-09-05" },
  { partido: "Partido 24", fecha: "2024-09-20" },
  { partido: "Partido 25", fecha: "2024-10-01" },
]