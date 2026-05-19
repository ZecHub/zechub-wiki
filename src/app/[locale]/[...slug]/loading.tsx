export default function Loading(){
    return (
        <main className="container m-auto px-4 py-8">
            <div className="h-10 w-2/3 animate-pulse mb-6 rounded bg-slate-200 dark:bg-slate-700"/>

            <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700"/>
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"/>
                <div className="h-4 w-4/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700"/>
            </div>
        </main>
    )
}
