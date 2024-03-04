export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface ProductBean{

}

export interface Columns{
    name: string;
    required: boolean;
    label: string;
    align: string;
    field: string;
    sortable: boolean;
}

export interface UserCredentialsType {
    username: string,
    password: string,
    language: string,
    remember: boolean
  }
  
  export interface Pagination {
    sortBy: string | null
    descending: boolean
    page: number
    rowsPerPage: number
    rowsNumber?: number
  }

  export interface Devices{
    id?: string,
    model: string,
    category: string,
    rec_price: number,
    produced_year: string,
    created_date: string,
    is_active:boolean,
    description?: string
    img?: string
  }

  export interface Categories{
    id: string,
    name: string,
  }
