

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (/* From Uiverse.io by satyamchaudharydev */
        <div className="flex flex-row justify-center items-center w-full h-screen">
            <div className="spinner my-12">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>)
}