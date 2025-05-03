'use server'

import { cookies } from "next/headers"

export async function logOut() {
    (await cookies()).delete('session')
}