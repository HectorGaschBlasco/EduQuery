'use client';

import { useEffect, useState } from "react";

export default function Page() {
  const [fullname, setFullname] = useState('');
  const [studentId, setStudentId] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [queue, setQueue] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const dniCookie = cookies.find(row => row.startsWith('dni='));
    const dni = dniCookie ? dniCookie.split('=')[1] : null;

    if (dni) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/getUserInfo");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response)
          setFullname(response.fullname);
          setStudentId(response.id); 
        } else {
          console.error(`Error: ${xhr.status}`);
        }
      };

      const body = JSON.stringify({
        role: "student",
        dni: dni,
      });

      xhr.send(body);
    }

    const xhr2 = new XMLHttpRequest();
    xhr2.open("GET", "http://localhost:8000/getTeachersNames");

    xhr2.onload = () => {
      if (xhr2.status === 200) {
        const response = JSON.parse(xhr2.responseText);
        setTeachers(response); // Guarda los profesores como array
      } else {
        console.error(`Error: ${xhr2.status}`);
      }
    };

    xhr2.send();
  }, []);

  const startClass = (teacherId: string) => {
    setQueue(true);
    const xhr3 = new XMLHttpRequest();
    xhr3.open("POST", "http://localhost:8000/setTeacherQueue");
    xhr3.setRequestHeader("Content-Type", "application/json");

      xhr3.onload = () => {
        if (xhr3.status === 200) {
          const response = JSON.parse(xhr3.responseText);
          console.log(response)
        } else {
          console.error(`Error: ${xhr3.status}`);
        }
      };

      const body = JSON.stringify({
        id_student: studentId,
        id_teacher: teacherId,
        date: new Date().toISOString(),
        ended: false,
      });

      xhr3.send(body);
    }



  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-black">
      <header className="p-4 border-b-4 border-b-blue-400 flex justify-between items-center">
        <h1 className="bg-radial from-sky-200 via-blue-400 to-indigo-900 to-90% bg-clip-text text-transparent text-6xl font-bold transition-all duration-700 ease-in-out">
          EduQuery
        </h1>
        <h1 className="bg-radial from-sky-200 via-blue-400 to-indigo-900 to-90% bg-clip-text text-transparent font-bold py-2 px-4 rounded-lg">
          Student
        </h1>
      </header>
      <main className="flex-1 flex flex-col items-center w-full px-4 relative">
        <div className="flex flex-col items-center justify-center w-full max-w-xl">
          <div className="bg-blue-400 text-3xl text-indigo-900 py-3 px-4 rounded-b-lg text-center w-full max-w-xl">
            {fullname || "Loading..."}
          </div>
        </div>
        {!queue && (<div id="div_teachers" className="flex flex-row flex-wrap gap-2 mt-6 w-full ">
          {teachers.map((teacher, index) => (
            <button
              key={index}
              className="bg-blue-500 text-2xl text-white py-3 px-4 rounded-lg hover:bg-blue-700 cursor-pointer"
              onClick={() => startClass(teacher.id)}
            >
              Queue up to: {teacher.fullname || "Loading..."}
            </button>
          ))}
        </div>)}

      </main>
    </div>
  );
}
