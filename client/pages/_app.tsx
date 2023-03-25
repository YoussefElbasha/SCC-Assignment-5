import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'

export const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
			<Toaster position="bottom-center" />
		</QueryClientProvider>
	)
}
