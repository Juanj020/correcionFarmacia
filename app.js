import express from "express";
import mongo from "mongodb";
const server = express();

const url = "mongodb+srv://juanj202122:12345@farmaciacluster.tanirud.mongodb.net/";

const client = new mongo.MongoClient(url);

client.connect();
const basedatos = client.db("farmaciadb");

const getMedicamentos = async (req, res) => {
    const coleccion = basedatos.collection("Medicamentos");
    const Resultado = await coleccion.find({ stock: { $lt: 50 } }).toArray();
    res.json(Resultado);
};

const getProveedoresCon = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        /* const projection = { projection: { "proveedor.nombre": 1, "proveedor.contacto": 1, "_id": 0 } };
            const Resultado = await coleccion.find({}, projection).toArray(); */
        const Resultado = await coleccion.distinct("proveedor");
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getProveedorA = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        const Resultado = await coleccion.find({ "proveedor.nombre": "ProveedorA" }).toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosFecha = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        const Resultado = await coleccion.find({
            fechaExpiracion: { $gt: new Date("2023-01-01T00:00:00.000+00:00") },
        }).toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getTotalVentas = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        const Resultado = await coleccion
            .aggregate([
                { $match: { nombre: "Paracetamol" } },
                {
                    $project: {
                        totalValue: { $multiply: ["$precio", "$stock"] },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosVencidos = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        const Resultado = await coleccion
            .find({
                fechaExpiracion: { $lt: new Date("2024-01-01T00:00:00.000+00:00") },
            })
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosProveedor = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Compras");
        const Result = await coleccion
            .aggregate([
                {
                    $project: {
                        "proveedor.nombre": 1,
                        "medicamentosComprados.cantidadComprada": 1,
                        _id: 0,
                    },
                },
            ])
            .toArray();
        res.json(Result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getVentaTotal = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion
            .aggregate([
                { $unwind: "$medicamentosVendidos" },
                {
                    $project: {
                        totalDinero: {
                            $multiply: [
                                "$medicamentosVendidos.cantidadVendida",
                                "$medicamentosVendidos.precio",
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        sumaTotal: { $sum: "$totalDinero" },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentoSinVender = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion
            .find(
                { "medicamentosVendidos.cantidadVendida": { $eq: 0 } },
                { "medicamentosVendidos.nombreMedicamento": 1 }
            )
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosCaro = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        const Resultado = await coleccion
            .aggregate([
                {
                    $group: {
                        _id: null,
                        masCaro: { $max: "$precio" },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getNumMedicamentosProveedor = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Compras");
        const Resultado = await coleccion
            .aggregate([
                {
                    $project: {
                        "   ": 1,
                        "medicamentosComprados.cantidadComprada": 1,
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosxProveedor = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion
            .aggregate([
                {
                    $project: {
                        "paciente.nombre": 1,
                        "medicamentosVendidos.nombreMedicamento": 1,
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getNoVendioProveedor = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Compras");
        const Resultado = await coleccion
            .aggregate([
                {
                    $match: {
                        fechaCompra: { $lt: new Date("2024-01-01T00:00:00.000Z") },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosVencidosMarzo = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion
            .aggregate([
                {
                    $unwind: "$medicamentosVendidos",
                },
                {
                    $match: {
                        $and: [
                            { fechaVenta: { $gt: new Date("2023-02-28T00:00:00.000Z") } },
                            { fechaVenta: { $lt: new Date("2023-04-01T00:00:00.000Z") } },
                        ],
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalVentas: { $sum: "$medicamentosVendidos.cantidadVendida" },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
};

const getMedicamentosMenosVendidos = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion
            .aggregate([
                {
                    $match: {
                        $and: [
                            { fechaVenta: { $gte: new Date("2023-01-01T00:00:00.000Z") } },
                            { fechaVenta: { $lte: new Date("2024-12-31T00:00:00.000Z") } },
                        ],
                    },
                },
                {
                    $sort: {
                        "medicamentosVendidos.cantidadVendida": 1,
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getGananciaPorProveedor = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Compras");
        const Resultado = await coleccion
            .aggregate([
                {
                    $match: {
                        $and: [
                            { fechaCompra: { $gte: new Date("2023-01-01T00:00:00.000Z") } },
                            { fechaCompra: { $lte: new Date("2024-12-31T00:00:00.000Z") } },
                        ],
                    },
                },
                {
                    $unwind: "$medicamentosComprados",
                },
                {
                    $group: {
                        _id: "$proveedor.nombre",
                        totalGanancia: {
                            $sum: {
                                $multiply: [
                                    "$medicamentosComprados.cantidadComprada",
                                    "$medicamentosComprados.precioCompra",
                                ],
                            },
                        },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getPromedioVenta = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion
            .aggregate([
                {
                    $unwind: "$medicamentosVendidos",
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: {
                                $divide: [
                                    "$medicamentosVendidos.cantidadVendida",
                                    "$medicamentosVendidos.precio",
                                ],
                            },
                        },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getVentasEmpleado = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion
            .aggregate([
                {
                    $unwind: "$medicamentosVendidos",
                },
                {
                    $group: {
                        _id: "$empleado.nombre",
                        total: {
                            $sum: "$medicamentosVendidos.cantidadVendida",
                        },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.log(error);
    }
};

const getMedicamentosExpe = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        const Resultado = await coleccion
            .aggregate([
                {
                    $match: {
                        fechaExpiracion: {
                            $gte: new Date("2024-01-01T00:00:00.000+00:00"),
                        },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.log(error);
    }
};

const getVentasEmpleado5 = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion.aggregate([
                {
                    $unwind: "$medicamentosVendidos",
                },
                {
                    $group: {
                        _id: "$empleado.nombre",
                        total: {
                            $sum: "$medicamentosVendidos.cantidadVendida",
                        },
                    },
                },
            ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.log(error);
    }
};


const getMedicamentosNunca = async (req, res) => {
    try {
        const collection = basedatos.collection("Medicamentos");
        const data = await collection.aggregate([
            {
                $lookup: {
                    from: 'Ventas',
                    localField: "nombre",
                    foreignField: "medicamentosVendidos.nombreMedicamento",
                    as: "noVendidos"
                }
            },
            {
                $match: { "noVendidos": [] }
            },
        ]).toArray()
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
}

const getPacineteMasGasta = async (req, res) => {
    try {
        const collection = basedatos.collection('Ventas')
        const data = await collection.aggregate([
            { $unwind: "$medicamentosVendidos" },
            {
                $match: {
                    "fechaVenta": {
                        $gte: new Date("2023-01-01"),
                        $lt: new Date("2024-01-01")
                    }
                }
            },
            {
                $group: {
                    _id: "$paciente.nombre",
                    total: {
                        $sum: {
                            $multiply: ["$medicamentosVendidos.cantidadVendida", "$medicamentosVendidos.precio"] // multiplica
                        }
                    }
                }
            }, { $sort: { "total": -1 } }
        ]).limit(1).toArray();
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
}

const getEmpleadosNoneVentas = async (req, res) => {
    try {
        const collection = basedatos.collection('Empleados')
        const data = await collection.aggregate([
            {
                $lookup: {
                    from: 'Ventas',
                    localField: 'nombre',
                    foreignField: 'empleado.nombre',
                    as: 'ventas'
                }
            },
            {
                $match: { "ventas": [] }
            }
        ]).toArray();
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
}

const getProveedorMasMedicos = async (req, res) => {
    try {
        const collection = basedatos.collection('Proveedores');
        const data = await collection.aggregate([
            {
                $lookup: {
                    from: "Compras",
                    localField: "nombre",
                    foreignField: "proveedor.nombre",
                    as: "provee"
                }
            },
            {
                $unwind: "$provee"
            },
            {
                $unwind: "$provee.medicamentosComprados"
            },
            {
                $match: {
                    "provee.fechaCompra": {
                        $gte: new Date("2023-01-01"),
                        $lt: new Date("2024-01-01")
                    }
                }
            },
            {
                $group: {
                    _id: "$_id",
                    nombre: { $first: "$nombre" },
                    direccion: { $first: "$direccion" },
                    totalCantidadComprada: {
                        $sum: "$provee.medicamentosComprados.cantidadComprada"
                    }
                }
            },
            {
                $sort: { totalCantidadComprada: -1 }
            }
        ]).limit(1).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
}

const getComprasParacetamol2023 = async (req, res) => {
    try {
        const collection = basedatos.collection('Ventas');
        const data = await collection.aggregate([
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $match: {
                    "fechaVenta": {
                        $gte: new Date("2023-01-01"),
                        $lt: new Date("2024-01-01")
                    }
                }
            },
            {
                $match: { "medicamentosVendidos.nombreMedicamento": "Paracetamol" } // filtra
            }
        ]).toArray();
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
}

const getVentasMedicamentoMes = async (req, res) => {
    try {
        const collection = basedatos.collection('Ventas');
        const data = await collection.aggregate([
            {
                $project: {
                    mesVenta: { $month: '$fechaVenta' },
                },
            },
            {
                $group: {
                    _id: '$mesVenta',
                    totalVentas: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            }
        ]).toArray();
        res.json(data)
    } catch (error) {

    }
}

const getEmpleadosMeno5Ventas = async (req, res) => {
    try {
        const collection = basedatos.collection('Empleados')
        const data = await collection.aggregate([
            {
                $lookup: {
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "empleado.nombre",
                    as: "ventas"
                }
            },
            {
                $project: {
                    nombre: 1,
                    cantidadVentas: { $size: "$ventas" }
                }
            },
            {
                $match: {
                    cantidadVentas: { $lt: 5 }
                }
            }
        ]).toArray();
        res.json(data)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
}

const getTotalProveedores = async (req, res) => {
    try {
        const collection = basedatos.collection('Medicamentos');
        const data = await collection.distinct("proveedor.nombre");
        res.json({ "TotalProveedores": data.length })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
}




const getMedicamentosMenos50 = async (req, res) => {
    try {
        const collection = basedatos.collection("Medicamentos");
        const data = await collection.aggregate([
            {
                $match: {
                    "stock": { $lt: 50 }
                }
            },
            {
                $group: {
                    _id: "$proveedor.nombre"
                }
            },
            {
                $project: {
                    _id: 0,
                    "nombreProveedor": "$_id"
                }
            }
        ]).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getPacienteNuncaCompro2023 = async (req, res) => {
    try {
        const collection = basedatos.collection("Pacientes");
        const data = await collection.aggregate([
            {
                $lookup: {
                    from: 'Ventas',
                    localField: 'nombre',
                    foreignField: 'paciente.nombre',
                    as: 'ventas'
                }
            },
            {
                $match: {
                    ventas: { $size: 0 }
                }
            }
        ]).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosMes = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion.aggregate([
            {
                $project: {
                    mesVenta: { $month: '$fechaVenta' },
                },
            },
            {
                $group: {
                    _id: '$mesVenta',
                    totalVentas: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    mes: '$_id',
                    totalVentas: 1,
                },
            },
            {
                $sort: { mes: 1 },
            }
        ])
            .toArray();
        res.json(Resultado);
    } catch (error) {
        console.log(error);
    }
};

const getEmpleadoMayorCantidad = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion.aggregate([
            {
                $match: {
                    fechaVenta: {
                        $gte: new Date("2023-01-01T00:00:00.000Z"),
                        $lt: new Date("2024-01-01T00:00:00.000Z")
                    }
                }
            },
            {
                $unwind: "$medicamentosVendidos"
            },
            {
                $group: {
                    _id: {
                        empleado: "$empleado.nombre",
                        medicamento: "$medicamentosVendidos.nombreMedicamento"
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.empleado",
                    totalMedicamentos: { $sum: 1 }
                }
            },
            {
                $sort: { totalMedicamentos: -1 }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    _id: 0,
                    empleado: "$_id",
                    totalMedicamentos: 1
                }
            }
        ]).toArray();
        res.json(Resultado);
    } catch (error) {
        console.log(error);
    }
};

const getTotalGastosPaciente = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Ventas");
        const Resultado = await coleccion.aggregate([
            {
                $project: {
                    mesVenta: { $month: '$fechaVenta' },
                },
            },
            {
                $group: {
                    _id: '$mesVenta',
                    totalVentas: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            }
        ]).toArray();
        res.json(Resultado);
    } catch (error) {
        console.log(error);
    }
};

const getmedicaNuncaVendido2023 = async (req, res) => {
    try {
        const collection = basedatos.collection("Medicamentos");
        const data = await collection.aggregate([
            {
                $lookup: {
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "medicamentosVendidos.nombreMedicamento",
                    as: "ventas",
                },
            },
            {
                $match: {
                    ventas: { $eq: [] },
                    fechaVenta: {
                        $gte: new Date("2023-01-01T00:00:00.000Z"),
                        $lt: new Date("2023-04-01T00:00:00.000Z"),
                    },
                },
            },
        ]).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getProveedoresMasCinco = async (req, res) => {
    try {
        const collection = basedatos.collection("Compras");
        const data = await collection
            .aggregate([
                {
                    $match: {
                        fechaCompra: {
                            $gte: new Date("2023-01-01T00:00:00.000Z"),
                            $lt: new Date("2024-01-01T00:00:00.000Z"),
                        },
                    },
                },
                {
                    $unwind: "$medicamentosComprados",
                },
                {
                    $group: {
                        _id: {
                            proveedor: "$proveedor.nombre",
                            producto: "$medicamentosComprados.nombreMedicamento",
                        },
                    },
                },
                {
                    $group: {
                        _id: "$_id.proveedor",
                        totalProductos: { $sum: 1 },
                    },
                },
                {
                    $match: {
                        totalProductos: { $gte: 5 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        proveedor: "$_id",
                    },
                },
            ])
            .toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosTrimestre = async (req, res) => {
    try {
        const collection = basedatos.collection("Ventas");
        const data = await collection
            .aggregate([
                {
                    $match: {
                        fechaVenta: {
                            $gte: new Date("2023-01-01T00:00:00.000Z"),
                            $lt: new Date("2023-04-01T00:00:00.000Z"),
                        },
                    },
                },
                {
                    $unwind: "$medicamentosVendidos",
                },
                {
                    $group: {
                        _id: null,
                        totalMedicamentosTrimestre: {
                            $sum: "$medicamentosVendidos.cantidadVendida",
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        totalMedicamentosTrimestre: 1,
                    },
                },
            ])
            .toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getEmpleadosNoVentasAbril = async (req, res) => {
    try {
        const collection = basedatos.collection("Empleados");
        const data = await collection.aggregate([
            {
                $lookup: {
                    from: "Ventas",
                    localField: "nombre",
                    foreignField: "empleado.nombre",
                    as: "ventas",
                },
            },
            {
                $addFields: {
                    ventasEnAbril: {
                        $filter: {
                            input: "$ventas",
                            as: "venta",
                            cond: {
                                $and: [
                                    {
                                        $gte: [
                                            "$$venta.fechaVenta",
                                            new Date("2023-04-01T00:00:00.000Z"),
                                        ],
                                    },
                                    {
                                        $lt: [
                                            "$$venta.fechaVenta",
                                            new Date("2023-05-01T00:00:00.000Z"),
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            },
            {
                $match: {
                    ventasEnAbril: { $size: 0 },
                },
            },
            {
                $project: {
                    _id: 0,
                    nombre: 1,
                },
            }
        ]).toArray();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};

const getMedicamentosStock = async (req, res) => {
    try {
        const coleccion = basedatos.collection("Medicamentos");
        const Resultado = await coleccion.find({ precio: { $gt: 50 }, stock: { $lt: 100 } }).toArray();
        res.json(Resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "f" });
    }
};




/* Rutas */
server.get("/medicamentos", getMedicamentos); //1
server.get("/proveedorescon", getProveedoresCon); //2
server.get("/proveedorA", getProveedorA); //3 
server.get("/medicamentosfecha", getMedicamentosFecha); //4
server.get("/totalVentas", getTotalVentas); //5
server.get("/medicamentosVencidos", getMedicamentosVencidos); //6
server.get("/medicamentosProveedor", getMedicamentosProveedor); //7
server.get("/cantidadVentas", getVentaTotal); //8
server.get("/medicamentoSinVentas", getMedicamentoSinVender); //9 
server.get("/medicamentoCaro", getMedicamentosCaro); //10
server.get("/numMedicamentosProveedor", getNumMedicamentosProveedor); //11
server.get("/medicamentosxProveedor", getMedicamentosxProveedor); //12
server.get("/noVendioProveedor", getNoVendioProveedor); //13
server.get("/medicamentosVencidosMarzo", getMedicamentosVencidosMarzo); //14
server.get("/medicamentosMenosVendidos", getMedicamentosMenosVendidos); //15 
server.get("/gananciaPorProveedor", getGananciaPorProveedor); //16
server.get("/promedioVenta", getPromedioVenta); //17 
server.get("/ventasEmpleado", getVentasEmpleado); //18
server.get("/medicamentosExpe", getMedicamentosExpe); //19
server.get("/getVentasEmpleado5", getVentasEmpleado5); //20
server.get("/medicamentosNunca", getMedicamentosNunca) //21 
server.get("/pacineteMasGasta", getPacineteMasGasta) //22 
server.get("/empleadosNoneVentas", getEmpleadosNoneVentas) //23 
server.get("/proveedorMasMedicos", getProveedorMasMedicos) //24 
server.get("/comprasParacetamol2023", getComprasParacetamol2023) //25 
server.get("/ventasMedicamentoMes", getVentasMedicamentoMes) //26
server.get("/empleadosMeno5Ventas", getEmpleadosMeno5Ventas) //27
server.get("/totalProveedores", getTotalProveedores) //28
server.get("/medicamentosMenos50", getMedicamentosMenos50); //29
server.get("/pacienteNuncaCompro2023", getPacienteNuncaCompro2023); //30
server.get("/medicamentosMes", getMedicamentosMes); //31
server.get("/empleadoMayorCantidad", getEmpleadoMayorCantidad); //32
server.get("/totalGastosPaciente", getTotalGastosPaciente); //33
server.get("/medicaNuncaVendido2023", getmedicaNuncaVendido2023); //34
server.get("/proveedoresMasCinco", getProveedoresMasCinco); //35
server.get("/medicamentosTrimestre", getMedicamentosTrimestre); //36
server.get("/empleadosNoVentasAbril", getEmpleadosNoVentasAbril); //37
server.get("/medicamentosStock", getMedicamentosStock); //38


server.listen(4002, console.log("Se escucha pai"));
