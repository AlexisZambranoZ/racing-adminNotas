export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    dobleCabina: boolean;
    cabinaYCuarto: boolean;
}

export const productos: Producto[] = [
    {
        id: 1,
        nombre: "Camioneta Toyota Hilux",
        precio: 120,
        cantidad: 2,
        dobleCabina: true,
        cabinaYCuarto: false
    },
    {
        id: 2,
        nombre: "Camión Ford F-350",
        precio: 120,
        cantidad: 1,
        dobleCabina: false,
        cabinaYCuarto: true
    },
    {
        id: 3,
        nombre: "Pickup Nissan NP300",
        precio: 120,
        cantidad: 3,
        dobleCabina: true,
        cabinaYCuarto: false
    },
    {
        id: 4,
        nombre: "Camión Isuzu ELF",
        precio: 120,
        cantidad: 1,
        dobleCabina: false,
        cabinaYCuarto: true
    },
    {
        id: 5,
        nombre: "Van Renault Kangoo",
        precio: 120,
        cantidad: 2,
        dobleCabina: false,
        cabinaYCuarto: false
    }
];


