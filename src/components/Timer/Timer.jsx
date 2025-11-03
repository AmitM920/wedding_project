import React, { useState, useEffect } from 'react'

function Timer() {
    const [time, setTime] = useState(0)
    const [isEventPassed, setIsEventPassed] = useState(false)
    useEffect(() => {
        // Event: Monday, 24 November 2025, 6:00 PM IST
        const eventDate = new Date('2025-11-24T18:00:00+05:30').getTime();
        const currentTime = new Date().getTime();
        const timeRemaining = eventDate - currentTime;
        // Check if event has passed
        if (timeRemaining <= 0) {
            setIsEventPassed(true);
            setTime(0);
        } else {
            setTime(timeRemaining);
        }


        const timer = setTimeout(() => {
            setTime(prevTime => prevTime - 1000)
        }, 1000)

        return () => clearTimeout(timer)
    }, [time, isEventPassed])
    const getFormattedTime = (milliseconds) => {
        // If event has passed, show the special message
        if (isEventPassed) {
            return "~~~~~~~";
        }


        let total_seconds = parseInt(Math.floor(milliseconds / 1000));
        let total_minutes = parseInt(Math.floor(total_seconds / 60));
        let total_hours = parseInt(Math.floor(total_minutes / 60));
        let total_days = parseInt(Math.floor(total_hours / 24));

        let seconds = parseInt(total_seconds % 60);
        let minutes = parseInt(total_minutes % 60);
        let hours = parseInt(total_hours % 24);

        return `${total_days}d ${hours}h ${minutes}m ${seconds}s 💍`
    }
    return (
        <div>{getFormattedTime(time)}</div>
    )
}

export default Timer