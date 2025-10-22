import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Login = () => {
  const { setShowLogin, axios, setToken } = useAppContext();
  const [state, setState] = useState("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const payload =
        state === "login"
          ? { email, password }
          : { firstName, lastName, mobile, email, password };
      const { data } = await axios.post(`/api/auth/${state}`, payload);

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        toast.success(data.message);
        setFirstName("");
        setLastName("");
        setMobile("");
        setEmail("");
        setPassword("");
      } else {
        console.log("Login state: ",state);
        toast.error(data.message,state);
      }
    } catch (error) {
      console.log("Login error: ",error);
      toast.error(error.message);
    }
  };
  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-gray-500 max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
          <span className="text-blue-600">
            <span className="text-amber-800 text-4xl">C</span>ipherStudio
          </span>
        </h2>
        <h4 className="font-medium mb-6 text-center text-xs">
          <span className="text-stone-600">
            {state === "login"
              ? "Welcome Back, Please Login!"
              : "Welcome! Please Register Yourself"}
          </span>
        </h4>

        {state === "register" && (
          <div className="w-full mb-4 space-y-3">
            <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
              <svg
                width="18px"
                height="18px"
                viewBox="0 0 15 15"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                class="si-glyph si-glyph-badge-name"
              >
                <title>673</title>

                <defs></defs>
                <g
                  stroke="none"
                  stroke-width="1"
                  fill="none"
                  fill-rule="evenodd"
                >
                  <g transform="translate(1.000000, 1.000000)" fill="#434343">
                    <path
                      d="M7.997,4.883 C7.469,4.883 7.04,4.671 7.04,3.892 L7.04,0.856 C7.04,0.075 7.469,4.54747351e-13 7.997,4.54747351e-13 C8.525,4.54747351e-13 8.953,0.075 8.953,0.856 L8.953,3.892 C8.953,4.671 8.525,4.883 7.997,4.883 L7.997,4.883 Z"
                      class="si-glyph-fill"
                    ></path>
                    <path
                      d="M10,3.938 L10.058,4.553 C10.058,5.741 9.13649991,6.04999999 7.99949991,6.04999999 C6.86049991,6.04999999 5.936,5.741 5.936,4.553 L5.936,4 L2.047,3.938 C0.938,3.938 0.041,4.807 0.041,5.938 L0.041,12.938 C0.041,14.07 0.937,14.93 2.047,14.93 L13.955,14.93 C15.06,14.93 15.958,14.012 15.958,12.88 L15.958,6.05 C15.958,4.919 15.061,4 13.955,4 L10,3.938 Z M5.49910501,6.938 C6.32696897,6.938 7,7.62560028 7,8.47364061 C7,9.31984735 6.32696897,10.938 5.49910501,10.938 C4.67124105,10.938 4,9.31893055 4,8.47364061 C4.00089499,7.62560028 4.67213604,6.938 5.49910501,6.938 L5.49910501,6.938 Z M8.98256822,12.938 L2.00166571,12.938 C2.00166571,12.938 1.88188822,10.9507215 3.67372082,10.9507215 C4.04657655,11.5240972 4.56142656,12.0765734 5.5080551,12.0765734 C6.45661553,12.0765734 6.90674706,11.5204625 7.27863685,10.938 C9.29456926,10.9389087 8.98256822,12.938 8.98256822,12.938 L8.98256822,12.938 Z M14,12.896 L10,12.896 L10,11.896 L14,11.896 L14,12.896 L14,12.896 Z M14,10.892 L10,10.892 L10,9.892 L14,9.892 L14,10.892 L14,10.892 Z M14,8.896 L10,8.896 L10,7.896 L14,7.896 L14,8.896 L14,8.896 Z"
                      class="si-glyph-fill"
                    ></path>
                  </g>
                </g>
              </svg>

              <input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                placeholder="Enter your first name"
                className="border border-gray-200 rounded w-full p-2 outline-blue-600"
                type="text"
                required
              />
            </div>

            <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
              <svg
                fill="#000000"
                width="18px"
                height="18px"
                viewBox="20 20 60 60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M71.7,20H28.17c-4.58,0-8.3,3.56-8.16,7.81V72.19a7,7,0,0,0,.26,2.23A41.24,41.24,0,0,1,28,70.51c4.38-1.8,4.89-3.38,4.89-5.14S31.6,62,30.19,60.61a12.17,12.17,0,0,1-3.86-9c0-6.81,4.37-12.6,12-12.6s12,5.91,12,12.6a11.29,11.29,0,0,1-3.86,9c-1.41,1.29-2.7,3-2.7,4.76s.65,3.34,4.89,5.14c5.68,2.32,11,4.95,12.14,9.49h11A8.08,8.08,0,0,0,80,72.19V27.81A8.12,8.12,0,0,0,71.7,20ZM71,45.85a2,2,0,0,1-2,2H54a2,2,0,0,1-2-2v-3a2,2,0,0,1,2-2H69a2,2,0,0,1,2,2Zm5-13a2,2,0,0,1-2,2H54a2,2,0,0,1-2-2v-3a2,2,0,0,1,2-2H74a2,2,0,0,1,2,2Z"
                  fill-rule="evenodd"
                />
              </svg>

              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                placeholder="Enter your last name"
                className="border border-gray-200 rounded w-full p-2 outline-blue-600"
                type="text"
                required
              />
            </div>

            <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="18px"
                height="18px"
                viewBox="0 0 32 32"
                enable-background="new 0 0 32 32"
                xml:space="preserve"
              >
                <path
                  fill="none"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-miterlimit="10"
                  d="M13.6,8.5L9.5,4.3C9,3.9,8.3,3.9,7.8,4.3L4.7,7.5
           C4,8.1,3.8,9.1,4.1,9.9c0.8,2.3,2.9,6.9,7,11s8.7,6.1,11,7c0.9,0.3,1.8,0.1,2.5-0.5l3.1-3.1c0.5-0.5,0.5-1.2,0-1.7l-4.1-4.1
           c-0.5-0.5-1.2-0.5-1.7,0l-2.5,2.5c0,0-2.8-1.2-5-3.3s-3.3-5-3.3-5l2.5-2.5C14.1,9.7,14.1,8.9,13.6,8.5z"
                />
              </svg>

              <input
                onChange={(e) => setMobile(e.target.value)}
                value={mobile}
                placeholder="Enter your mobile number"
                className="border border-gray-200 rounded w-full p-2 outline-blue-600"
                type="tel"
                pattern="[0-9]{10}"
              />
            </div>
          </div>
        )}

        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            className="border border-gray-200 rounded w-full p-2 outline-blue-600"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-2 mb-4 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <svg
            width="13"
            height="17"
            viewBox="0 0 13 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              fill="#6B7280"
            />
          </svg>
          <input
            className="border border-gray-200 rounded w-full p-2 outline-blue-600"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {state === "login" && (
          <div className="flex items-center justify-between mb-6">
            <a className="text-blue-600 underline cursor-pointer" href="#">
              Forgot Password?
            </a>
          </div>
        )}

        <button
          type="submit"
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 transition py-2.5 rounded text-white font-medium"
        >
          {state === "login" ? "Log In" : "Sign Up"}
        </button>

        <p className="text-center mt-4">
          {state === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-blue-500 underline cursor-pointer"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="text-blue-500 underline cursor-pointer"
              >
                Log In
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
