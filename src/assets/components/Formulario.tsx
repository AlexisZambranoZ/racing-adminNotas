import { useState, useEffect } from "react";
import { Combobox } from "@headlessui/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
/* import productosData from "../data/productos.json"; */
import type { Producto } from "../data/db";
import Modal from "./Modal";
import Toast from "./Toast";

interface ItemResumen {
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export default function Formulario() {
    const [query, setQuery] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
    const [cantidad, setCantidad] = useState(1);
    const [precio, setPrecio] = useState<number>(0);
    const [dobleCabina, setDobleCabina] = useState(false);
    const [precioExtension, setPrecioExtension] = useState(0);
    const [resumen, setResumen] = useState<ItemResumen[]>([]);

    const [cliente, setCliente] = useState("");
    const [fecha, setFecha] = useState("");
    const [notas, setNotas] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => { });

    /*     const productos = productosData as Producto[]; */

    const [showToast, setShowToast] = useState(false);

    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    const filteredProductos =
        query === ""
            ? productos
            : productos.filter((producto) =>
                producto.nombre.toLowerCase().includes(query.toLowerCase())
            );

    useEffect(() => {
        const now = new Date();
        setFecha(now.toISOString().split("T")[0]);
    }, []);



    const handleAgregar = () => {
        if (!productoSeleccionado || precio <= 0 || cantidad <= 0) return;

        // Lógica de agregar producto al resumen
        const nombre = dobleCabina
            ? `${productoSeleccionado.nombre} (D/C)`
            : productoSeleccionado.nombre;

        const precioUnitario = precio + (dobleCabina ? precioExtension : 0);
        const subtotal = precioUnitario * cantidad;

        setResumen((prev) => [
            ...prev,
            { nombre, cantidad, precioUnitario, subtotal },
        ]);

        // Resetear valores del formulario
        setProductoSeleccionado(null);
        setCantidad(1);
        setDobleCabina(false);
        setPrecioExtension(0);
        setPrecio(0);
        setQuery("");

        // 👉 Mostrar toast temporal
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const response = await fetch(
                    "https://raw.githubusercontent.com/AlexisZambranoZ/racing-items/main/productos.json"
                );
                const data = await response.json();
                console.log(data);
                setProductos(data);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    if (loading) return <p>Cargando productos...</p>;

    const abrirModal = (mensaje: string, accionConfirmar: () => void) => {
        setModalMessage(mensaje);
        setOnConfirmAction(() => accionConfirmar);
        setModalOpen(true);
    };

    const handleEliminar = (index: number) => {
        abrirModal("¿Estás seguro que quieres eliminar este item?", () => {
            setResumen((prev) => prev.filter((_, i) => i !== index));
            setModalOpen(false);
        });
    };

    const handleReiniciar = () => {
        abrirModal("¿Estás seguro que quieres reiniciar toda la nota?", () => {
            setCliente("");
            const now = new Date();
            setFecha(now.toISOString().split("T")[0]);
            setNotas("");
            setResumen([]);
            setProductoSeleccionado(null);
            setQuery("");
            setModalOpen(false);
        });
    };

    const handleGenerarPDF = () => {
        if (!cliente) {
            alert("Por favor ingresa el nombre del cliente antes de generar el PDF.");
            return;
        }

        const now = new Date();
        const fechaActual = now.toISOString().split("T")[0];
        const horaActual = now.toTimeString().slice(0, 5);

        const doc = new jsPDF({ unit: "pt", format: "letter" });
        const imgData = "/img/plantilla_notaRacing.png";
        doc.addImage(imgData, "PNG", 0, 0, 612, 792);

        doc.setFontSize(16);
        doc.text("Nota de Remisión", 40, 60);

        doc.setFontSize(12);
        doc.text(`Cliente: ${cliente}`, 40, 90);
        doc.text(`Fecha: ${fechaActual}`, 40, 110);
        doc.text(`Hora: ${horaActual}`, 40, 130);
        doc.text(`Notas: ${notas}`, 40, 150);

        autoTable(doc, {
            startY: 170,
            head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
            body: resumen.map((item) => [
                item.nombre,
                item.cantidad.toString(),
                `$${item.precioUnitario.toFixed(2)}`,
                `$${item.subtotal.toFixed(2)}`,
            ]),
            theme: "plain",
            styles: {
                textColor: "#000000",
                halign: "left",
                fontSize: 10,
                cellPadding: 4,
                lineWidth: 0,
                fillColor: false,
            },
            headStyles: {
                fontStyle: "bold",
                textColor: "#000000",
                fillColor: false,
                lineWidth: 0,
            },
        });

        const nombreSanitizado = cliente.trim().replace(/\s+/g, "");
        const nombreArchivo = `${nombreSanitizado}_${fechaActual}_${horaActual}.pdf`;
        doc.save(nombreArchivo);
    };




    const total = resumen.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <div className="p-4 min-w-full rounded max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Nota de Remisión</h2>

            {/* Datos generales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold">
                <input type="text" className="border p-2 w-full" placeholder="Nombre del cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} />
                <input type="date" className="border p-2 w-full" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                <textarea className="border p-2 w-full col-span-1 md:col-span-2" placeholder="Notas adicionales" rows={3} value={notas} onChange={(e) => setNotas(e.target.value)} />
            </div>

            <hr className="my-6 border-t-2 border-gray-300" />

            {/* Formulario de productos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-bold">
                <Combobox value={productoSeleccionado} onChange={(value) => { setProductoSeleccionado(value); setPrecio(value ? value.precio : 0); setQuery(""); }}>
                    <div className="relative">
                        <Combobox.Input
                            className="border p-2 w-full"
                            displayValue={(producto: Producto) => producto?.nombre || ""}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Escribe o selecciona un producto"
                        />
                        <Combobox.Options className="absolute z-10 bg-white w-full border max-h-60 overflow-auto">
                            {filteredProductos.length === 0 && query !== "" ? (
                                <Combobox.Option
                                    value={{ id: Date.now(), nombre: query, precio: 0, cantidad: 1, dobleCabina: false, cabinaYCuarto: false }}
                                    className="cursor-pointer px-4 py-2 text-gray-500"
                                >
                                    Añadir: "{query}"
                                </Combobox.Option>
                            ) : (
                                filteredProductos.map((producto) => (
                                    <Combobox.Option
                                        key={producto.id}
                                        value={producto}
                                        className={({ active }) => `px-4 py-2 cursor-pointer ${active ? "bg-blue-100" : ""}`}
                                    >
                                        {producto.nombre}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </div>
                </Combobox>

                <input type="number" className="border p-2 w-full" placeholder="Precio" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
                <input type="number" className="border p-2 w-full" placeholder="Cantidad" value={cantidad} min={1} onChange={(e) => setCantidad(Number(e.target.value))} />

            </div>

            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-4xl w-full" onClick={handleAgregar} disabled={!productoSeleccionado}>
                Agregar
            </button>

            {resumen.length > 0 && (
                <>
                    <div className="flex justify-between gap-4 mt-6">
                        <button onClick={handleReiniciar} className="bg-red-500 text-white px-4 py-2 cursor-pointer rounded-2xl">Reiniciar Nota</button>
                        <button onClick={handleGenerarPDF} className="bg-green-600 text-white px-4 py-2 cursor-pointer rounded-2xl">Generar PDF</button>
                    </div>

                    <div className="overflow-x-auto mt-4">
                        <table className="table-auto min-w-full border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2 text-left">Producto</th>
                                    <th className="border px-4 py-2 text-left">Cantidad</th>
                                    <th className="border px-4 py-2 text-left">Precio Unitario</th>
                                    <th className="border px-4 py-2 text-left">Subtotal</th>
                                    <th className="border px-4 py-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resumen.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border px-4 py-2">{item.nombre}</td>
                                        <td className="border px-4 py-2">{item.cantidad}</td>
                                        <td className="border px-4 py-2">${item.precioUnitario.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="border px-4 py-2">${item.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="border px-4 py-2">
                                            <button onClick={() => handleEliminar(index)} className="text-red-600 hover:underline cursor-pointer">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="font-bold bg-gray-100">
                                    <td colSpan={3} className="border px-4 py-2 text-right">Total</td>
                                    <td className="border px-4 py-2">${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="border px-4 py-2"></td>
                                </tr>
                            </tbody>
                        </table>

                        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={onConfirmAction} message={modalMessage} />

                        {showToast && <Toast mensaje="Producto agregado correctamente" />}
                    </div>
                </>
            )}
        </div>
    );
}
