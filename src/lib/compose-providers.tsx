import type { ComponentType, ReactNode } from "react"

type ProviderComponent = ComponentType<{ children: ReactNode }>

/**
 * Composes multiple provider components into a single wrapper component.
 * Reduces nesting and improves readability when using multiple providers.
 *
 * @example
 * ```tsx
 * const Providers = composeProviders(
 *   ThemeProvider,
 *   AuthProvider,
 *   QueryProvider
 * )
 *
 * <Providers>
 *   <App />
 * </Providers>
 * ```
 */
export function composeProviders(
	...providers: ProviderComponent[]
): ProviderComponent {
	return function ComposedProviders({ children }: { children: ReactNode }) {
		return providers.reduceRight<ReactNode>(
			(acc, Provider) => <Provider>{acc}</Provider>,
			children
		)
	}
}
