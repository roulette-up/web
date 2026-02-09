export type Product = {
  id: number
  name: string
  stockQuantity: number
  price: number
}

export type ProductDetail = Product & {
  createdAt: string
  modifiedAt: string
}

export type PageMeta = {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export type ProductPage = {
  content: Product[]
  page: PageMeta
}
