export const privateRoutesMap = {
    REGISTER_PLAYER: "/admin/jugadores/crear",
    EDIT_PLAYER: "/admin/jugadores/",
    VIDEO_ANALYSIS: "/equipo/jugadores/analisis-video",
    AUTH_REGISTER: "/admin/usuarios/crear",
    ADMINS_USERS: "/admin/usuarios/?page=1",
    ADMIN_JUGADORES: "/admin/jugadores/?page=1",
    ADMIN_PARTIDOS: "/admin-partidos",
    EDIT_USER: "/admin/usuarios",
    CREAR_PARTIDOS: "/admin/partidos/crear",
    EDITAR_PARTIDOS: "/admin/partidos/",
    VER_PARTIDOS: "/admin/partidos/?page=1",
    EDITAR_TORNEOS: "/admin/torneos/",
    CREAR_TORNEOS: "/admin/torneos/crear",
    VER_TORNEOS: "/admin/torneos/?page=1",
    EDITAR_TEMPORADAS: "/admin/temporadas/",
    CREAR_TEMPORADAS: "/admin/temporadas/crear",
    VER_TEMPORADAS: "/admin/temporadas/?page=1",
    EDITAR_EQUIPOS: "/admin/equipos/",
    CREAR_EQUIPOS: "/admin/equipos/crear",
    VER_EQUIPOS: "/admin/equipos/?page=1",

}



export const publicRoutesMap = {
    HOME: "/",
    PLAYER_STATS: "/equipo/jugadores/estadisticas?page=1",
    PLAYER_STATS_SEASONS: "/equipo/temporadas/estadisticas?page=1",
    PLAYER_DETAIL: "/equipo/jugadores/jugador",
    AUTH_LOGIN: "/auth/login",
    404: "/404",
}
