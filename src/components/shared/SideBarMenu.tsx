import { createSignal, For, Show, type Component } from "solid-js";
import { getNavbarLinks } from "@consts/navbar-links";
import LogoUdla from "@assets/logo_udla.svg";

interface Props {
  user?: LoggedUser | null;
}

const SidebarMenu: Component<Props> = ({ user }: Props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const links = () => getNavbarLinks(user ?? undefined);

  return (
    <>
      {/* Botón Hamburguesa (controlado por el padre en posicionamiento) */}
      <button
        class="flex flex-col justify-center align-middle items-center w-10 h-10 cursor-pointer text-white rounded-md transition hover:bg-[#8a0120]"
        onClick={() => setIsOpen(!isOpen())}
        aria-label="Abrir menú"
      >
        <div
          class={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen() ? "rotate-45 translate-y-1.5" : ""
          }`}
        />
        <div
          class={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${
            isOpen() ? "opacity-0" : ""
          }`}
        />
        <div
          class={`w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen() ? "-rotate-45 -translate-y-1.5" : ""
          }`}
        />
      </button>

      {/* Fondo gris oscuro con transparencia (70%) */}
      <Show when={isOpen()}>
        <div
          class="fixed inset-0 z-40 transition-opacity duration-300"
          style="background-color: rgba(0, 0, 0, 0.7);"
          onClick={() => setIsOpen(false)}
        />
      </Show>

      {/* Sidebar lateral */}
      <div
        class={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen() ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <a
            href="/"
            class="flex items-center no-underline w-fit flex-wrap line-clamp-2"
          >
            <img src={LogoUdla.src} alt="Logo UDLA" class="h-8" />
          </a>
        </div>

        {/* Contenido del menú */}
        <nav class="p-5 overflow-y-auto h-[calc(100%-4rem)]">
          <For each={links()}>
            {(link) => (
              <a
                href={link.href}
                class="block text-gray-800 py-2 px-3 rounded-md hover:bg-[#a10127]/10 hover:text-[#a10127] transition text-base"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            )}
          </For>

          {/* Sección de usuario */}
          <Show when={user}>
            <div class="mt-6 border-t pt-4">
              <p class="text-sm text-gray-500">Conectado como:</p>
              <p class="font-semibold text-[#a10127]">
                {user?.rol?.toUpperCase()}
              </p>
            </div>
          </Show>
        </nav>
      </div>
    </>
  );
};

export default SidebarMenu;
