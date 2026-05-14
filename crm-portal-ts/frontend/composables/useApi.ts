export const useApi = () => {
  const config = useRuntimeConfig()

  const get = async <T>(url: string): Promise<T> => {
    return await $fetch<T>(`${config.public.apiBase}${url}`)
  }

  return {
    get
  }
}
