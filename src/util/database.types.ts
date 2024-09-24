export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Comanda: {
        Row: {
          fk_id_cuenta: number | null
          id_comanda: number
          st_terminada: boolean
        }
        Insert: {
          fk_id_cuenta?: number | null
          id_comanda?: number
          st_terminada?: boolean
        }
        Update: {
          fk_id_cuenta?: number | null
          id_comanda?: number
          st_terminada?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Comanda_fk_id_cuenta_fkey"
            columns: ["fk_id_cuenta"]
            isOneToOne: false
            referencedRelation: "Cuenta"
            referencedColumns: ["id_cuenta"]
          },
        ]
      }
      Complementa: {
        Row: {
          fk_id_ingrediente: number | null
          fk_id_orden: number
        }
        Insert: {
          fk_id_ingrediente?: number | null
          fk_id_orden?: number
        }
        Update: {
          fk_id_ingrediente?: number | null
          fk_id_orden?: number
        }
        Relationships: [
          {
            foreignKeyName: "Complementa_fk_id_ingrediente_fkey"
            columns: ["fk_id_ingrediente"]
            isOneToOne: false
            referencedRelation: "Ingrediente Extra"
            referencedColumns: ["id_ingrediente"]
          },
        ]
      }
      Cuenta: {
        Row: {
          fk_id_mesa: number | null
          fk_id_trabajador: number | null
          id_cuenta: number
          nu_estado_cuenta: boolean
          nu_total: number | null
          txt_creado: string | null
        }
        Insert: {
          fk_id_mesa?: number | null
          fk_id_trabajador?: number | null
          id_cuenta?: number
          nu_estado_cuenta?: boolean
          nu_total?: number | null
          txt_creado?: string | null
        }
        Update: {
          fk_id_mesa?: number | null
          fk_id_trabajador?: number | null
          id_cuenta?: number
          nu_estado_cuenta?: boolean
          nu_total?: number | null
          txt_creado?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Cuenta_fk_id_mesa_fkey"
            columns: ["fk_id_mesa"]
            isOneToOne: false
            referencedRelation: "Mesa"
            referencedColumns: ["id_mesa"]
          },
          {
            foreignKeyName: "Cuenta_fk_id_trabajador_fkey"
            columns: ["fk_id_trabajador"]
            isOneToOne: false
            referencedRelation: "Trabajador"
            referencedColumns: ["id_trabajor"]
          },
        ]
      }
      "Estado de Mesa": {
        Row: {
          id_edo_mesa: number
          txt_nombre: string
        }
        Insert: {
          id_edo_mesa?: number
          txt_nombre: string
        }
        Update: {
          id_edo_mesa?: number
          txt_nombre?: string
        }
        Relationships: []
      }
      Incluye: {
        Row: {
          fk_id_ingrediente: number
          fk_id_platillo: number | null
        }
        Insert: {
          fk_id_ingrediente?: number
          fk_id_platillo?: number | null
        }
        Update: {
          fk_id_ingrediente?: number
          fk_id_platillo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Incluye_fk_id_ingrediente_fkey"
            columns: ["fk_id_ingrediente"]
            isOneToOne: true
            referencedRelation: "Ingrediente Extra"
            referencedColumns: ["id_ingrediente"]
          },
          {
            foreignKeyName: "Incluye_fk_id_platillo_fkey"
            columns: ["fk_id_platillo"]
            isOneToOne: false
            referencedRelation: "Platillo"
            referencedColumns: ["id_platillo"]
          },
        ]
      }
      "Ingrediente Extra": {
        Row: {
          id_ingrediente: number
          nu_cantidad: number
          nu_precio: number
          txt_creado: string | null
          txt_nombre: string
        }
        Insert: {
          id_ingrediente?: number
          nu_cantidad: number
          nu_precio: number
          txt_creado?: string | null
          txt_nombre: string
        }
        Update: {
          id_ingrediente?: number
          nu_cantidad?: number
          nu_precio?: number
          txt_creado?: string | null
          txt_nombre?: string
        }
        Relationships: []
      }
      Mesa: {
        Row: {
          fk_id_edo_mesa: number
          id_mesa: number
          nu_mesa: number
        }
        Insert: {
          fk_id_edo_mesa?: number
          id_mesa?: number
          nu_mesa: number
        }
        Update: {
          fk_id_edo_mesa?: number
          id_mesa?: number
          nu_mesa?: number
        }
        Relationships: [
          {
            foreignKeyName: "Mesa_fk_id_edo_mesa_fkey"
            columns: ["fk_id_edo_mesa"]
            isOneToOne: false
            referencedRelation: "Estado de Mesa"
            referencedColumns: ["id_edo_mesa"]
          },
        ]
      }
      Orden: {
        Row: {
          fk_id_comanda: number | null
          fk_id_platillo: number
          id: number
          st_terminado: boolean | null
          txt_comentario: string | null
        }
        Insert: {
          fk_id_comanda?: number | null
          fk_id_platillo: number
          id?: number
          st_terminado?: boolean | null
          txt_comentario?: string | null
        }
        Update: {
          fk_id_comanda?: number | null
          fk_id_platillo?: number
          id?: number
          st_terminado?: boolean | null
          txt_comentario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Orden_fk_id_comanda_fkey"
            columns: ["fk_id_comanda"]
            isOneToOne: false
            referencedRelation: "Comanda"
            referencedColumns: ["id_comanda"]
          },
          {
            foreignKeyName: "Orden_fk_id_platillo_fkey"
            columns: ["fk_id_platillo"]
            isOneToOne: false
            referencedRelation: "Platillo"
            referencedColumns: ["id_platillo"]
          },
        ]
      }
      Platillo: {
        Row: {
          id_platillo: number
          nu_cantidad: number
          nu_precio: number
          txt_creado: string | null
          txt_nombre: string
        }
        Insert: {
          id_platillo?: number
          nu_cantidad: number
          nu_precio: number
          txt_creado?: string | null
          txt_nombre: string
        }
        Update: {
          id_platillo?: number
          nu_cantidad?: number
          nu_precio?: number
          txt_creado?: string | null
          txt_nombre?: string
        }
        Relationships: []
      }
      Rol: {
        Row: {
          id_rol: number
          txt_nombre: string
        }
        Insert: {
          id_rol?: number
          txt_nombre: string
        }
        Update: {
          id_rol?: number
          txt_nombre?: string
        }
        Relationships: []
      }
      Trabajador: {
        Row: {
          fk_id_rol: number | null
          fk_id_usuario: string | null
          id_trabajor: number
        }
        Insert: {
          fk_id_rol?: number | null
          fk_id_usuario?: string | null
          id_trabajor?: number
        }
        Update: {
          fk_id_rol?: number | null
          fk_id_usuario?: string | null
          id_trabajor?: number
        }
        Relationships: [
          {
            foreignKeyName: "Trabajador_fk_id_rol_fkey"
            columns: ["fk_id_rol"]
            isOneToOne: false
            referencedRelation: "Rol"
            referencedColumns: ["id_rol"]
          },
          {
            foreignKeyName: "Trabajador_fk_id_usuario_fkey"
            columns: ["fk_id_usuario"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
