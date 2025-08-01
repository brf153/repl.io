const Sidebar = () => {
  return (
    <div className="flex flex-col gap-10 items-center h-full text-white">
        <div className="text-2xl font-bold mt-4">
            Repl.io
        </div>
        <div className="flex flex-col text-left w-full">
            <div className="w-full bg-gray-800 py-1 pl-4">
                main.py
            </div>
            <div className="w-full py-1 pl-4">
                requirements.txt
            </div>
            <div className="w-full py-1 pl-4">
                README.md
            </div>
        </div>
    </div>
  )
}

export default Sidebar