export default function Header() {





    return (
        <header
            style={{ backgroundColor: "#1e1e1e" }} 
            className="text-white py-4 shadow-md"
        >
            <div
                className="
          max-w-6xl mx-auto px-4 
          flex flex-col items-center justify-center text-center
          md:flex-row md:items-center md:justify-start md:text-left md:gap-4
        "
            >
                {/* Logo */}
                <img
                    src="/img/logoRacing2025_03.png"
                    alt="Logo"
                    className="w-28 h-auto"
                />

                {/* Título */}
                <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wide mt-2 md:mt-0">
                    GENERADOR DE NOTAS
                </h1>
            </div>
        </header>


    );


}