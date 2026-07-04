function Topbar() {
  return (
    <header className="flex items-center justify-between h-14 px-4 md:px-6 bg-white border-b border-gray-200">
      <div className="md:hidden font-bold">Prism</div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
          U
        </div>
      </div>
    </header>
  )
}

export default Topbar