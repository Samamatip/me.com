'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface Profile {
    name: string;
    email: string;
    summary: string | null;
    picture: string;
    cv?: string;
    background: string[];
    socials: {
        name: string;
        url: string;
        icon?: string | null;
    }[] | null;
    projects: {
      id: string;
      title: string;
      description: string;
      footnote?: string;
      keyFeatures?: string[];
      tags: string[];
      media?: string;
      href?: string;
      source?: string;
    }[] | null;
    skills: string[] | null;
}

interface ProfileContextType {
    profile: Profile | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/profile');
            
            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }
            
            const data = await response.json();
            setProfile(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <ProfileContext.Provider value={{ profile, loading, error, refetch: fetchProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};