// Tabla: Comprador
export interface Comprador {
  codigo_cpr: string; // PK: SMALLINT 
  nombre: string; // VARCHAR(15)
  apellido_paterno: string; // VARCHAR(15)
  apellido_materno: string; // VARCHAR(15)
  direccion: string; // VARCHAR(200)
  correo: string; // VARCHAR(80)
}

// Tabla: Tipo
export interface Tipo {
  id_tpo: string; // PK: SMALLINT
  nombre: string; // VARCHAR(30)
}

// Tabla: Lote 
export interface Lote {
  id_lte: string; // PK: INTEGER
  kilos: number; // DECIMAL
  numero_cajas: number; // SMALLINT
  precio_kilo_salida: number; // DECIMAL
  fecha: string; // DATETIME (ISO string)
}

// Tabla: Especie 
export interface Especie {
  id_epe: string; // PK: INTEGER
  nombre: string; // VARCHAR(25)
  id_lte: string; // FK Lote
  id_tpo: string; // FK Tipo
  imagen: string; // VARCHAR(100) URL
}

// Tabla: Compra
export interface Compra {
  id_cmp: string; // PK: INTEGER
  codigo_cpr: string; // FK Comprador
  id_lte: string; // FK Lote
  precio_kilo_final: number; // DECIMAL
  precio_total: number; // DECIMAL
  fecha: string; // DATETIME
  kilos_vendidos: number;
  cajas_vendidas: number;
}

// Joined Data for UI Display
export interface VentaDetallada extends Compra {
  comprador: Comprador;
  lote: Lote;
  especie?: Especie;
}

export interface LoteDetallado extends Lote {
  especie: Especie;
  tipo?: Tipo;
}

export interface User {
  id: string;
  username: string;
  password?: string; 
  name: string;
  role: 'admin' | 'user';
}
