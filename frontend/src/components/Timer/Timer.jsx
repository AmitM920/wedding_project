// //

// import React, { useState, useEffect, useRef, memo } from 'react'

// const Timer = memo(function Timer() {
//     const [time, setTime] = useState(0)
//     const [isEventPassed, setIsEventPassed] = useState(false)
//     const timerRef = useRef(null)

//     useEffect(() => {
//         // Calculate initial time once
//         const eventDate = new Date('2025-11-24T18:00:00+05:30').getTime();
//         const currentTime = new Date().getTime();
//         const timeRemaining = eventDate - currentTime;

//         // Check if event has passed
//         if (timeRemaining <= 0) {
//             setIsEventPassed(true);
//             setTime(0);
//         } else {
//             setTime(timeRemaining);
//         }

//         // Set up interval instead of timeout with recursion
//         timerRef.current = setInterval(() => {
//             setTime(prevTime => {
//                 if (prevTime <= 1000) {
//                     setIsEventPassed(true);
//                     clearInterval(timerRef.current);
//                     return 0;
//                 }
//                 return prevTime - 1000;
//             });
//         }, 1000);
//         // Cleanup interval on component unmount
//         return () => {
//             if (timerRef.current) {
//                 clearInterval(timerRef.current);
//             }
//         }
//     }, []) // ✅ Empty dependency array - runs only once

//     const getFormattedTime = (milliseconds) => {
//         // If event has passed, show the special message
//         if (isEventPassed) {
//             return "Our Special Day! 💑";
//         }

//         // If time is not yet calculated, show loading
//         if (milliseconds === 0) {
//             return "Loading...";
//         }

//         let total_seconds = parseInt(Math.floor(milliseconds / 1000));
//         let total_minutes = parseInt(Math.floor(total_seconds / 60));
//         let total_hours = parseInt(Math.floor(total_minutes / 60));
//         let total_days = parseInt(Math.floor(total_hours / 24));

//         let seconds = parseInt(total_seconds % 60);
//         let minutes = parseInt(total_minutes % 60);
//         let hours = parseInt(total_hours % 24);

//         return `${total_days}d ${hours}h ${minutes}m ${seconds}s 💍`
//     }
//     return (
//         <div className="timer">{getFormattedTime(time)}</div>
//     )
// });

// export default Timer;

import React, { useState, useEffect, useRef, memo, useCallback } from 'react'

const Timer = memo(function Timer() {
    const [time, setTime] = useState(0)
    const [isEventPassed, setIsEventPassed] = useState(false)
    const timerRef = useRef(null)

    // ✅ Memoized time calculation
    const calculateTimeRemaining = useCallback(() => {
        const eventDate = new Date('2025-11-24T18:00:00+05:30').getTime();
        const currentTime = new Date().getTime();
        return eventDate - currentTime;
    }, []);

    // ✅ Memoized time formatter
    const getFormattedTime = useCallback((milliseconds) => {
        if (isEventPassed) return "Our Special Day! 💑";
        if (milliseconds === 0) return "Loading...";

        const total_seconds = Math.floor(milliseconds / 1000);
        const total_minutes = Math.floor(total_seconds / 60);
        const total_hours = Math.floor(total_minutes / 60);
        const total_days = Math.floor(total_hours / 24);

        const seconds = total_seconds % 60;
        const minutes = total_minutes % 60;
        const hours = total_hours % 24;

        return `${total_days}d ${hours}h ${minutes}m ${seconds}s 💍`;
    }, [isEventPassed]);

    useEffect(() => {
        const timeRemaining = calculateTimeRemaining();

        if (timeRemaining <= 0) {
            setIsEventPassed(true);
            setTime(0);
        } else {
            setTime(timeRemaining);
        }

        timerRef.current = setInterval(() => {
            setTime(prevTime => {
                if (prevTime <= 1000) {
                    setIsEventPassed(true);
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prevTime - 1000;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    }, [calculateTimeRemaining]);

    return (
        <div className="timer">{getFormattedTime(time)}</div>
    )
});

export default Timer;