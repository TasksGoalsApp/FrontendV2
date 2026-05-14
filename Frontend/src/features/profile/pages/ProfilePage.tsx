import React from 'react';
import { getCurrentUserId } from '@/features/auth/utils/auth-token';
import { useUser } from '../hooks/useProfile';
export const ProfilePage: React.FC = () => {
    // const profile = {
    //     name: 'John Doe',
    //     username: 'johndoe',
    //     email: 'john.doe@example.com',
    //     bio: 'Full-stack developer | Coffee enthusiast',
    //     joinDate: 'January 2023',
    // };

    const userId = getCurrentUserId();
    if (!userId) {
        return <p>User not authenticated.</p>;
    }
    const { user, isLoading, errorMessage } = useUser(userId);

    if (isLoading) {
        return <p>Loading profile...</p>;
    }

    if (errorMessage) {
        return <p>{errorMessage}</p>;
    }

    if (!user) {
        return <p>No user data.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
                {/* Header */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                        JD
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                        <p className="text-lg text-gray-600">@{user.username}</p>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="space-y-4 border-t pt-6">
                    <div>
                        <p className="text-sm font-semibold text-gray-600">EMAIL</p>
                        <p className="text-gray-900">{user.email}</p>
                    </div>
                    {/* <div>
                        <p className="text-sm font-semibold text-gray-600">BIO</p>
                        <p className="text-gray-900">{user.bio}</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-600">MEMBER SINCE</p>
                        <p className="text-gray-900">{profile.joinDate}</p>
                    </div> */}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Edit Profile
                    </button>
                    <button className="flex-1 bg-gray-200 text-gray-900 py-2 rounded hover:bg-gray-300">
                        Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;