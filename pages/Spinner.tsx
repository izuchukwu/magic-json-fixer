import React from 'react'
import Loader from 'react-loader'
import {Text, Box, BoxProps} from '@mantine/core'

export type SpinnerProps = {
	loaded?: boolean
	color?: 'light' | 'dark'
	size?: 'sm' | 'md'
} & BoxProps

/**
 * Indicates progress in the form of a spinner
 *
 * @note The `react-loader` library that this component uses
 * `UNSAFE_componentWillReceiveProps`. In development, React will display an
 * error in the console about its use in strict mode.
 */
export const Spinner = ({
	loaded = false,
	color = 'light',
	size = 'md',
	...props
}: SpinnerProps) => (
	<Box {...props}>
		<Box sx={{position: 'relative'}}>
			<Loader
				loaded={loaded}
				lines={6}
				length={{sm: 2, md: 2}[size]}
				width={{sm: 2, md: 3}[size]}
				radius={{sm: 3, md: 4}[size]}
				corners={6}
				rotate={90}
				color={color === 'light' ? '#fff' : '#000'}
				hwaccel={true}
				speed={1.45}
			/>
		</Box>
	</Box>
)

export default Spinner
