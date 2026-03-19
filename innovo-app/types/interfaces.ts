export interface Ate {
  id_ate: string | null;
  direccion: string | null;
  sector: string | null;
  tipo: string | null;
  comentario: string | null;
  lat: number | null;
  lng: number | null;
  numeroMedidor: number | null;
  fotoUri: string | null;
}
export interface TipoNovedad {
  _id: string;
  value: string;
}
export interface Notificacion {
  id: string;
  tipo: string;
  titulo: string| null;
  mensaje: string|null;
  contenido: string|null;
  fecha: string;
  url: string;
  estado: boolean;
}
export interface NotificacionSection {
  title: string;           // "Hoy", "Ayer" o la fecha formateada
  data: Notificacion[];    // array de notificaciones para esa sección
}
export interface Asignacion {
  fecha_asignacion: string;
  ruta: string;
  sector: string;
  tipo: string;
  direcciones: number;
  ate?: number;
  empresa?: string;
}
export interface DataOffline {
  _id: string;
  calle: string;
  NumeroMedidor: number;
}
export interface Novedad {
  direccion: string | null;
  numeroMedidor: number | null;
  comentario: string | null;
  lectura: number | null;
  foto: string[] | null;
  tipoNovedad: string | null;
}
export interface Documento {
  _id: string;
  fecha: string;
  formato: string;
  tipo: { id: string; value: string };
  url: string;
}
export interface DatoPerfil {
  Nombre: string;
  Rut: string;
  perfil: string;
  cargo: "administracion" | "lector" | "supervisor" | "inspector";
  correo: string;
  documentos: Documento[];
}
export interface OmnipotentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  setDireccion: (direccion: string) => void;
  editable: boolean;
}
export interface MeterNumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  setDireccion: (direccion: string) => void;
  editable: boolean;
}
export interface GlobalContextProps {
    newNovedad: Novedad;
    setNewNovedad: (novedad: Novedad) => void;
    updateNovedad: (key: keyof Novedad, value: Novedad[keyof Novedad]) => void;
    newAte: Ate;
    setNewAte: (ate: Ate) => void;
    tipoNovedad: TipoNovedad[];
    clearAte: () => void;
    notificaciones: any;
    setNotificaciones: (notificaciones: any) => void;
    asignaciones: Asignacion[];
    markedDates: any;
    calendarSelected: Asignacion | undefined;
    setCalendarSelected: (asignacion: Asignacion | undefined) => void;
    offLine: DataOffline[];
    setOffLine: (data: DataOffline[]) => void;
    dataAte: Ate[];
    setDataAte: (data: Ate[]) => void;
    photoUri: string | null; 
    setPhotoUri: (uri: string | null) => void;
  }
  