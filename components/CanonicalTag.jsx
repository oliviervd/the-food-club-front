'use client'

import Head from 'next/head';

export default function CanonicalTag({ href }) {
    return (
        <Head>
            <link rel="canonical" href={href} />
        </Head>
    );
}