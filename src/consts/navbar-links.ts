import type { Link } from "@interfaces/link.interface";
import { roles } from "@consts/roles";
import { privateRoutesMap, publicRoutesMap } from "@consts/routes";
import type { LoggedUser } from "@interfaces/user.interface";

export const matchSidebarLinks: Link[] = [
  { name: "Temporadas", href: "/admin/temporadas/?page=1" },
  { name: "Torneos", href: "/admin/torneos/?page=1" },
  { name: "Equipos", href: "/admin/equipos/?page=1" },
  { name: "Partidos", href: "/admin/partidos/?page=1" },
];

export const getNavbarLinks = (user?: LoggedUser) => {
  let links: Link[] = [
    { name: "Módulo de estadísticas", href: publicRoutesMap.PLAYER_STATS },
  ];

  if (!user) return links;

  if (user.rol === roles.profesor) {
    links = [
      ...links,
      {
        name: "Módulo de subida de video",
        href: privateRoutesMap.VIDEO_ANALYSIS,
      },
      { name: "Módulo Jugadores", href: privateRoutesMap.ADMIN_JUGADORES },
      {
        name: "Módulo Partidos y Torneos",
        href: privateRoutesMap.ADMIN_PARTIDOS,
      },
    ];
  }

  if (user.rol === roles.super) {
    links = [
      ...links,
      {
        name: "Módulo de subida de video",
        href: privateRoutesMap.VIDEO_ANALYSIS,
      },
      { name: "Módulo Usuarios", href: privateRoutesMap.ADMINS_USERS },
      { name: "Módulo Jugadores", href: privateRoutesMap.ADMIN_JUGADORES },
      {
        name: "Módulo Partidos y Torneos",
        href: privateRoutesMap.ADMIN_PARTIDOS,
      },
    ];
  }
  return links;
};

export const navbarLinks: Link[] = [
  { name: "Inicio", href: publicRoutesMap.HOME },
  { name: "Módulo de estadísticas", href: publicRoutesMap.PLAYER_STATS },
  { name: "Módulo de subida de video", href: privateRoutesMap.VIDEO_ANALYSIS },
];
