'use client';
 
import { useEffect, useState } from "react";
import httpClient from "../services/http-client.service";
 
export interface Profile {
  id: string;
  username: string;
  githubId: string;
  avatar: string;
  bio: string | null;
  followers: number;
  following: number;
  publicRepos: number;
  lastProfileUpdate: string | null;
  lastRepoUpdate: string | null;
  createdAt: string;
  updatedAt: string;
}
 
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    httpClient
      .get("/api/user/profile")
      .then((res) => setProfile(res as Profile))
      .catch(() => setError("Failed to load profile."))
      .finally(() => setIsLoading(false));
  }, []);
 
  return { profile, isLoading, error };
}
