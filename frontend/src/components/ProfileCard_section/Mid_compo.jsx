import React from 'react'
import './Mid_compo.css'

export default function Mid_compo() {
    return (
        <div className="mid-compo-wrapper">
            <iframe
                src="https://www.unicorn.studio/embed/mv8DVEZFyA3h5zQfwj7L"
                width="1440"
                height="870"
                frameBorder="0"
                className="unicorn-iframe"
                title="Our Love Story"
                allowFullScreen
                loading="lazy"
                style={{
                    border: 'none',
                    borderRadius: '10px'
                }}
            />
        </div>
    )
}