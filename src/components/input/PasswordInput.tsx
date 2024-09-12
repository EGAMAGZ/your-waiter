import { useSignal } from "@preact/signals";

export default function PasswordInput() {
    const showPassword = useSignal(false);
    return (
        <label class="input input-bordered flex items-center gap-2 max-w-xs w-full">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon icon-tabler icons-tabler-outline icon-tabler-lock"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z">
                </path>
                <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
            </svg>
            <input
                type={`${showPassword.value ? "text" : "password"}`}
                name="password"
                id="password"
                class="grow"
                placeholder="Contraseña*"
            />

            <svg
                xmlns="http://www.w3.org/2000/svg"
                id="show-password"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={`icon icon-tabler icons-tabler-outline icon-tabler-eye w-6 h-6 ${
                    showPassword.value ? "hidden" : ""
                }`}
                onClick={() => {
                    showPassword.value = false;
			console.log("	")
                }}
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6">
                </path>
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                id="hide-password"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class={`icon icon-tabler icons-tabler-outline icon-tabler-eye-off w-6 h-6 ${
                    showPassword.value ? "" : "hidden"
                }`}
                onClick={() => {
                    showPassword.value = true;
                }}
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87">
                </path>
                <path d="M3 3l18 18"></path>
            </svg>
        </label>
    );
}
