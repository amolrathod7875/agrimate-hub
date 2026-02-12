import React, { createContext, useContext, useState, ReactNode } from "react";

interface ProfileData {
  name: string;
  age: string;
  gender: string;
  state: string;
  district: string;
  location: string;
  avatar: string | null;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const defaultProfile: ProfileData = {
  name: "Kisan",
  age: "",
  gender: "",
  state: "",
  district: "",
  location: "",
  avatar: null,
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const updateProfile = (data: Partial<ProfileData>) =>
    setProfile((prev) => ({ ...prev, ...data }));
  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
