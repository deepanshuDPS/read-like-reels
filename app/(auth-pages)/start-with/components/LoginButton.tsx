"use client"

import ToastHandler from "@/components_new/Layout/ToastHandler";
import { createClient } from "@/utils/supabase/client";

export default function LoginButton() {

    const signInWithLinkedIn = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'linkedin_oidc',
            options: {
                redirectTo: process.env.NEXT_PUBLIC_BASE_URL_AUTH_CALLBACK,
                scopes: 'openid email profile'
            }
        })
    }

    const signInWithGoogle = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.NEXT_PUBLIC_BASE_URL_AUTH_CALLBACK,
            }
        })
    }

    return (
        <ToastHandler>
            <div
                className="max-w-screen-xl flex h-screen items-center mx-auto"
            >
                <div className="flex-1 flex flex-col min-w-64">
                    <div className="m-auto md:w-4/6">
                        <div className="rounded-xl bg-white shadow-xl">
                            <div className="p-6 sm:p-16">
                                <div className="space-y-4">
                                    <img src="/assets/logo_temp.jpg" loading="lazy" className="w-auto h-16" alt="tailus logo" />
                                    <h2 className="mb-8 text-2xl text-cyan-900 font-bold">Sign in to lead the <br/>Leaders</h2>
                                </div>
                                <div className="mt-8 grid space-y-4">
                                    <button
                                        onClick={() => signInWithGoogle()}
                                        className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
                                        <div className="relative flex items-center space-x-4 justify-center">
                                            <img src="/assets/Icon/google-icon.svg" loading="lazy" className="w-6" alt="tailus logo" />
                                            <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Continue with Google</span>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => signInWithLinkedIn()}
                                        className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
                                        <div className="relative flex items-center space-x-4 justify-center">
                                            <img src="/assets/Icon/linkedin-icon.svg" loading="lazy" className="w-6" alt="tailus logo" />
                                            <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">Sign in with LinkedIn</span>
                                        </div>
                                    </button>
                                </div>

                                <div className="my-10 space-y-4 text-gray-600 text-center sm:-mb-8">
                                    <p className="text-xs">By proceeding, you agree to our <a href="#" className="underline">Terms of Use</a> and confirm you have read our <a href="#" className="underline">Privacy Policy</a>.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToastHandler>
    )
}