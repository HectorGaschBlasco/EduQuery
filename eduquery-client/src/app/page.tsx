"use client";

import { redirect } from 'next/navigation';


import { useEffect, useState } from "react";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function Home() {
  const [selectedRole, setSelectedRole] = useState<"teacher" | "student" | null>(null);
  const [selectedSign, setSelectedSign] = useState<"in" | "up" | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (selectedRole) {
      setTimeout(() => setShowForm(true), 50);
    } else {
      setShowForm(false);
    }
  }, [selectedRole]);
  useEffect(() => {
    if (selectedSign) {
      setTimeout(() => setShowForm(true), 50);
    } else {
      setShowForm(false);
    }
  }, [selectedSign]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedRole(null);
        setSelectedSign(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const validateDNI = (dni: string) => {
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const dniLetter = dni.charAt(dni.length - 1);
    const dniNumber = dni.slice(0, -1);
    const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
    const dniIndex = parseInt(dniNumber) % 23;
    const dniValidLetter = dniLetters.charAt(dniIndex);
    return dniRegex.test(dni) && dniLetter === dniValidLetter;
  };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const validateBirthdate = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const alert_error = (field: string) => toast.error(`Please fill the ${field} field`, 
    {position: "bottom-center",autoClose: 5000,hideProgressBar: false,closeOnClick: true,pauseOnHover: true,
      draggable: true,progress: undefined,theme: "light",transition: Slide
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const registerUser = (role: string, sign: string) => {
  const fullname = document.getElementById(`${role}-${sign}-fullname`) as HTMLInputElement;
  const dni = document.getElementById(`${role}-${sign}-dni`) as HTMLInputElement;
  const address = document.getElementById(`${role}-${sign}-address`) as HTMLInputElement;
  const telephone = document.getElementById(`${role}-${sign}-telephone`) as HTMLInputElement;
  const birthdate = document.getElementById(`${role}-${sign}-birthdate`) as HTMLInputElement;
  const password = document.getElementById(`${role}-${sign}-password`) as HTMLInputElement;
  const rpassword = document.getElementById(`${role}-${sign}-rpassword`) as HTMLInputElement;

  if (fullname.value === "") {
    alert_error("name");
    return;
  } else if (dni.value === "") {
    alert_error("DNI");
    return;
  }else if (validateDNI(dni.value) === false) {
    toast.error('The DNI is not valid', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
      closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide
    });
    return;
  } else if (address.value === "") {
    alert_error("address");
    return;
  } else if (telephone.value === "") {
    alert_error("telephone");
    return;
  } else if (birthdate.value === "") {
    alert_error("birthdate");
    return;
  } else if (validateBirthdate(birthdate.value) < 18) {
    toast.error('You must be at least 18 years old', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
      closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide
    });
    return;
  } else if (password.value === "") {
    alert_error("password");
    return;
  } else if (password.value !== rpassword.value) {
    toast.error('The passwords do not match', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
      closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide
    });
    return;
  }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/signup");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({
      "role": role,
      "fullname": fullname.value,
      "dni": dni.value,
      "address": address.value,
      "telephone": telephone.value,
      "birthdate": birthdate.value,
      "pwd": password.value,
    });
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.status == 200) {
        console.log(xhr.response.message.value);

        toast.success('Registred correctly', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
          closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide
        });

        setSelectedRole(null);
        setSelectedSign(null);

      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const logUser = (role: string, sign: string) => {
  const dni = document.getElementById(`${role}-${sign}-dni`) as HTMLInputElement;
  const password = document.getElementById(`${role}-${sign}-password`) as HTMLInputElement;

  if (dni.value === "") {
    alert_error("DNI");
    return;
  } else if (validateDNI(dni.value) === false) {
    toast.error('The DNI is not valid', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
      closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide
    });
    return;
  } else if (password.value === "") {
    alert_error("password");
    return;
  }

  const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/signin");
    xhr.setRequestHeader("Content-Type", "application/json");
    const body = JSON.stringify({
      "role": role,
      "dni": dni.value,
      "pwd": password.value,
    });
    xhr.send(body);
    xhr.onload = () => {
      if (xhr.status == 200) {
        console.log(JSON.parse(xhr.responseText));

        toast.success('Registred correctly, redirecting', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
          closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide, 
          onClose: () => {
            redirect(`/${role}`);
          }
        });

        setSelectedRole(null);
        setSelectedSign(null);

      } else if(xhr.status == 400){
        if (JSON.parse(xhr.response).message == "User not found"){
          toast.error('User not found', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
          closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide
        });
        } else if (JSON.parse(xhr.response).message == "Password incorrect"){
          toast.error('Password incorrect', {position: "bottom-center",autoClose: 5000,hideProgressBar: false,
          closeOnClick: true,pauseOnHover: true,draggable: true,progress: undefined,theme: "light",transition: Slide
        });
        }
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <div className="grid grid-rows-[0px_1fr_0px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ToastContainer />
      <main className="flex flex-col gap-[32px] row-start-2 items-center transition-all duration-700 ease-in-out">
        <h1
          className={`bg-radial from-sky-200 via-blue-400 to-indigo-900 to-90% bg-clip-text text-transparent text-8xl font-bold text-center transition-all duration-700 ease-in-out ${
            selectedRole ? "translate-y-[-25px] scale-95" : ""
          } ${
            selectedSign ? "translate-y-[-50px] scale-95" : ""
          }`}
        >
          EduQuery
        </h1>

        {/* Buttons */}
        {!selectedRole && (
          <div className="flex justify-center items-center gap-10 sm:gap-20 flex-col sm:flex-row transition-all duration-700 ease-in-out">
            <button
              onClick={() => setSelectedRole("teacher")}
              className="bg-gradient-to-r from-sky-200 via-blue-400 to-indigo-900 text-white dark:text-black 
              hover:from-sky-100 hover:via-blue-300 hover:to-indigo-800 font-medium 
              text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 
              md:w-[158px] rounded-full transition-transform duration-700 ease-in-out 
              transform hover:scale-105 cursor-pointer"
            >
              Professorate
            </button>
            <button
              onClick={() => setSelectedRole("student")}
              className="bg-gradient-to-r from-indigo-900 via-blue-400 to-sky-200 text-white dark:text-black 
              hover:from-indigo-800 hover:via-blue-300 hover:to-sky-100 font-medium 
              text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 
              md:w-[158px] rounded-full transition-transform duration-700 ease-in-out 
              transform hover:scale-105 cursor-pointer"
            >
              Student
            </button>
          </div>
        )}

      {selectedRole && !selectedSign && (
          <div className={`flex w-full max-w-md justify-center items-center gap-5 sm:gap-10 flex-col transition-opacity duration-700 ease-in-out${showForm ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-3xl font-semibold mb-4 text-sky-200">
                {selectedRole === "teacher" ? "Professorate" : "Student"}
            </h2>
            <button
              onClick={() => setSelectedSign("in")}
              className="bg-radial from-sky-200 via-blue-400 to-indigo-900 text-white dark:text-black 
              hover:from-sky-100 hover:via-blue-300 hover:to-indigo-800 font-medium 
              text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 
              md:w-[158px] rounded-full transition-transform duration-700 ease-in-out 
              transform hover:scale-105 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => setSelectedSign("up")}
              className="bg-radial from-sky-200 via-blue-400 to-indigo-900 text-white dark:text-black 
              hover:from-sky-100 hover:via-blue-300 hover:to-indigo-800 font-medium 
              text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 
              md:w-[158px] rounded-full transition-transform duration-700 ease-in-out 
              transform hover:scale-105 cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        )}

        {selectedSign == "up" && (
          <div className={`flex w-full max-w-md justify-center items-center gap-5 sm:gap-10 flex-col transition-opacity duration-700 ${showForm ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-3xl font-semibold mb-4 text-sky-200">
                {selectedRole === "teacher" ? "Professorate" : "Student"}
            </h2>
            <form className="w-full max-w-sm">
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    Full Name
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-fullname`} type="text" placeholder="Jane Doe"/>
                </div>
              </div>
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    DNI
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-dni`} type="text" placeholder="11111111A"/>
                </div>
              </div>
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    Address
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-address`} type="text" placeholder="C/ Example, 01"/>
                </div>
              </div>
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    Telephone
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-telephone`} type="number" placeholder="666666666"/>
                </div>
              </div>
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    Birthdate
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-birthdate`} type="date" placeholder="01/01/2001"/>
                </div>
              </div>
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    Password
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-password`} type="password" placeholder="*************"/>
                </div>
              </div>
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    Repeat password
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-rpassword`} type="password" placeholder="*************"/>
                </div>
              </div>
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3"></div>
              </div>
              <div className="md:flex md:items-center">
                <div className="md:w-1/3"></div>
                <div className="md:w-2/3">
                  <button className="bg-radial from-sky-200 via-blue-400 to-indigo-900 text-gray-700 
                    hover:from-sky-100 hover:via-blue-300 hover:to-indigo-800 hover:scale-105 focus:shadow-outline 
                    focus:outline-none font-bold py-2 px-4 rounded cursor-pointer" type="button" onClick={() => registerUser(selectedRole || "", selectedSign)}>
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>
          
        )}

        {selectedSign == "in" && (
          <div className={`flex w-full max-w-md justify-center items-center gap-5 sm:gap-10 flex-col transition-opacity duration-700 ${showForm ? "opacity-100" : "opacity-0"}`}>
            <h2 className="text-3xl font-semibold mb-4 text-sky-200">
                {selectedRole === "teacher" ? "Professorate" : "Student"}
            </h2>
            <form className="w-full max-w-sm">
              <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    DNI
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-dni`} type="text" placeholder="11111111A"/>
               </div>
             </div>
             <div className="md:flex md:items-center mb-5">
                <div className="md:w-1/3">
                  <label className="block text-sky-200 font-bold md:text-right mb-1 md:mb-0 pr-4" >
                    Password
                  </label>
                </div>
                <div className="md:w-2/3">
                  <input className="bg-gray-200 appearance-none border-2 
                  border-gray-200 rounded w-full py-2 px-4 
                  text-gray-700 leading-tight focus:outline-none focus:bg-white 
                  focus:border-blue-300" id={`${selectedRole}-${selectedSign}-password`} type="password" placeholder="*************"/>
                </div>
              </div>
              <div className="md:flex md:items-center">
                <div className="md:w-1/3"></div>
                <div className="md:w-2/3">
                  <button className="bg-radial from-sky-200 via-blue-400 to-indigo-900 text-gray-700 
                    hover:from-sky-100 hover:via-blue-300 hover:to-indigo-800 hover:scale-105 focus:shadow-outline 
                    focus:outline-none font-bold py-2 px-4 rounded cursor-pointer" type="button" onClick={() => logUser(selectedRole || "", selectedSign)}>
                    Sign In
                  </button>
                </div>
              </div>
           </form>
         </div>
        )}

      </main>
    </div>
  );
}
