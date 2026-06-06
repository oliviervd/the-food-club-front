import ProfileClient from './profileClient.jsx';

export async function generateMetadata() {
    return {
        title: "The Food Club - My Profile",
        description: "Your saved venues and favourites.",
        robots: { index: false, follow: false },
    };
}

export default function ProfilePage() {
    return <ProfileClient />;
}