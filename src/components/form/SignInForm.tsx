import PasswordInput from "@/components/input/PasswordInput";
import type { ApiResponse } from "@/schema/api-response";
import type { SignIn } from "@/schema/sign-in";
import { HOME_URL } from "@/util/constants";
import { formDataToJson } from "@/util/transformers";
import { useSignal } from "@preact/signals";

export default function SignInForm() {
  const errorMessage = useSignal<string | null>(null);

  const handleSubmit = async (event: SubmitEvent) => {
    errorMessage.value = "";
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const response = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formDataToJson(formData),
    });

    const { error } = await response.json() as ApiResponse<SignIn>;

    if (response.status === 200) {
      window.location.replace(HOME_URL);
      return;
    }

    if (error) {
      // TODO: SHOW ERROR
      console.log(error);

      if (error === "authentication_error") {
        errorMessage.value = "Contraseña o corre no existen";
      }
    }
  };

  return (
    <form
      class="flex flex-col gap-2 items-center"
      method="POST"
      onSubmit={handleSubmit}
    >
      {errorMessage.value && (
        <div role="alert" class="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{errorMessage.value}</span>
        </div>
      )}
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
          class="icon icon-tabler icons-tabler-outline icon-tabler-user"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
        </svg>
        <input
          type="email"
          name="email"
          id="email"
          class="grow"
          placeholder="Correo*"
        />
      </label>
      <PasswordInput />
      <button type="submit" class="btn btn-primary">Ingresar</button>
    </form>
  );
}
