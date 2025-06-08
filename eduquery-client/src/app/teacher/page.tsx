'use client';

import { useEffect, useState, useRef } from "react";

export default function Page() {
  const [classStarted, setClassStarted] = useState(false);
  const [fullname, setFullname] = useState('');
  const [students, setStudents] = useState([]);
  const [firstStudent, setFirstStudent] = useState({});

  const chronoRef = useRef(null);

  const secondsRef = useRef(0);
  const minutesRef = useRef(0);
  const hoursRef = useRef(0);

  
  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const dniCookie = cookies.find(row => row.startsWith('dni='));
    const classStartedCookie = cookies.find(row => row.startsWith('classStarted='));
    
    const dni = dniCookie ? dniCookie.split('=')[1] : null;
    const classStartedValue = classStartedCookie ? classStartedCookie.split('=')[1] : null;

  listStudents();

    if (classStartedValue === 'true') {
      setClassStarted(true);
    }

    if (dni) {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/getUserInfo");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFullname(response.fullname);
        } else {
          console.error(`Error: ${xhr.status}`);
        }
      };

      const body = JSON.stringify({
        role: "teacher",
        dni: dni,
      });

      xhr.send(body);
    }
  }, []);


function chronometer() {
  secondsRef.current++;
  if (secondsRef.current >= 60) {
    secondsRef.current = 0;
    minutesRef.current++;
  }
  if (minutesRef.current >= 60) {
    minutesRef.current = 0;
    hoursRef.current++;
  }

  document.getElementById("crono-hours").innerHTML = (hoursRef.current < 10 ? "0" : "") + hoursRef.current;
  document.getElementById("crono-minutes").innerHTML = ":" + (minutesRef.current < 10 ? "0" : "") + minutesRef.current;
  document.getElementById("crono-seconds").innerHTML = ":" + (secondsRef.current < 10 ? "0" : "") + secondsRef.current;
}
  
  const listStudents = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/getStudentsinQueue");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setFirstStudent(response[0]);
        setStudents(response.slice(1));
      } else {
        console.error(`Error: ${xhr.status}`);
      }
    };

    const body = JSON.stringify({
        id_teacher: 1,  //TODO: Cambiar por el id del profesor
        date: new Date().toISOString().split('T')[0],
      });

    xhr.send(body);
  };



const startClass = () => {
  document.cookie = "classStarted=true; path=/";
  setClassStarted(true);
  secondsRef.current = 0;
  minutesRef.current = 0;
  hoursRef.current = 0;
  chronoRef.current = setInterval(chronometer, 1000);
  setInterval(listStudents, 30000); 
};

const pauseClass = () => {
  if(chronoRef.current) {
    clearInterval(chronoRef.current);
    chronoRef.current = null;
  }
};

  const resumeClass = () => {
    if(!chronoRef.current) {
      chronoRef.current = setInterval(chronometer, 1000);
    }
  };

  const nextStudent = () => {
    if (students.length > 0) {
      const next = students[0];
      setFirstStudent(next);
      setStudents(students.slice(1));
      secondsRef.current = 0;
      minutesRef.current = 0;
      hoursRef.current = 0;  
    };
};


  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)] bg-black">
      <header className="p-4 border-b-4 border-b-blue-400 flex justify-between items-center">
        <h1 className="bg-radial from-sky-200 via-blue-400 to-indigo-900 to-90% bg-clip-text text-transparent text-6xl font-bold transition-all duration-700 ease-in-out">
          EduQuery
        </h1>
        <h1 className="bg-radial from-sky-200 via-blue-400 to-indigo-900 to-90% bg-clip-text text-tr  ansparent font-bold py-2 px-4 rounded-lg">
          Teacher
        </h1>
      </header>

      {!classStarted && (
        <main className="flex-1 flex flex-col justify-center items-center w-full px-4">
          <div id='startDiv' className="flex flex-col items-center justify-center w-full max-w-xl">
            <button id='startBtn' className="bg-blue-500 text-3xl text-white py-3 px-4 rounded-lg hover:bg-blue-700 w-full max-w-xl " onClick={startClass}>
              Start
            </button>
          </div>
        </main>
      )}

      {classStarted && (
        <main className="flex-1 flex flex-col items-center w-full px-4 relative">
          <div className="flex flex-col items-center justify-center w-full max-w-xl">
            <div className="bg-blue-400 text-3xl text-indigo-900 py-3 px-4 rounded-b-lg text-center w-full max-w-xl">
              {fullname || "Loading..."}
            </div>
          </div>
          <div className="absolute bottom-1/2 left-6 flex items-center ">
            <div id="crono-hours" className="text-9xl text-blue-400 font-bold">
              00
            </div>
            <div id="crono-minutes" className="text-9xl text-blue-400 font-bold">
              :00
            </div>
            <div id="crono-seconds" className="text-9xl text-blue-400 font-bold">
              :00
            </div>
          </div>
          <div className="absolute bottom-1/2 center flex items-center">
          {firstStudent && (
              <div  className="bg-white rounded-lg inline-flex items-center justify-center p-4">
                <div className="text-8xl text-blue-400 font-bold">
                  {firstStudent.fullname}
                </div>
              </div>
            )}
          </div>
          <div className="absolute bottom-1/3 center flex items-center">
            <div className="text-3xl text-blue-400 font-bold space-x-4">
              <button
                title="Remove student"
                className="text-3xl bg-white cursor-pointer rounded-lg p-0.5"
                onClick={pauseClass}>
                Pause⏸️
              </button>
              <button
                // disabled={true}
                title="Remove student"
                className="text-3xl bg-white cursor-pointer rounded-lg p-0.5"
                onClick={resumeClass}>
                Continue▶️
              </button>
            </div>
          </div>

          <div className="absolute bottom-1/8 center flex items-center">
            <div className="text-8xl text-blue-400 font-bold space-x-4">
              <button
                className="text-6xl bg-blue-400 text-white cursor-pointer rounded-lg p-0.5 hover:bg-blue-700 hover:text-blue-400"
                onClick={nextStudent}>
                Next ->
              </button>
            </div>
            </div>

          <div id="queue" className="absolute bottom-5 right-6 top-20 bg-gray-950 flex flex-col items-start rounded-lg p-4 space-y-4">
            {students.filter(student => !student.ended).map((student, index) => (
              <div  className="text-8xl text-blue-400 font-bold bg-white rounded-lg inline-flex items-center justify-center p-4">
                <div className="text-3xl text-blue-400 font-bold pr-15">{student.fullname}</div>
                <button
                  key={index}
                  title="Remove student"
                  className="text-3xl cursor-pointer"
                  onClick={() => console.log("funciona")}>
                  🛑
                </button>
              </div>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
