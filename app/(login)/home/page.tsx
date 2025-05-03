'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import { logOut } from "@/server-action/log-out";
import { redirect } from "next/navigation";

const HomePage = () => {
    const handleClick = async () => {
        await logOut();
        return redirect("/sign-in");
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1>Welcome to the Home Page</h1>
            <p>This is the starting point of your application.</p>
            <Button onClick={handleClick}>Log Out</Button>
        </div>
    );
};

export default HomePage;