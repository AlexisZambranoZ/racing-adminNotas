




export default function Toast({ mensaje }: { mensaje: string }) {
    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in-out">
            {mensaje}
        </div>
    );
}