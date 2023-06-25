declare namespace Discord {
  type Guild = {
    id: string
    name: string
    icon: string
    owner: boolean
    // Hash
    permissions: string
    features: string[]
  }
}
