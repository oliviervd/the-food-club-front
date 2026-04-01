'use client'

import Image from "next/image.js";

const logo = '/assets/img/logo-blue.png';

const Loading = () => {
    return (
        <div className="loading--container" style={{
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <style>
                {`
                @keyframes spin-loader {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <Image
                    src={logo}
                    alt="Food Club Logo"
                    width={300}
                    height={150}
                    style={{
                        width: '250px',
                        maxWidth: '80vw',
                        height: 'auto',
                    }}
                    priority
                />
                <div className="spinner" style={{
                    width: '50px',
                    height: '50px',
                    border: '6px solid var(--color-main)',
                    borderTop: '6px solid var(--color-secondary)',
                    borderRadius: '50%',
                    animation: 'spin-loader 1s linear infinite'
                }}></div>
            </div>
        </div>
    )
}

export default Loading