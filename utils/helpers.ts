import { User } from "@supabase/supabase-js";


export function footerHideWhen(path: string) {
    let pathLists = ['/start-with', '/my-profile', '/profile/', '/review/']
    let result = true
    pathLists.forEach((p) => {
        if (path.includes(p))
            result = false;
    })
    return result
}

export function hideHeaderOptions(path: string) {
    let pathLists = ['/start-with', '/my-profile', '/profile/','/profile/', '/review/']
    let result = true
    pathLists.forEach((p) => {
        if (path.includes(p))
            result = false;
    })
    return result
}

export function hideLoginButton(path: string) {
    let pathLists = ['/start-with']
    let result = true
    pathLists.forEach((p) => {
        if (path.includes(p))
            result = false;
    })
    return result
}

export function getUserName(user: User) {
    return user.user_metadata.full_name;
}

export function getUserPic(user: User) {
    return user.user_metadata.picture;
}

export function getName(user: any) {
    return user.firstName + " " + user.lastName;
}

export function getPic(user: any) {
    return user.photoUrl;
}